<script setup>
import supabase from "@/supabase";
import {ref, onMounted} from "vue";
import {useUser} from "@/stores/user";
import {useTime} from "@/stores/time";
import {folder} from "@/stores/images";
import {useRoute, useRouter} from "vue-router";

const {
	params: {type, range, story, id},
} = useRoute();

const user = useUser();

const {push} = useRouter();

const data = ref();
const media = ref();

const load = ref(false);

const editing = ref(false);

const rating = ref();
const reviewtext = ref();

const username = ref();
const userpicture = ref();

const userid = ref();
const useruser = ref();

const responseEdit = ref(user.lang === "pt-br" ? "Editar" : "Edit");
const responseDelete = ref(user.lang === "pt-br" ? "Deletar" : "Delete");

const userliked = ref(false);
const likes = ref(0);

const commentData = ref("");
const isEditingComment = ref(false);
const editingCommentID = ref("");
const comments = ref([]);

const commentID = ref();
const likesID = ref();

const commentResponse = ref(user.lang === "pt-br" ? "Comentar" : "Comment");

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
		loved,
		text,
		story_id(title,released,url,code),
		user_id(id,user,name,picture),
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
				user: res.data.user_id.user,
				name: res.data.user_id.name,
				picture: res.data.user_id.picture,
				rating: res.data.rating,
				rewatch: res.data.rewatch,
				review: res.data.text,
				created: res.data.created,
				updated: res.data.updated,
				loved: res.data.loved,
			};

			reviewtext.value = res.data.text;
			rating.value = res.data.rating;
			username.value = res.data.user_id.name;
			userpicture.value = res.data.user_id.picture;
			userid.value = res.data.user_id.id;
			useruser.value = res.data.user_id.user;

			document.title =
				res.data.story_id.title +
				", review " +
				(user.lang === "pt-br" ? "por " : "by ") +
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
		user_id(id,name,user,picture)
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
			useruser.value = res.data[0].user_id.user;

			responseEdit.value = lang === "pt-br" ? "Feito!" : "Done!";

			editing.value = false;
		});
}

async function deleteReview() {
	responseDelete.value = user.lang === "pt-br" ? "Deletando..." : "Deleting...";

	if (data.value.rewatch === true) {
		console.log("remove watch");

		supabase
			.rpc("watched", {
				qid: media.value.code,
				qval: 1,
			})
			.then(() => {
				deleteEverything();
			});
	} else {
		console.log("vida que segue");

		deleteEverything();
	}

	function deleteEverything() {
		supabase
			.from("diary")
			.delete()
			.match({review_id: id})
			.then(() => {
				console.log("diary deleted");
				supabase
					.from("likes")
					.delete()
					.match({review_id: likesID.value})
					.then(() => {
						console.log("likes deleted");
						supabase
							.from("comments")
							.delete()
							.match({review_id: commentID.value})
							.then(() => {
								console.log("comments deleted");
								supabase
									.from("reviews")
									.delete()
									.match({id: id})
									.then(() => {
										console.log("review deleted");

										responseDelete.value = user.lang === "pt-br" ? "Deletado!" : "Deleted!";

										push({name: "story", params: {type: type, range: range, story: story}});
									});
							});
					});
			});
	}
}

async function shareReview() {
	try {
		await navigator.share({
			title: `${media.value.title} review, ${user.lang === "pt-br" ? "por" : "by"} ${
				data.value.name
			}`,
			text: `${media.value.title} review, ${user.lang === "pt-br" ? "por" : "by"} ${
				data.value.name
			}`,
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
		.select("user_id(id,name,user,picture)", {count: "exact", head: false})
		.match({review_id: likesID.value})
		.then(res => {
			likes.value = res.count;
			userliked.value = res.data.some(e => e.user_id.id === user.id);
		});
}

async function addComment() {
	if (isEditingComment.value === true) {
		commentResponse.value = user.lang === "pt-br" ? "Atualizando..." : "Updating...";
		supabase
			.from("comments")
			.update({
				comment: commentData.value,
				updated: new Date().toISOString(),
			})
			.match({id: editingCommentID.value})
			.then(res => {
				console.log(res);
				commentResponse.value = user.lang === "pt-br" ? "Atualizado!" : "Updated!";
				commentData.value = "";
				isEditingComment.value = false;
				getComments();
			});
	} else {
		commentResponse.value = user.lang === "pt-br" ? "Postando..." : "Posting...";
		supabase
			.from("comments")
			.insert({
				user_id: user.id,
				review_id: commentID.value,
				comment: commentData.value,
				created: new Date().toISOString(),
			})
			.select("comment,created,updated,id,user_id(id,name,picture)")
			.then(res => {
				console.log(res);
				comments.value.unshift(res.data[0]);
				commentResponse.value = user.lang === "pt-br" ? "Postado!" : "Posted!";
				commentData.value = "";
				isComment.value = false;
				commentResponse.value = user.lang === "pt-br" ? "Comentar" : "Comment";
				data.value.comments += 1;
			});
	}
}

async function getComments() {
	supabase
		.from("comments")
		.select("comment,created,updated,id,user_id(id,name,user,picture)", {count: "exact"})
		.order("created", {ascending: false})
		.match({review_id: commentID.value})
		.then(res => {
			comments.value = res.data;
			data.value.comments = res.count;
		});
	return;
}

async function editComment(CommentId, commentDataEdit) {
	commentResponse.value = user.lang === "pt-br" ? "Atualizar!" : "Update!";
	isEditingComment.value = true;
	commentData.value = commentDataEdit;
	editingCommentID.value = CommentId;
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
						user.logged
							? {name: 'user', params: {id: useruser}}
							: {name: 'register', query: {from: 'user', id: useruser}}
					"
				>
					<picture>
						<source
							media="(min-width: 35rem)"
							:srcset="folder(data.picture, '100')"
						/>
						<img
							class="userPicture"
							:src="folder(data.picture, '70')"
							:alt="data.name"
						/>
					</picture>

					<div class="userName">
						{{ data.name }}
					</div>
				</router-link>

				<div class="mediaHead">
					<span class="title">
						{{ media.title }} ({{ new Date(media.released).getFullYear() }})
					</span>

					<span class="statusIcons">
						<iconify-icon
							v-if="data.loved"
							style="color: var(--red)"
							icon="ri:heart-3-fill"
						/>

						<iconify-icon
							v-if="data.rewatch"
							class="rewatch"
							icon="ri:repeat-fill"
						/>
					</span>

					<div class="stars">
						<iconify-icon
							class="star"
							icon="ri:star-fill"
							v-for="s in data.rating"
							:key="s"
						/>
					</div>
				</div>

				<div class="reviewDate">
					<div>
						{{ new Date(data.created).toLocaleDateString() }}
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
							{{
								(user.lang === "pt-br" ? "editado " : "edited ") + useTime(user.lang, data.updated)
							}}
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
									:state="reviewtext === data.review && rating === data.rating"
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
							:srcset="folder(type + '/' + range + '/' + media.code, '350')"
						/>
						<img
							class="mediaCoverPicture"
							:src="folder(type + '/' + range + '/' + media.code, '250')"
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
									? user.lang
										? "Comentários"
										: "Comments"
									: user.lang
									? "Comentário"
									: "Comment"
							}}
						</span>
						<span v-else>
							{{
								user.lang === "pt-br"
									? "Sem comentários... Seja o primeiro!"
									: "No comments... Be the first!"
							}}
						</span>
					</div>
					<div
						@click="user.logged ? (isComment = !isComment) : push({name: 'register'})"
						class="commentNew"
					>
						<iconify-icon
							class="commentStatusIcon"
							:icon="'ri:chat-new-' + (isComment ? 'fill' : 'line')"
						/>
					</div>
				</div>
				<div
					v-if="isComment || isEditingComment"
					class="commentBox"
				>
					<textarea
						name="comment"
						id="comment"
						class="commentField"
						cols="25"
						maxlength="280"
						rows="3"
						v-model.trim="commentData"
					/>
					<div class="commentButtons">
						<ConfirmButton
							:hoverColor="'var(--blue)'"
							@click="(isComment = false), (isEditingComment = false)"
						>
							<iconify-icon
								class="buttonEdit"
								icon="ri:arrow-go-back-line"
							/>
						</ConfirmButton>
						<ConfirmButton
							@click="addComment"
							:state="commentData === ''"
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
								user.logged
									? {name: 'user', params: {id: user_id.user}}
									: {name: 'register', query: {from: 'user', id: user_id.user}}
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
									user.logged
										? {name: 'user', params: {id: user_id.user}}
										: {name: 'register', query: {from: 'user', id: user_id.user}}
								"
								class="commentName"
							>
								{{ user_id.name }}
							</router-link>

							<div class="commentText">
								{{ comment }}
							</div>

							<div class="commentBot">
								<span>
									{{ useTime(user.lang, created) }}
								</span>
								<span
									class="actions"
									v-if="user.id === user_id.id"
								>
									<iconify-icon
										@click="editComment(id, comment)"
										class="commentDelete"
										icon="ri:edit-2-fill"
									/>
									-
									<iconify-icon
										@click="deleteComment(id)"
										class="commentDelete"
										icon="ri:delete-bin-2-fill"
									/>
								</span>
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

.statusIcons {
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.actions {
	display: flex;
	gap: 0.5rem;
}
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
	flex-flow: column;
	align-items: flex-start;
	gap: 0.5rem;
}
.year {
	color: #aaa;
	font-size: 1rem;
	border-bottom: 0.01rem #555 solid;
}
.title {
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
	max-width: 8rem;
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
	.mediaHead {
		display: flex;
		flex-flow: row;
		align-items: center;
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
