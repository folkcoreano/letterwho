<script setup>
import {ref} from "vue";
import dayjs from "dayjs";
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import {folder} from "@/stores/images";
import {useDialog} from "@/stores/dialog";
import {onClickOutside} from "@vueuse/core";

const props = defineProps({
	data: Object,
	status: Object,
});

const {
	params: {type, range, story},
} = useRoute();

const days = dayjs;

const hasData = ref(props.data.hasData);

const user = useUser();

const {released, length, title, code} = props.data;

const cover = `${type}/${range}/${code}`;

const {watched, rated} = props.status;

const dialog = useDialog();

const review = ref("");
const rating = ref(0);
const daySet = ref();

const response = ref(user.lang === "pt-br" ? "Publicar" : "Publish");

const isDaySet = ref(false);
const isRewatch = ref(false);

const isLoved = ref(false);

async function postReview() {
	let today = new Date().toISOString();

	if (isDaySet.value === true) {
		today = daySet.value;
	}

	response.value = user.lang ? "Publicando..." : "Publishing...";

	supabase
		.from("reviews")
		.insert({
			user_id: user.id,
			story_id: story,
			text: review.value,
			rating: rating.value,
			created: today,
			rewatch: isRewatch.value,
			loved: isLoved.value,
		})
		.limit(1)
		.select("id")
		.single()
		.then(res => {
			console.log(res);

			if (hasData.value === false) {
				supabase
					.from("diary")
					.insert([
						{
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
							created: new Date().toISOString(),
							watched: {
								status: true,
								time: new Date().toISOString(),
							},
							rating:
								rating.value > 0
									? {
											rating: rating.value,
											time: new Date().toISOString(),
									  }
									: null,
						},
						{
							user_id: user.id,
							story_id: story,
							rewatch: isRewatch.value,
							review: true,
							review_id: res.data.id,
							created: new Date().toISOString(),
						},
					])
					.then(res => {
						hasData.value = true;
						if (rating.value > 0) {
							setRated();
						}
						console.log(res);
					});
			} else {
				supabase
					.from("diary")
					.insert({
						user_id: user.id,
						story_id: story,
						rewatch: isRewatch.value,
						review: true,
						review_id: res.data.id,
						created: new Date().toISOString(),
					})
					.then(res => {
						supabase
							.from("diary")
							.update({
								watched: watched
									? {
											status: true,
									  }
									: {
											status: true,
											time: new Date().toISOString(),
									  },
							})
							.match({
								user_id: user.id,
								story_id: story,
								review: false,
								rewatch: false,
							});
						console.log(res);
						hasData.value = true;
					});
			}

			response.value = user.lang ? "Publicado!" : "Published!";

			setTimeout(() => {
				dialog.isReview = false;

				window.matchMedia("(min-width: 35rem)").matches === false
					? (dialog.isReviewMobile = false)
					: "";
			}, 1000);
		});

	function setRated() {
		supabase
			.rpc("rated", {
				qid: props.data.code,
				qval: 1,
			})
			.then(() => {
				supabase
					.rpc("rating", {
						qid: props.data.code,
						qval: rating.value,
					})
					.then(() => {});
			});
	}
}

const target = ref(null);

document.onkeydown = e => {
	if (e.key === "Escape") {
		dialog.isReview = false;
	}
	if (e.key === "Back") {
		console.log(e);
	}
};
</script>

<template>
	<div class="window">
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
								:style="isRewatch ? 'color: var(--green)' : ''"
							/>
						</div>
						<div
							@keydown.space.enter="isLoved = !isLoved"
							@click="isLoved = !isLoved"
							:class="isLoved ? 'reviewOption optionActive' : 'reviewOption'"
							tabindex="0"
						>
							<iconify-icon
								class="reviewOptionIcon"
								:style="isLoved ? 'color: var(--red)' : ''"
								:icon="'ri:heart-3-' + (isLoved ? 'fill' : 'line')"
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
/* * {
	outline: 1px dotted rgba(255, 0, 0, 0);
} */

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
	transition: all 150ms linear;
}

.optionActive {
	background-color: #3a3a3a;
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
