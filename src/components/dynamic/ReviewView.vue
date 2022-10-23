<script setup>
import supabase from "@/supabase";
import {ref, onMounted} from "vue";
import {useUser} from "@/stores/user";
import {useTime} from "@/stores/time";
import {folder} from "@/stores/images";
import {useRoute, useRouter} from "vue-router";

const {lang, picture, name, logged} = useUser();

const user = useUser();

const {
	params: {type, range, story, id},
} = useRoute();

const {push} = useRouter();

const data = ref();
const media = ref();

const load = ref(false);

const editing = ref(false);
const isUpdatingUser = ref(false);

const rating = ref();
const reviewtext = ref();

const username = ref();
const userpicture = ref();

const userid = ref();

const responseEdit = ref(lang ? "Editar" : "Edit");
const responseDelete = ref(lang ? "Deletar" : "Delete");

const userliked = ref(false);
const likes = ref(0);

const comment = ref("");
const comments = ref([]);

const commentID = ref();
const likesID = ref();

const commentResponse = ref(lang ? "Comentar" : "Comment");

const isComment = ref(false);

async function getReview() {
	supabase
		.from("reviews")
		.select(
			`
		id,
		created,
		rating,
		rewatch,
		updated,
		text,
		story_id(title,released,url,code),
		user_id(id,name,picture),
		likes_id,
		comments_id
		`
		)
		.limit(1)
		.match({id: id})
		.single()
		.then(res => {
			likesID.value = res.data.likes_id;

			commentID.value = res.data.comments_id;

			media.value = res.data.story_id;

			getLikes();
			getComments();

			data.value = {
				id: res.data.user_id.id,
				name: res.data.user_id.name,
				picture: res.data.user_id.picture,
				rating: res.data.rating,
				rewatch: res.data.rewatch,
				review: res.data.text,
				created: res.data.created,
				updated: res.data.updated,
			};

			reviewtext.value = res.data.text;
			rating.value = res.data.rating;
			username.value = res.data.user_id.name;
			userpicture.value = res.data.user_id.picture;
			userid.value = res.data.user_id.id;

			document.title =
				res.data.story_id.title +
				", review " +
				(lang ? "por " : "by ") +
				res.data.user_id.name +
				" / LetterWHO";

			load.value = true;
		});
}

async function editReview() {
	supabase
		.from("reviews")
		.update({
			rating: rating.value,
			text: reviewtext.value,
			updated: new Date().toISOString(),
		})
		.match({id: id})
		.select(
			`
		id,
		created,
		rating,
		rewatch,
		updated,
		text,
		story_id(title,released,url,code),
		user_id(id,name,picture)
		`
		)
		.then(res => {
			data.value = {
				id: res.data[0].user_id.id,
				name: res.data[0].user_id.name,
				picture: res.data[0].user_id.picture,
				rating: res.data[0].rating,
				rewatch: res.data[0].rewatch,
				review: res.data[0].text,
				created: res.data[0].created,
				updated: res.data[0].updated,
			};

			reviewtext.value = res.data[0].text;
			rating.value = res.data[0].rating;
			username.value = res.data[0].user_id.name;
			userpicture.value = res.data[0].user_id.picture;
			userid.value = res.data[0].user_id.id;

			responseEdit.value = lang ? "Feito!" : "Done!";

			editing.value = false;
		});
}

async function deleteReview() {
	responseDelete.value = lang ? "Deletando..." : "Deleting...";

	if (data.value.rewatch === true) {
		console.log("remove watch");

		supabase
			.rpc("watched", {
				qid: media.value.code,
				qval: 1,
			})
			.then(() => {
				supabase
					.from("diary")
					.delete()
					.match({review_id: id})
					.then(res => {
						supabase
							.from("reviews")
							.delete()
							.match({id: id})
							.then(res => {
								console.log(res);
								console.log("deleted!");

								responseDelete.value = lang ? "Deletado!" : "Deleted!";

								push({name: "story", params: {type: type, range: range, story: story}});
							});
					});
			});
	} else {
		console.log("vida que segue");
		supabase
			.from("diary")
			.delete()
			.match({review_id: id})
			.then(res => {
				supabase
					.from("reviews")
					.delete()
					.match({id: id})
					.then(res => {
						console.log("deleted!");

						responseDelete.value = lang ? "Deletado!" : "Deleted!";

						push({name: "story", params: {type: type, range: range, story: story}});
					});
			});
	}
}

async function shareReview() {
	try {
		await navigator.share({
			title: `${media.value.title} review, ${lang ? "por" : "by"} ${data.value.name}`,
			text: `${media.value.title} review, ${lang ? "por" : "by"} ${data.value.name}`,
			url: window.location.href,
		});
	} catch (error) {
		console.log("Sharing failed!", error);
	}
}

async function likeReview(state) {
	if (state === false) {
		supabase
			.from("likes")
			.insert({
				user_id: user.id,
				review_id: likesID.value,
			})
			.then(res => {
				userliked.value = true;
				likes.value += 1;
			});
	} else {
		supabase
			.from("likes")
			.delete()
			.match({user_id: user.id, review_id: likesID.value})
			.then(res => {
				userliked.value = false;
				likes.value -= 1;
			});
	}
}

async function getLikes() {
	supabase
		.from("likes")
		.select("user_id(id,name,picture)", {count: "exact", head: false})
		.match({review_id: likesID.value})
		.then(res => {
			likes.value = res.count;
			userliked.value = res.data.some(e => e.user_id.id === user.id);
		});
}

async function addComment() {
	commentResponse.value = lang ? "Postando..." : "Posting...";
	supabase
		.from("comments")
		.insert({
			user_id: user.id,
			review_id: commentID.value,
			comment: comment.value,
			created: new Date().toISOString(),
		})
		.select("comment,created,updated,id,user_id(id,name,picture)")
		.then(res => {
			console.log(res);
			comments.value.unshift(res.data[0]);
			commentResponse.value = lang ? "Postado!" : "Posted!";
			comment.value = "";
			isComment.value = false;
			commentResponse.value = lang ? "Comentar" : "Comment";
			data.value.comments += 1;
		});
}

async function getComments() {
	supabase
		.from("comments")
		.select("comment,created,updated,id,user_id(id,name,picture)", {count: "exact"})
		.order("created", {ascending: false})
		.match({review_id: commentID.value})
		.then(res => {
			comments.value = res.data;
			data.value.comments = res.count;
		});
	return;
}

async function deleteComment(commentId) {
	supabase
		.from("comments")
		.delete()
		.match({id: commentId})
		.then(res => {
			console.log(res);
			data.value.comments -= 1;
			getComments();
		});
}

async function likeComment(state, commentId) {}

function quickLikeCheck(map) {
	if (logged) {
		if (map) {
			return map.some(e => e === user.id);
		} else {
			return false;
		}
	}
}

onMounted(() => {
	getReview();
});
</script>

<template>
	<template v-if="load">
		<div class="reviewPage">
			<div class="userArea">
				<router-link
					class="userCover"
					:to="
						logged
							? {name: 'user', params: {id: userid}}
							: {name: 'register', query: {from: 'user', id: userid}}
					"
				>
					<picture>
						<source
							media="(min-width: 35rem)"
							:srcset="folder(data.picture, '100')"
						/>
						<img
							class="userPicture"
							:src="folder(data.picture, '50')"
							:alt="data.name"
						/>
					</picture>

					<div class="userName">
						{{ data.name }}
					</div>
				</router-link>

				<div class="mediaHead">
					<span class="title">
						{{ media.title }}
					</span>
					<span class="year">
						{{ new Date(media.released).getFullYear() }}
					</span>
					<div class="stars">
						<iconify-icon
							class="star"
							icon="ri:star-fill"
							v-for="s in data.rating"
							:key="s"
						/>
					</div>

					<iconify-icon
						v-if="data.rewatch"
						class="rewatch"
						icon="ri:repeat-fill"
					/>
				</div>

				<div class="reviewDate">
					<div>
						{{ new Date(data.created).toLocaleDateString() }}
						<!-- &sdot; {{ (lang ? "Publicado " : "Published") + useTime(lang, data.created) }} -->
					</div>
					<div
						class="reviewEdit"
						v-if="data.id === user.id"
						@click="editing = !editing"
					>
						<span>&sdot;</span>
						<iconify-icon
							class="reviewEditIcon"
							:style="editing ? 'color: var(--green)' : ''"
							:icon="'ri:file-edit-' + (editing ? 'fill' : 'line')"
						/>
					</div>
					<div
						@click="shareReview"
						class="reviewEdit"
					>
						<span>&sdot;</span>
						<iconify-icon
							class="reviewEditIcon"
							icon="ri:share-forward-fill"
						/>
					</div>
				</div>
			</div>

			<div class="reviewArea">
				<div class="userReview">
					<div
						v-if="editing === false"
						class="review"
					>
						{{ data.review }}
					</div>

					<div class="lastEdit">
						<div class="likesArea">
							<div
								@click="likeReview(userliked)"
								class="likeReview"
							>
								<iconify-icon
									class="likeReviewIcon"
									:style="userliked ? 'color: var(--red)' : ''"
									:icon="'ri:heart-' + (userliked ? 'fill' : 'line')"
								/>
								<span>{{ likes > 0 ? likes : "" }}</span>
							</div>
						</div>

						<div v-if="data.updated">
							{{ (lang ? "editado " : "edited ") + useTime(lang, data.updated) }}
						</div>
					</div>

					<div
						v-if="editing === true"
						class="reviewTextEdit"
					>
						<textarea
							name="edit"
							id="edit"
							cols="30"
							rows="10"
							class="reviewEditText"
							v-model="reviewtext"
						/>

						<div class="editButtons">
							<div class="ratingEdit">
								<iconify-icon
									@click="rating = 0"
									class="removeIcon"
									icon="ri:close-circle-line"
								/>
								<div class="starsEdit">
									<iconify-icon
										tabindex="0"
										v-for="n in 5"
										:key="n"
										@keydown.enter.space="rating = n"
										@click="rating = n"
										class="starEdit"
										v-model.number="rating"
										:icon="'ri:star-' + (rating >= n ? 'fill' : 'line')"
										:style="rating >= n ? 'color:var(--yellow)' : ''"
									/>
								</div>
							</div>
							<div class="buttons">
								<ConfirmButton
									:hoverColor="'var(--blue)'"
									@click="editing = false"
								>
									<iconify-icon
										class="buttonEdit"
										icon="ri:arrow-go-back-line"
									/>
								</ConfirmButton>
								<ConfirmButton
									:hoverColor="'var(--red)'"
									@click="deleteReview"
								>
									<iconify-icon
										class="buttonEdit"
										icon="ri:delete-bin-2-line"
									/>
									<span>
										{{ responseDelete }}
									</span>
								</ConfirmButton>
								<ConfirmButton
									:hoverColor="'var(--blue)'"
									:state="
										reviewtext === data.review && rating === data.rating && isUpdatingUser === false
									"
									@click="editReview"
								>
									<iconify-icon
										class="buttonEdit"
										icon="ri:quill-pen-line"
									/>
									<span>
										{{ responseEdit }}
									</span>
								</ConfirmButton>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mediaArea">
				<RouterLink
					:to="{name: 'story', params: {type: type, range: range, story: story}}"
					class="mediaCover"
				>
					<picture>
						<source
							media="(min-width: 35rem)"
							:srcset="folder(type + '/' + range + '/' + media.code, '250')"
						/>
						<img
							class="mediaCoverPicture"
							:src="folder(type + '/' + range + '/' + media.code, '150')"
							:alt="media.title"
						/>
					</picture>
				</RouterLink>
			</div>

			<div class="commentArea">
				<div class="commentsHeader">
					<div class="commentStatus">
						<iconify-icon
							class="commentStatusIcon"
							icon="ri:chat-1-line"
						/>
						<span v-if="data.comments">
							{{ data.comments }}
							{{
								data.comments > 1
									? lang
										? "Comentários"
										: "Comments"
									: lang
									? "Comentário"
									: "Comment"
							}}
						</span>
						<span v-else>
							{{ lang ? "Sem comentários... Seja o primeiro!" : "No comments... Be the first!" }}
						</span>
					</div>
					<div
						@click="logged ? (isComment = !isComment) : push({name: 'register'})"
						class="commentNew"
					>
						<iconify-icon
							class="commentStatusIcon"
							:icon="'ri:chat-new-' + (isComment ? 'fill' : 'line')"
						/>
					</div>
				</div>
				<div
					v-if="isComment"
					class="commentBox"
				>
					<textarea
						name="comment"
						id="comment"
						class="commentField"
						cols="25"
						maxlength="280"
						rows="3"
						v-model.trim="comment"
					/>
					<div class="commentButtons">
						<ConfirmButton
							:hoverColor="'var(--blue)'"
							@click="isComment = false"
						>
							<iconify-icon
								class="buttonEdit"
								icon="ri:arrow-go-back-line"
							/>
						</ConfirmButton>
						<ConfirmButton
							@click="addComment"
							:state="comment === ''"
							:hoverColor="'var(--blue)'"
						>
							<iconify-icon
								class="commentIcon"
								icon="ri:send-plane-2-fill"
							/>
							<span>
								{{ commentResponse }}
							</span>
						</ConfirmButton>
					</div>
				</div>
				<div class="commentsSection">
					<div
						v-for="({id, comment, created, updated, user_id}, i) in comments"
						:key="i"
						class="comment"
					>
						<router-link
							:to="
								logged
									? {name: 'user', params: {id: user_id.id}}
									: {name: 'register', query: {from: 'user', id: user_id.id}}
							"
							class="commentPicture"
						>
							<img
								class="commentPictureImage"
								:src="folder(user_id.picture, '100')"
								:alt="user_id.name"
							/>
						</router-link>

						<div class="commentData">
							<router-link
								:to="
									logged
										? {name: 'user', params: {id: user_id.id}}
										: {name: 'register', query: {from: 'user', id: user_id.id}}
								"
								class="commentName"
							>
								{{ user_id.name }}
							</router-link>

							<div class="commentText">
								{{ comment }}
							</div>

							<div class="commentBot">
								<div
									v-if="false"
									@click="likeComment(quickLikeCheck(data.wholiked), id)"
									class="commentLike"
								>
									<iconify-icon
										class="commentLikeIcon"
										:icon="'ri:heart-' + (quickLikeCheck(data.wholiked) ? 'fill' : 'line')"
										:style="quickLikeCheck(data.wholiked) ? 'color: var(--red);' : ''"
									/>
									<span v-if="data.likes">
										{{ data.likes }}
									</span>
								</div>

								<div class="commentDate">
									<iconify-icon
										v-if="user.id === user_id.id"
										@click="deleteComment(id)"
										class="commentDelete"
										icon="ri:delete-bin-2-fill"
									/>
									<span>
										<span v-if="user.id === user_id.id"> &sdot; </span>
										{{ useTime(lang, created) }}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<div>
			<LoadingState />
		</div>
	</template>
</template>

<style scoped>
/* * {
	outline: 0px dotted rgba(0, 255, 0, 0);
} */
.commentNew {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
}
.commentButtons {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.commentStatusIcon {
	font-size: 1.55rem;
}
.commentStatus {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 1.15rem;
	font-weight: bold;
}
.commentsHeader {
	padding: 0.55rem;
	display: flex;
	justify-content: space-between;
}
.commentDelete {
	cursor: pointer;
	display: flex;
	font-size: 1.25rem;
	transition: all 150ms ease;
}
.commentDelete:hover {
	color: var(--red);
	translate: 0 -0.1rem;
	transition: all 150ms ease;
}
.commentDate {
	display: flex;
	gap: 0.25rem;
	align-items: center;
}
.commentLikeIcon {
	font-size: 1.25rem;
	transition: all 150ms ease;
}
.commentLikeIcon:hover {
	translate: 0 -0.1rem;
	transition: all 150ms ease;
}
.commentLike {
	display: flex;
	align-items: center;
	gap: 0.15rem;
	cursor: pointer;
}
.commentBot {
	color: #aaa;
	gap: 0.5rem;
	display: flex;
	justify-content: space-between;
}
.commentsSection {
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	padding: 0.5rem 0;
}
.commentName {
	font-weight: bold;
	width: fit-content;
}
.commentData {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
	flex: 1;
	padding: 0.55rem 0.25rem;
	border-top: 0.01rem #2f2f2f solid;
}
.commentPicture {
	display: flex;
	align-items: flex-start;
}
.commentPictureImage {
	max-width: 2.15rem;
	border-radius: 50%;
}
.comment {
	display: flex;
	gap: 0.55rem;
	padding: 0.25rem;
}
.commentArea {
	padding: 1rem 0;
	grid-column: 1 / 3;
}
.commentField {
	border: none;
	border: unset;
	padding: 0.5rem;
	font-size: 1rem;
	color: #eee;
	background-color: #1f1f1f;
	flex: 0.5;
	width: 100%;
}
.commentIcon {
	font-size: 1.35rem;
}
.commentBox {
	display: flex;
	flex-flow: column;
	align-items: flex-end;
	gap: 0.5rem;
	padding: 1rem;
}
.likeReviewIcon {
	font-size: 1.55rem;
	transition: all 150ms ease;
}
.likeReviewIcon:hover {
	translate: 0 -0.1rem;
	transition: all 150ms ease;
}
.likeReview {
	display: flex;
	cursor: pointer;
	gap: 0.15rem;
	font-weight: bold;
	align-items: center;
}
.likesArea {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}
.reviewEdit {
	display: flex;
	gap: 0.5rem;
	align-items: center;
}
.updateUser {
	display: flex;
	border-radius: 50%;
	width: fit-content;
	background-color: #1f1f1f;
	padding: 0.35rem;
	cursor: pointer;
	transition: all 150ms linear;
}
.updateUserIcon {
	border-radius: 50%;
	font-size: 1.95rem;
	color: #ccc;
}
.updateUser:hover {
	background-color: #2a2a2a;
	transition: all 150ms linear;
}
.lastEdit {
	text-align: right;
	padding: 0.155rem;
	color: #aaa;

	display: flex;
	align-items: center;
	justify-content: space-between;
}
.ratingEdit {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.removeIcon {
	font-size: 1.75rem;
	cursor: pointer;
	transition: all 150ms linear;
}
.removeIcon:hover {
	color: var(--red);
	translate: 0 -0.1rem;
	transition: all 150ms linear;
}
.starsEdit {
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	gap: 0.1rem;
}
.starEdit {
	font-size: 2.25rem;
	cursor: pointer;
	transition: all 150ms linear;
}
.starEdit:hover {
	cursor: pointer;
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	color: var(--yellow);
}
.buttonEdit {
	font-size: 1.35rem;
}
.editButtons {
	align-items: center;
	display: flex;
	flex-flow: row wrap;
	gap: 0.85rem;
	justify-content: space-between;
}
.buttons {
	display: flex;
	flex-flow: row wrap;
	gap: 0.85rem;
}
.reviewTextEdit {
	display: flex;
	flex-flow: column;
	gap: 0.85rem;
	padding: 0.5rem;
}
.reviewEditText {
	border: unset;
	padding: 0.5rem;
	font-size: 1rem;
	color: #eee;
	background-color: #1a1a1a;
	width: 100%;
}
.reviewPage {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto;
	gap: 0.5rem;
}
.userArea {
	grid-column: 2;
	grid-row: 1;
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	padding: 0.35rem;

	justify-content: space-evenly;
}
.reviewArea {
	grid-column: 1 / 3;
	grid-row: 2;
	display: flex;
	flex-flow: column;
}
.reviewDate {
	display: flex;
	align-items: center;
	flex-flow: row wrap;
	gap: 0.5rem;
	align-items: center;
	font-size: 0.85rem;
	font-weight: bold;
	color: #aaa;
}
.reviewEditIcon {
	font-size: 1.55rem;
	color: #ccc;
	cursor: pointer;
	transition: all 150ms linear;
}
.reviewEditIcon:hover {
	transition: all 150ms linear;
	color: #eee;
	translate: 0 -0.1rem;
}
.reviewDateBottom {
	padding: 0.155rem;
	font-size: 1rem;
	display: flex;
	align-items: center;
	justify-content: end;
}
.mediaArea {
	grid-column: 1;
	grid-row: 1;
	display: flex;
}
.editReview {
	display: flex;
	align-items: center;
	justify-content: end;
}
.editIcon {
	font-size: 1.55rem;
	cursor: pointer;
}
.mediaHead {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.year {
	color: #aaa;
	font-size: 1rem;
	border-bottom: 0.01rem #555 solid;
}
.title {
	font-size: 1.15rem;
	font-weight: bold;
	display: flex;
	align-items: center;
}
.stars {
	display: flex;
	align-items: center;
}
.star {
	color: var(--yellow);
}
.rewatch {
	color: var(--green);
}
.userReview {
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	height: 100%;
}
.review {
	flex: 1;
	padding: 0.255rem;
	color: #eaeaea;
	text-align: justify;
}
.date {
	font-weight: bold;
	padding: 0.255rem;
	color: #aaa;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.mediaArea {
	padding: 0.255rem;
}
.mediaCoverPicture {
	border: solid 0.001rem #555;
	max-width: 5rem;
	transition: all 150ms linear;
}
.mediaCoverPicture:hover {
	border: solid 0.001rem #777;
	transition: all 150ms linear;
}
.userPicture {
	border-radius: 50%;
	padding: 0.35rem;
	max-width: 3rem;
}
.userCover {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1rem;
	font-weight: bold;
}
@media (min-width: 35rem) {
	.reviewPage {
		grid-template-columns: 1fr auto;
		max-width: 50rem;
		margin: auto;
	}
	.userCover {
		font-size: 1.15rem;
	}
	.userPicture {
		max-width: 3rem;
	}
	.mediaCoverPicture {
		max-width: 10rem;
	}
	.userArea {
		grid-column: 1;
		grid-row: 1;
	}
	.reviewArea {
		grid-column: 1;
		grid-row: 2;
	}
	.mediaArea {
		grid-column: 2;
		grid-row: 1 / 3;
	}
	.mediaArea {
		top: 0;
		position: sticky;
	}
	.commentArea {
		grid-column: 1;
	}
}
</style>
