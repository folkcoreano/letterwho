<script setup>
import {ref} from "vue";
import supabase from "@/supabase";
import {useRoute, useRouter} from "vue-router";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import {folder} from "@/stores/images";
import CommentsStyle from "./CommentsStyle.vue";
import LikeArea from "./LikeArea.vue";
import {useUpdateKey} from "@/stores/keys";
import ConfirmButton from "@/components/buttons/ConfirmButton.vue";

const {
	params: {type, range, id},
} = useRoute();

const {push} = useRouter();

const user = useUser();
const updateKey = useUpdateKey();
const reviewData = ref();
const comments_and_likes_id = ref();
const isEditing = ref(false);
const reviewText = ref("");
const reviewRating = ref(0);
const reviewLove = ref(false);
const reviewRewatch = ref(false);
const response = ref(user.lang === "pt-br" ? "Atualizar" : "Update");

const comments_size = ref();
const likes_size = ref();

const mediaCode = ref();

const {data} = await supabase
	.from("reviews")
	.select(
		`id,
created,
rating,
rewatch,
loved,
updated,
text,
story_id(title,released,url,code),
user_id(id,user,name,picture,reviews_id(*)),
likes_id(count),
comments_id(count)`
	)
	.match({id: id})
	.filter("user_id.reviews_id.id", "eq", id)
	.limit(1)
	.single();

comments_size.value = data.comments_id[0].count;
likes_size.value = data.likes_id[0].count;
mediaCode.value = data.story_id.code;

reviewData.value = data;

reviewText.value = data.text;
reviewRating.value = data.rating;
reviewLove.value = data.loved;
reviewRewatch.value = data.rewatch;

comments_and_likes_id.value = data.user_id.reviews_id.find(e => e.id == id);

setTitle(`${data.user_id.name} / ${data.story_id.title}`);

async function editReview() {
	const {data} = await supabase
		.from("reviews")
		.update({
			rating: reviewRating.value,
			text: reviewText.value,
			loved: reviewLove.value,
			rewatch: reviewRewatch.value,
			updated: new Date().toISOString(),
		})
		.match({id: id});

	updateKey.reviewKey += 1;

	isEditing.value = false;
}

async function deleteReview() {
	await supabase.from("diary").delete().match({review_id: id, user_id: user.id});
	console.log("diary deleted");

	if (likes_size.value > 0) {
		await supabase.from("likes").delete().match({review_id: comments_and_likes_id.value.likes_id});

		console.log("likes deleted");
	}

	if (comments_size.value > 0) {
		await supabase
			.from("comments")
			.delete()
			.match({review_id: comments_and_likes_id.value.comments_id});

		console.log("comments deleted");
	}

	await supabase.from("reviews").delete().match({id: id, user_id: user.id});
	console.log("review deleted");

	await supabase.rpc("reviews", {
		qid: mediaCode.value,
		qval: -1,
	});
	console.log("review count removed");

	if (reviewLove.value === true) {
		await supabase.rpc("liked", {
			qid: mediaCode.value,
			qval: -1,
		});
		console.log("like count removed");
	}

	if (reviewRewatch.value === true) {
		await supabase.rpc("rewatched", {
			qid: mediaCode.value,
			qval: -1,
		});
		console.log("rewatched count removed");
	}
	push({name: "story"});
}
</script>

<template>
	<div class="review">
		<div class="reviewSide">
			<div class="header">
				<RouterLink :to="{name: 'user', params: {id: data.user_id.user}}">
					<div class="userPicture">
						<img
							class="picture"
							:src="folder(data.user_id.picture, '150')"
							:alt="data.user_id.name"
						/>
					</div>
				</RouterLink>

				<div class="head">
					<RouterLink
						:to="{name: 'user', params: {id: data.user_id.user}}"
						class="name"
						>{{ data.user_id.name }}
						<span class="user">(@{{ data.user_id.user }})</span></RouterLink
					>

					<RouterLink
						:to="{name: 'story'}"
						class="title"
					>
						{{ data.story_id.title }} ({{ new Date(data.story_id.released).getFullYear() }})
					</RouterLink>
					<div class="headIcons">
						<iconify-icon
							class="icon"
							v-if="data.loved"
							style="color: var(--red)"
							icon="ri:heart-3-fill"
						/>

						<iconify-icon
							v-if="data.rewatch"
							style="color: var(--green)"
							class="icon"
							icon="ri:repeat-fill"
						/>

						<iconify-icon
							class="icon"
							style="color: var(--yellow)"
							icon="ri:star-fill"
							v-for="s in data.rating"
							:key="s"
						/>

						<iconify-icon
							v-if="user.id === data.user_id.id"
							class="icon edit"
							icon="ri:edit-2-fill"
							@click="isEditing = true"
						/>
					</div>
					<div>{{ new Date(data.created).toLocaleDateString() }}</div>
				</div>
			</div>
		</div>
		<div
			v-if="isEditing"
			class="editArea"
		>
			<div class="reviewArea">
				<div
					v-if="false"
					class="reviewOptions"
				>
					<div
						@keydown.space.enter="reviewRewatch = !reviewRewatch"
						@click="reviewRewatch = !reviewRewatch"
						title="Rewatch"
						:class="reviewRewatch ? 'reviewOption optionActive' : 'reviewOption'"
						tabindex="0"
					>
						<iconify-icon
							class="reviewOptionIcon"
							icon="ri:repeat-fill"
							:style="reviewRewatch ? 'color: var(--green)' : ''"
						/>
					</div>
					<div
						@keydown.space.enter="reviewLove = !reviewLove"
						@click="reviewLove = !reviewLove"
						:class="reviewLove ? 'reviewOption optionActive' : 'reviewOption'"
						tabindex="0"
					>
						<iconify-icon
							class="reviewOptionIcon"
							:style="reviewLove ? 'color: var(--red)' : ''"
							:icon="'ri:heart-3-' + (reviewLove ? 'fill' : 'line')"
						/>
					</div>
					<!-- <div class="reviewDate">
						<div
							@keydown.space.enter="isDaySet = !isDaySet"
							@click="isDaySet = !isDaySet"
							:class="isDaySet ? 'dateIcon dateActive' : 'dateIcon'"
							tabindex="0"
						>
							<iconify-icon
								class="reviewDateIcon"
								icon="ri:calendar-event-fill"
							/>
						</div>
						<input
							v-model="daySet"
							v-if="isDaySet"
							type="date"
							name="date"
							id="date"
							:max="days().format('YYYY-MM-DD')"
						/>
					</div> -->
				</div>
				<div class="reviewField">
					<textarea
						tabindex="0"
						name="textEdit"
						id="textEdit"
						cols="30"
						rows="8"
						class="textEdit"
						v-model.trim="reviewText"
					/>
					<div class="reviewStars">
						<div
							v-if="reviewRating > 0"
							@click="reviewRating = 0"
							@keydown.enter.space="reviewRating = 0"
							class="stars"
							tabindex="0"
						>
							<iconify-icon
								class="removeIcon"
								icon="ri:close-circle-line"
							/>
						</div>
						<div class="stars">
							<iconify-icon
								tabindex="0"
								v-for="n in 5"
								:key="n"
								@keydown.enter.space="reviewRating = n"
								@click="reviewRating = n"
								class="star"
								v-model.number="reviewRating"
								:icon="'ri:star-' + (reviewRating >= n ? 'fill' : 'line')"
								:style="reviewRating >= n ? 'color: var(--yellow)' : ''"
							/>
						</div>
					</div>
					<div class="reviewButton">
						<ConfirmButton
							@click="isEditing = false"
							tabindex="0"
						>
							<iconify-icon
								class="sendIcon"
								icon="ri:arrow-go-back-line"
							/>
						</ConfirmButton>

						<ConfirmButton
							@click="deleteReview"
							:hoverColor="'var(--red)'"
						>
							<iconify-icon
								class="sendIcon"
								icon="ri:delete-bin-5-line"
							/>
						</ConfirmButton>

						<ConfirmButton
							@click="editReview"
							:state="reviewText === '' || reviewText === data.text"
							tabindex="0"
						>
							<iconify-icon
								class="sendIcon"
								icon="ri:quill-pen-line"
							/>
							<span>
								{{ response }}
							</span>
						</ConfirmButton>
					</div>
				</div>
			</div>
		</div>
		<div
			v-else
			class="text"
		>
			{{ data.text }}
		</div>
		<div class="mediaSide">
			<RouterLink
				class="mediaLink"
				:to="{name: 'story'}"
			>
				<img
					class="mediaPicture"
					:src="folder(`${type}/${range}/${data.story_id.code}`, '300')"
					:alt="data.story_id.title"
				/>
			</RouterLink>
		</div>
		<div class="comments">
			<LikeArea
				:likes_size="data.likes_id[0].count"
				:id="comments_and_likes_id.likes_id"
			/>
			<CommentsStyle
				:comments_id="comments_and_likes_id.comments_id"
				:likes_id="comments_and_likes_id.likes_id"
				:comments_size="data.comments_id[0].count"
				:likes_size="data.likes_id[0].count"
			/>
		</div>
	</div>
</template>

<style scoped>
* {
	/* outline: 1px dotted rgba(0, 255, 0, 0.3); */
	transition: all 150ms linear;
}

.edit {
	cursor: pointer;
}

.loved {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.isLoved {
	font-size: 2rem;
}
.reviewButton {
	display: flex;
	justify-content: end;
	gap: 0.85rem;
}
.sendIcon {
	font-size: 1.45rem;
}
.reviewField {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
.stars {
	display: flex;
	align-items: center;
	gap: 0.15rem;
}
.reviewStars {
	display: flex;
	gap: 0.5rem;
	justify-content: center;
}

:is(.text, .dateIcon, .reviewOption, .stars, .star, .removeIcon):focus {
	outline: 0.01rem solid #aaa;
}

.star,
.removeIcon {
	font-size: 2.15rem;
	cursor: pointer;
	transition: all 150ms linear;
}

.star:hover {
	color: var(--yellow);
}

:is(.star, .removeIcon):hover {
	transition: all 150ms linear;
	translate: 0 -0.1rem;
}

.removeIcon:hover {
	transition: all 150ms linear;
	color: var(--red);
}

.textEdit {
	max-width: 100%;
	border: transparent;
	border-radius: 0.25rem;
	padding: 0.5rem;
	font-size: 1rem;
	color: #eee;
	background-color: #292929;
}

.textEdit::-webkit-scrollbar {
	width: 0.35rem;
	cursor: pointer;
}

.reviewDate {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.reviewDateIcon {
	font-size: 1.35rem;
}

.dateIcon {
	display: flex;
	align-items: center;
	border-radius: 50%;
	padding: 0.45rem;
	transition: all 150ms linear;
	cursor: pointer;
	background-color: #2a2a2a;
}

.dateIcon:hover {
	background-color: #3a3a3a;
	color: var(--red);
	transition: all 150ms linear;
}

.dateActive {
	background-color: #3a3a3a;
	color: var(--red);
	transition: all 150ms linear;
}

[type="date"] {
	padding: 0rem 0.15rem;
	font-weight: bold;
	background: #fff;
	font-size: 0.85rem;
	border: none;
	cursor: pointer;
	border-radius: 0.25rem;
}
[type="date"]::-webkit-inner-spin-button {
	display: none;
}

[type="date"]::-webkit-calendar-picker-indicator {
	zoom: 1.45;
	cursor: pointer;
	background: #fff url(https://api.iconify.design/ri/calendar-event-fill.svg) center no-repeat;
}
.reviewArea {
	flex-flow: column;
	display: flex;
	gap: 0.85rem;
}

.reviewOptions {
	display: flex;
	gap: 0.55rem;
	align-items: center;
}

.reviewOption {
	display: flex;
	align-items: center;
	border-radius: 50%;
	padding: 0.45rem;
	transition: all 150ms linear;
	cursor: pointer;
	background-color: #2a2a2a;
}

.reviewOption:hover {
	background-color: #3a3a3a;
	transition: all 150ms linear;
}

.optionActive {
	background-color: #3a3a3a;
	transition: all 150ms linear;
}

.reviewOptionIcon {
	font-size: 1.35rem;
}

.review {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto;
	gap: 0.65rem;
	max-width: 55rem;
	margin-inline: auto;
}
.reviewSide {
	grid-column: 2;
	grid-row: 1;
	display: flex;
	flex-flow: column;
	justify-content: center;
	gap: 0.55rem;
	flex: 1;
}
.mediaSide {
	grid-column: 1;
	grid-row: 1;
	flex: 0.5;
}
.comments {
	grid-column: 1/3;
	grid-row: 3;
}

.editArea {
	grid-column: 1/3;
	grid-row: 2;
}

.text {
	grid-column: 1/3;
	grid-row: 2;
	text-align: start;
	word-spacing: 0.05rem;
	line-height: 1.35;
}
.header {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
.head {
	display: flex;
	flex-flow: column;
	justify-content: center;
	gap: 0.45rem;
}
.name {
	font-weight: bold;
	font-size: 1.15rem;
	display: flex;
	align-items: center;
	gap: 0.15rem;
}
.user {
	font-size: 1rem;
	color: #ccc;
}
.mediaPicture {
	outline: 0.001rem solid #444;
	border-radius: 0.1rem;
	width: 7.55rem;
	max-width: 100%;
}
.picture {
	border-radius: 0.1rem;
	max-width: 4.55rem;
}
.headIcons {
	display: flex;
	align-items: center;
	gap: 0.15rem;
}
.icon {
	font-size: 1.15rem;
}
@media (min-width: 35rem) {
	.comments {
		grid-column: 1;
		grid-row: 3;
	}
	.header {
		flex-flow: row;
	}
	.picture {
		max-width: 5rem;
	}
	.mediaPicture {
		width: 13rem;
	}
	.review {
		grid-template-columns: 1fr auto;
	}
	.reviewSide {
		grid-column: 1;
		grid-row: 1;
	}
	.mediaSide {
		grid-column: 2;
		grid-row: 1 / 3;
	}
	.text {
		grid-column: 1;
		grid-row: 2;
	}

	.editArea {
		grid-column: 1;
		grid-row: 2;
	}
}
</style>
