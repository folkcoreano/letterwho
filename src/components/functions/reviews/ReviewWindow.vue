<script setup>
import {ref} from "vue";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import {useTime} from "@/stores/time";
import {useDialog} from "@/stores/dialog";
import {folder} from "@/stores/images";
import dayjs from "dayjs";
import {onClickOutside} from "@vueuse/core";
import supabase from "@/supabase";

const days = dayjs;

const props = defineProps({
	data: Object,
	status: Object,
});

const {
	params: {story, type, range},
} = useRoute();

const {name, picture, id, lang} = useUser();

const {released, length, title} = props.data;

const cover = type + "/" + range + "/" + props.data.code;

const {watched, rated} = props.status;

const dialog = useDialog();

const review = ref("");
const rating = ref(0);
const daySet = ref();

const response = ref(lang === "pt-br" ? "Publicar" : "Publish");

const isDaySet = ref(false);
const isRewatch = ref(false);

const meta = {
	released: released,
	length: length,
	title: title,
	cover: cover,
};

async function postReview() {
	const {getFirestore, addDoc, setDoc, doc, collection} = await import("firebase/firestore");

	const db = getFirestore();

	const reviewQuery = collection(db, "reviews", type, range, story, "reviews");
	const mediaQuery = doc(db, "users", id, "diary", story);

	let today = new Date().toISOString();

	if (isDaySet.value === true) {
		today = daySet.value;
	}

	response.value = lang ? "Publicando..." : "Publishing...";

	addDoc(reviewQuery, {
		name: name,
		picture: picture,
		id: id,

		rewatch: isRewatch.value,

		type: type,
		range: range,
		story: story,
		created: today,

		rating: rating.value,
		review: review.value,
	}).then(res => {
		console.log("review added");
		const activityQuery = doc(db, "users", id, "diary", story, "activity", res.id);
		setDoc(activityQuery, {
			id: res.id,
			folder: "review",
			rewatch: isRewatch.value,
			rating: rating.value,
			time: today,
		}).then(() => {
			console.log("diary added");
			if (watched === false && rated === false) {
				setWatchedAndRated();
			}
			if (rated === false && watched === true) {
				setRated();
			}
			if (rated === true && watched === false) {
				setWatched();
			}

			response.value = lang ? "Publicado!" : "Published!";

			setTimeout(() => {
				dialog.isReview = false;

				window.matchMedia("(min-width: 35rem)").matches === false
					? (dialog.isReviewMobile = false)
					: "";
			}, 1000);
		});
	});

	function setWatched() {
		console.log("set watched");

		supabase
			.rpc("watched", {
				qid: props.data.story,
				qval: 1,
			})
			.then(() => {
				setDoc(
					mediaQuery,
					{data: meta, watched: {status: true, time: new Date().toISOString()}},
					{merge: true}
				).then(() => {
					console.log("watch added");
				});
			});
	}

	function setRated() {
		if (rating.value > 0) {
			console.log("set rated");

			supabase
				.rpc("rated", {
					qid: props.data.story,
					qval: 1,
				})
				.then(() => {
					supabase
						.rpc("rating", {
							qid: props.data.story,
							qval: rating.value,
						})
						.then(() => {
							setDoc(
								mediaQuery,
								{rating: {rating: rating.value, time: new Date().toISOString()}},
								{merge: true}
							).then(() => {
								console.log("rate added");
							});
						});
				});
		}
	}

	function setWatchedAndRated() {
		if (rating.value > 0) {
			console.log("setWatchedAndRated");
			supabase
				.rpc("watched", {
					qid: props.data.story,
					qval: 1,
				})
				.then(() => {
					supabase
						.rpc("rated", {
							qid: props.data.story,
							qval: 1,
						})
						.then(() => {});
					supabase
						.rpc("rating", {
							qid: props.data.story,
							qval: rating.value,
						})
						.then(() => {
							setDoc(
								mediaQuery,
								{
									data: meta,
									rating: {rating: rating.value, time: new Date().toISOString()},
									watched: {status: true, time: new Date().toISOString()},
								},
								{merge: true}
							);
						});
				});
		} else {
			console.log("setWatchAndRated, but only watched");

			supabase
				.rpc("watched", {
					qid: props.data.story,
					qval: 1,
				})
				.then(() => {
					setDoc(
						mediaQuery,
						{
							data: meta,
							watched: {status: true, time: new Date().toISOString()},
						},
						{merge: true}
					);
				});
		}
	}
}

const target = ref(null);

onClickOutside(target, () => {
	dialog.isReview = false;
});
</script>

<template>
	<div
		ref="target"
		class="window"
	>
		<div class="mediaData">
			<div class="mediaCoverPC">
				<img
					class="mediaCover"
					:src="folder(cover, '150')"
					:alt="title"
				/>
			</div>
			<div class="mediaDetails">
				<div class="mediaDetail">
					<div class="mediaTitle">
						{{ title }}
						<span class="mediaYear">({{ new Date(released).getFullYear() }})</span>
					</div>
					<div class="mediaCoverMobile">
						<img
							class="mediaCoverPictureMobile"
							:src="folder(cover, '150')"
							:alt="title"
						/>
					</div>
				</div>
				<div class="reviewArea">
					<div class="reviewOptions">
						<div
							@keydown.space.enter="isRewatch = !isRewatch"
							@click="isRewatch = !isRewatch"
							title="Rewatch"
							:class="isRewatch ? 'reviewOption optionActive' : 'reviewOption'"
							tabindex="0"
						>
							<iconify-icon
								class="reviewOptionIcon"
								icon="ri:repeat-fill"
							/>
						</div>
						<div class="reviewDate">
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
						</div>
					</div>
					<div class="reviewField">
						<textarea
							tabindex="0"
							name="text"
							id="text"
							cols="30"
							rows="8"
							class="text"
							v-model.trim="review"
						/>
						<div class="reviewStars">
							<div
								v-if="rating > 0"
								@click="rating = 0"
								@keydown.enter.space="rating = 0"
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
									@keydown.enter.space="rating = n"
									@click="rating = n"
									class="star"
									v-model.number="rating"
									:icon="'ri:star-' + (rating >= n ? 'fill' : 'line')"
									:style="rating >= n ? 'color: var(--yellow)' : ''"
								/>
							</div>
						</div>
						<div class="reviewButton">
							<ConfirmButton
								@click="dialog.isReview = false"
								tabindex="0"
								:hoverColor="'var(--red)'"
							>
								<iconify-icon
									class="sendIcon"
									icon="ri:arrow-go-back-line"
								/>
							</ConfirmButton>

							<ConfirmButton
								@click="postReview"
								:state="review === ''"
								tabindex="0"
								:hoverColor="'var(--blue)'"
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
		</div>
	</div>
</template>

<style scoped>
* {
	outline: 1px dotted rgba(255, 0, 0, 0);
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
	justify-content: space-evenly;
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

.text {
	max-width: 100%;
	border: transparent;
	border-radius: 0.25rem;
	padding: 0.5rem;
	font-size: 1rem;
	color: #eee;
	background-color: #292929;
}

.text::-webkit-scrollbar {
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
	color: var(--green);
	transition: all 150ms linear;
}

.optionActive {
	background-color: #3a3a3a;
	color: var(--green);
	transition: all 150ms linear;
}

.reviewOptionIcon {
	font-size: 1.35rem;
}

.window {
	padding: 1.25rem;
	background-color: #1a1a1a;
	border-radius: 0.25rem;
}

.mediaData {
	display: flex;
	gap: 1rem;
}

.mediaCoverPC {
	display: none;
}

.mediaCover {
	max-width: 100%;
	width: 7.55rem;
	border: 0.01rem #444 solid;
	transition: all 150ms linear;
}

.mediaCoverPictureMobile {
	max-width: 100%;
	border: 0.01rem #444 solid;
	transition: all 150ms linear;
	max-width: 5rem;
}

.mediaCoverPictureMobile:hover {
	transition: all 150ms linear;
	border: 0.01rem #555 solid;
}
.mediaCoverMobile {
	display: flex;
}

.mediaCover:hover {
	transition: all 150ms linear;
	border: 0.01rem #555 solid;
}

.mediaDetails {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.mediaDetail {
	font-size: 1.35rem;
	font-weight: bold;
	align-items: center;
	justify-content: space-between;
	display: flex;
	gap: 0.35rem;
}

.mediaYear {
	font-size: 0.95rem;
	color: #ddd;
}
@media (min-width: 35rem) {
	.mediaCoverMobile {
		display: none;
	}
	.mediaCoverPC {
		display: block;
	}
}
</style>
