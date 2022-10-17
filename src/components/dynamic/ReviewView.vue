<script setup>
import {useUser} from "@/stores/user";
import {useRoute, useRouter} from "vue-router";
import {ref, onMounted} from "vue";
import supabase from "@/supabase";
import {useTime} from "@/stores/time";
import {folder} from "@/stores/images";

const {lang, picture, name, logged} = useUser();

const user = useUser();

const {
	params: {type, story, range, id},
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

const responseEdit = ref(lang ? "Editar" : "Edit");
const responseDelete = ref(lang ? "Deletar" : "Delete");

const userliked = ref(false);
const likes = ref(0);

const comment = ref("");
const comments = ref([]);

const commentResponse = ref(lang ? "Comentar" : "Comment");

const isComment = ref(false);

async function getReview() {
	const {doc, getDoc, getFirestore} = await import("firebase/firestore");

	const db = getFirestore();

	const q = doc(db, "reviews", type, range, story, "reviews", id);

	supabase
		.from("story")
		.select()
		.limit(1)
		.single()
		.match({url: story})
		.then(res => {
			media.value = res.data;

			getDoc(q).then(res => {
				if (res.exists()) {
					data.value = res.data();

					if (data.value.comments > 0) {
						getComments();
					}

					data.value.likes ? (likes.value = data.value.likes) : (likes.value = 0);

					document.title =
						media.value.title +
						", review " +
						(lang ? "por " : "by ") +
						data.value.name +
						" / LetterWHO";

					load.value = true;

					reviewtext.value = data.value.review;

					rating.value = data.value.rating;

					username.value = data.value.name;

					userpicture.value = data.value.picture;

					data.value.wholiked
						? (userliked.value = data.value.wholiked.some(e => e === user.id))
						: "";
				} else {
					push({name: "story", params: {type: type, range: range, story: story}});
				}
			});
		});
}

async function editReview() {
	const {getFirestore, doc, setDoc} = await import("firebase/firestore");

	const db = getFirestore();
	const query = doc(db, "reviews", type, range, story, "reviews", id);

	responseEdit.value = lang ? "Editando..." : "Editing...";

	if (
		isUpdatingUser.value === true &&
		reviewtext.value === data.value.review &&
		rating.value === data.value.rating
	) {
		setDoc(
			query,
			{
				name: name,
				picture: picture,
			},
			{merge: true}
		).then(() => {
			getReview();
			responseEdit.value = lang ? "Feito!" : "Done!";
			setTimeout(() => {
				editing.value = false;
			}, 1000);
		});

		console.log("change user");
	}

	if (rating.value !== data.value.rating && reviewtext.value === data.value.review) {
		setDoc(
			query,
			{
				rating: rating.value,
				updated: new Date().toISOString(),
				name: isUpdatingUser.value ? name : data.value.name,
				picture: isUpdatingUser.value ? picture : data.value.picture,
			},
			{merge: true}
		).then(() => {
			getReview();
			responseEdit.value = lang ? "Feito!" : "Done!";
			setTimeout(() => {
				editing.value = false;
			}, 1000);
		});
		console.log("change rating");
	}

	if (reviewtext.value !== data.value.review && rating.value === data.value.rating) {
		setDoc(
			query,
			{
				review: reviewtext.value,
				updated: new Date().toISOString(),
				name: isUpdatingUser.value ? name : data.value.name,
				picture: isUpdatingUser.value ? picture : data.value.picture,
			},
			{merge: true}
		).then(() => {
			getReview();
			responseEdit.value = lang ? "Feito!" : "Done!";
			setTimeout(() => {
				editing.value = false;
			}, 1000);
		});
		console.log("change review");
	}

	if (rating.value !== data.value.rating && reviewtext.value !== data.value.review) {
		setDoc(
			query,
			{
				rating: rating.value,
				review: reviewtext.value,
				updated: new Date().toISOString(),
				name: isUpdatingUser.value ? name : data.value.name,
				picture: isUpdatingUser.value ? picture : data.value.picture,
			},
			{merge: true}
		).then(() => {
			getReview();
			responseEdit.value = lang ? "Feito!" : "Done!";
			setTimeout(() => {
				editing.value = false;
			}, 1000);
		});
		console.log("change review and rating");
	}
}

async function deleteReview() {
	const {getFirestore, doc, getDocs, collection, deleteDoc} = await import("firebase/firestore");

	const db = getFirestore();
	const query = doc(db, "reviews", type, range, story, "reviews", id);
	const activity = doc(db, "users", data.value.id, "diary", story, "activity", id);

	responseDelete.value = lang ? "Deletando..." : "Deleting...";

	if (data.value.rewatch === true) {
		console.log("remove watch");

		supabase
			.rpc("incwatch", {
				qid: media.value.story,
				qval: 1,
			})
			.then(() => {
				deleteDoc(query).then(res => {
					console.log("review deleted");

					deleteDoc(activity)
						.then(res => {
							console.log("activity deleted");
							responseDelete.value = lang ? "Deletado!" : "Deleted!";

							push({name: "story", params: {type: type, range: range, story: story}});
						})
						.then(() => {
							if (data.value.comments > 0) {
								deleteAllComments();
							}
						});
				});
			});
	} else {
		console.log("vida que segue");

		deleteDoc(query).then(res => {
			console.log("review deleted");

			deleteDoc(activity)
				.then(res => {
					console.log("activity deleted");
					responseDelete.value = lang ? "Deletado!" : "Deleted!";
					push({name: "story", params: {type: type, range: range, story: story}});
				})
				.then(() => {
					if (data.value.comments > 0) {
						deleteAllComments();
					}
				});
		});
	}

	function deleteAllComments() {
		const comments = collection(db, "reviews", type, range, story, "reviews", id, "comments");

		getDocs(comments).then(res => {
			res.forEach(docs => {
				const comment = doc(db, "reviews", type, range, story, "reviews", id, "comments", docs.id);
				deleteDoc(comment).then(() => {
					console.log(docs.id + ": deleted");
				});
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
	const {getFirestore, increment, updateDoc, arrayRemove, arrayUnion, doc} = await import(
		"firebase/firestore"
	);

	const db = getFirestore();
	const review = doc(db, "reviews", type, range, story, "reviews", id);

	if (logged) {
		if (state === true) {
			updateDoc(review, {
				likes: increment(-1),

				wholiked: arrayRemove(user.id),
			}).then(() => {
				getReview();

				console.log("you remove it i guess");
			});

			console.log("deslike");
		} else {
			updateDoc(review, {
				likes: increment(1),
				wholiked: arrayUnion(user.id),
			}).then(() => {
				getReview();

				console.log("you did it i guess");
			});
			console.log("like");
		}
	} else {
		push({name: "register"});
	}
}

async function getComments() {
	const {getFirestore, getDocs, limit, query, orderBy, collection} = await import(
		"firebase/firestore"
	);

	const db = getFirestore();

	const commentsQuery = query(
		collection(db, "reviews", type, range, story, "reviews", id, "comments"),
		limit(4),
		orderBy("created", "desc")
	);

	console.log("getting comments...");

	let file;

	let data = [];

	getDocs(commentsQuery).then(res => {
		console.log("comments here!");

		res.forEach(doc => {
			file = {id: doc.id, data: doc.data()};

			data.push(file);
		});

		comments.value = data;
	});
}

async function addComment() {
	const {getFirestore, addDoc, collection, updateDoc, increment, doc} = await import(
		"firebase/firestore"
	);
	const db = getFirestore();
	const query = collection(db, "reviews", type, range, story, "reviews", id, "comments");
	const review = doc(db, "reviews", type, range, story, "reviews", id);

	commentResponse.value = lang ? "Postando..." : "Posting...";

	const userdata = {
		name: name,
		id: user.id,
		picture: picture,
		comment: comment.value,
		created: new Date().toISOString(),
	};

	addDoc(query, userdata).then(() => {
		commentResponse.value = lang ? "Postado!" : "Posted!";
		comment.value = "";
		updateDoc(review, {
			comments: increment(1),
		})
			.then(() => {
				isComment.value = false;
				getComments();
				getReview();
			})
			.finally(() => {
				commentResponse.value = lang ? "Comentar" : "Comment";
			});
	});
}

async function deleteComment(commentId) {
	const {getFirestore, deleteDoc, updateDoc, increment, doc} = await import("firebase/firestore");
	const db = getFirestore();
	const query = doc(db, "reviews", type, range, story, "reviews", id, "comments", commentId);
	const review = doc(db, "reviews", type, range, story, "reviews", id);

	deleteDoc(query).then(() => {
		updateDoc(review, {
			comments: increment(-1),
		}).then(() => {
			getComments();
			getReview();
		});
	});
}

async function likeComment(state, commentId) {
	const {getFirestore, increment, updateDoc, arrayRemove, arrayUnion, doc} = await import(
		"firebase/firestore"
	);

	const db = getFirestore();

	const review = doc(db, "reviews", type, range, story, "reviews", id, "comments", commentId);

	if (logged) {
		if (state === true) {
			updateDoc(review, {
				likes: increment(-1),
				wholiked: arrayRemove(user.id),
			}).then(() => {
				getComments();
				console.log("you remove it i guess");
			});

			console.log("deslike");
		} else {
			updateDoc(review, {
				likes: increment(1),
				wholiked: arrayUnion(user.id),
			}).then(() => {
				getComments();
				console.log("you did it i guess");
			});
			console.log("like");
		}
	} else {
		push({name: "register"});
	}
}

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
					:to="{name: 'user', params: {id: data.id}}"
				>
					<picture>
						<source
							media="(min-width: 35rem)"
							:srcset="folder(data.picture.slice(0, -4), '100')"
						/>
						<img
							class="userPicture"
							:src="folder(data.picture.slice(0, -4), '50')"
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
						<div
							v-if="name !== data.name || picture !== data.picture"
							@click="isUpdatingUser = !isUpdatingUser"
							class="updateUser"
						>
							<iconify-icon
								class="updateUserIcon"
								:style="isUpdatingUser ? 'color: var(--green)' : ''"
								:icon="'ri:account-pin-box-' + (isUpdatingUser ? 'fill' : 'line')"
							/>
						</div>
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
				<router-link
					:to="{name: 'story', params: {type: type, range: range, story: story}}"
					class="mediaCover"
				>
					<picture>
						<source
							media="(min-width: 35rem)"
							:srcset="folder(type + '/' + range + '/' + media.story, '250')"
						/>

						<img
							class="mediaCoverPicture"
							:src="folder(type + '/' + range + '/' + media.story, '150')"
							:alt="media.title"
						/>
					</picture>
				</router-link>
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
						v-for="({id, data}, i) in comments"
						:key="i"
						class="comment"
					>
						<router-link
							:to="{name: 'user', params: {id: data.id}}"
							class="commentPicture"
						>
							<img
								class="commentPictureImage"
								:src="folder(data.picture.slice(0, -4), '100')"
								:alt="data.name"
							/>
						</router-link>

						<div class="commentData">
							<router-link
								:to="{name: 'user', params: {id: data.id}}"
								class="commentName"
							>
								{{ data.name }}
							</router-link>

							<div class="commentText">
								{{ data.comment }}
							</div>

							<div class="commentBot">
								<div
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
										v-if="user.id === data.id"
										@click="deleteComment(id)"
										class="commentDelete"
										icon="ri:delete-bin-2-fill"
									/>
									<span>
										<span v-if="user.id === data.id"> &sdot; </span>
										{{ useTime(lang, data.created) }}
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
* {
	outline: 0px dotted rgba(0, 255, 0, 0);
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

	/* --color: #101010; */

	/* background-repeat: no-repeat; */
	/* background-size: contain; */
	/* padding-top: 8rem; */
	/* box-shadow: inset 0.25rem -5rem 1rem 1rem var(--color),
		inset -0.25rem -5rem 1rem 1rem var(--color); */
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
