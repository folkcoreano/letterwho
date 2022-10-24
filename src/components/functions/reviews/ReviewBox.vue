<script setup>
import {ref} from "vue";
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import {useDialog} from "@/stores/dialog";
import ReviewWindow from "@/components/functions/reviews/ReviewWindow.vue";

const props = defineProps({
	data: Object,
	doctors: Object,
});

const {
	params: {type, range, story},
} = useRoute();

const {id, lang} = useUser();

const dialog = useDialog();

const hasData = ref(props.data.hasData);

const hasDataFile = ref(
	hasData.value
		? props.data.diary
		: {
				watched: false,
				saved: false,
				liked: false,
				rating: false,
		  }
);

const watched = ref(hasDataFile.value.watched ? hasDataFile.value.watched.status : false);

const liked = ref(hasDataFile.value.liked ? hasDataFile.value.liked.status : false);

const saved = ref(hasDataFile.value.saved ? hasDataFile.value.saved.status : false);

const rated = ref(hasDataFile.value.rating ? true : false);

const ratingData = ref(hasDataFile.value.rating ? hasDataFile.value.rating.rating : 0);

const oldRating = ref(hasDataFile.value.rating ? hasDataFile.value.rating.rating : 0);

const {released, length, title, code} = props.data;

async function rateContent(rating) {
	if (oldRating.value === 0 || oldRating.value === undefined) {
		console.log("adiciona");

		supabase
			.rpc("rated", {
				qid: props.data.code,
				qval: 1,
			})
			.then(() => {
				if (rating > oldRating.value) {
					console.log("aumenta");
					doTheThing(rating - oldRating.value);
				}

				if (rating < oldRating.value) {
					console.log("diminui");
					doTheThing(rating - oldRating.value);
				}
			});
	}

	if (oldRating.value > 0) {
		if (rating > oldRating.value) {
			console.log("aumenta");

			doTheThing(rating - oldRating.value);
		}

		if (rating < oldRating.value) {
			console.log("diminui");

			doTheThing(rating - oldRating.value);
		}

		if (rating === oldRating.value) {
			console.log("faz nada");
		}
	}

	function doTheThing(rate) {
		supabase
			.rpc("rating", {
				qid: props.data.code,
				qval: rate,
			})
			.then(() => {
				if (hasData.value) {
					supabase
						.from("diary")
						.update({
							rating: {
								rating: rating,
								time: new Date().toISOString(),
							},
						})
						.match({
							user_id: id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.then(res => {
							console.log(res);
						});
				} else {
					supabase
						.from("diary")
						.insert({
							user_id: id,
							story_id: story,
							rewatch: false,
							review: false,
							created: new Date().toISOString(),
							rating: {
								rating: rating,
								time: new Date().toISOString(),
							},
						})
						.then(res => {
							hasData.value = true;
							console.log(res);
							if (watched.value === false) {
								watched.value = true;
								setWatch(false);
							}
							if (saved.value === true) {
								saved.value = false;
								setSave(true);
							}
						});
				}
			});
	}
}

async function removeRate() {
	supabase
		.rpc("rated", {
			qid: props.data.code,
			qval: -1,
		})
		.then(() => {
			supabase
				.rpc("rating", {
					qid: props.data.code,
					qval: -oldRating.value,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							rating: null,
						})
						.match({
							user_id: id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.then(res => {
							console.log(res);
						});
				});
		});
}

async function setWatch(state) {
	if (hasData.value) {
		console.log("has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.from("diary")
				.update({
					watched: {
						status: true,
						time: new Date().toISOString(),
					},
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					console.log(res);
					watched.value = true;

					if (saved.value === true) {
						saved.value = false;
						setSave(true);
					}
				});
		} else {
			console.log("rem watch");
			supabase
				.from("diary")
				.update({
					watched: null,
				})
				.match({
					user_id: id,
					story_id: story,
					review: false,
					rewatch: false,
				})
				.then(res => {
					console.log(res);
					watched.value = false;
				});
		}
	} else {
		console.log("doesnt has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.from("diary")
				.insert({
					user_id: id,
					rewatch: false,
					review: false,
					story_id: story,
					created: new Date().toISOString(),
					watched: {
						status: true,
						time: new Date().toISOString(),
					},
				})
				.then(res => {
					console.log(res);
					hasData.value = true;
					watched.value = true;
					if (saved.value === true) {
						saved.value = false;
						setSave(true);
					}
				});
		} else {
			console.log("rem watch");
			supabase
				.from("diary")
				.update({
					watched: null,
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					hasData.value = true;

					watched.value = false;
					console.log(res);
				});
		}
	}
}

async function setLike(state) {
	if (hasData.value) {
		console.log("has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.from("diary")
				.update({
					liked: {
						status: true,
						time: new Date().toISOString(),
					},
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					console.log(res);
					liked.value = true;
				});
		} else {
			console.log("rem watch");
			supabase
				.from("diary")
				.update({
					liked: null,
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					console.log(res);
					liked.value = false;
				});
		}
	} else {
		console.log("doesnt has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.from("diary")
				.insert({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
					created: new Date().toISOString(),
					liked: {
						status: true,
						time: new Date().toISOString(),
					},
				})
				.then(res => {
					console.log(res);
					hasData.value = true;
					liked.value = true;
				});
		} else {
			console.log("rem watch");
			supabase
				.from("diary")
				.update({
					liked: null,
				})
				.match({
					user_id: id,
					story_id: story,
					review: false,
					rewatch: false,
				})
				.then(res => {
					liked.value = false;
					console.log(res);
				});
		}
	}
}

async function setSave(state) {
	if (hasData.value) {
		console.log("has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.from("diary")
				.update({
					saved: {
						status: true,
						time: new Date().toISOString(),
					},
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					console.log(res);
					saved.value = true;
				});
		} else {
			console.log("rem watch");
			supabase
				.from("diary")
				.update({
					saved: null,
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					console.log(res);
					saved.value = false;
				});
		}
	} else {
		console.log("doesnt has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.from("diary")
				.insert({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
					created: new Date().toISOString(),
					saved: {
						status: true,
						time: new Date().toISOString(),
					},
				})
				.then(res => {
					console.log(res);
					hasData.value = true;

					saved.value = true;
				});
		} else {
			console.log("rem watch");
			supabase
				.from("diary")
				.update({
					saved: null,
				})
				.match({
					user_id: id,
					story_id: story,
					rewatch: false,
					review: false,
				})
				.then(res => {
					saved.value = false;
					console.log(res);
				});
		}
	}
}
</script>

<template>
	<div class="reviewBox">
		<div class="reviewButtons">
			<div
				@click="setWatch(watched)"
				class="reviewItem"
			>
				<iconify-icon
					class="reviewItemIcon"
					:icon="'ri:eye-' + (watched ? 'fill' : 'line')"
					:style="watched ? 'color:var(--blue)' : ''"
				/>
			</div>
			<div
				@click="setLike(liked)"
				class="reviewItem"
			>
				<iconify-icon
					class="reviewItemIcon"
					:icon="'ri:heart-' + (liked ? 'fill' : 'line')"
					:style="liked ? 'color:var(--red)' : ''"
				/>
			</div>
			<div
				@click="setSave(saved)"
				class="reviewItem"
			>
				<iconify-icon
					:icon="'ri:bookmark-' + (saved ? 'fill' : 'line')"
					:style="saved ? 'color: var(--green)' : ''"
					class="reviewItemIcon"
				/>
			</div>
		</div>
		<div class="ratingBox">
			<div
				class="removeItem"
				v-if="ratingData > 0"
				@click="removeRate(), (ratingData = 0)"
			>
				<iconify-icon
					class="removeIcon"
					icon="ri:close-circle-line"
				/>
			</div>
			<div class="starsBox">
				<iconify-icon
					@click="rateContent(1), (ratingData = 1)"
					class="starIcon"
					:icon="'ri:star-' + (ratingData >= 1 ? 'fill' : 'line')"
					:style="ratingData >= 1 ? 'color: var(--yellow)' : ''"
				/>
				<iconify-icon
					@click="rateContent(2), (ratingData = 2)"
					class="starIcon"
					:icon="'ri:star-' + (ratingData >= 2 ? 'fill' : 'line')"
					:style="ratingData >= 2 ? 'color:var(--yellow)' : ''"
				/>
				<iconify-icon
					@click="rateContent(3), (ratingData = 3)"
					class="starIcon"
					:icon="'ri:star-' + (ratingData >= 3 ? 'fill' : 'line')"
					:style="ratingData >= 3 ? 'color: var(--yellow)' : ''"
				/>
				<iconify-icon
					@click="rateContent(4), (ratingData = 4)"
					class="starIcon"
					:icon="'ri:star-' + (ratingData >= 4 ? 'fill' : 'line')"
					:style="ratingData >= 4 ? 'color:var(--yellow)' : ''"
				/>
				<iconify-icon
					@click="rateContent(5), (ratingData = 5)"
					class="starIcon"
					:icon="'ri:star-' + (ratingData >= 5 ? 'fill' : 'line')"
					:style="ratingData >= 5 ? 'color:var(--yellow)' : ''"
				/>
			</div>
		</div>
		<div
			@click="dialog.isReview = !dialog.isReview"
			class="reviewText"
		>
			{{ lang ? "Escreva algo!" : "Write something!" }}
		</div>
		<div
			v-if="false"
			class="reviewText"
		>
			Set progress!
		</div>
	</div>
	<DialogGlobal
		:selfclose="true"
		:open="dialog.isReview"
		@close="dialog.isReview = !dialog.isReview"
	>
		<ReviewWindow
			:status="{rated: rated, watched: watched}"
			:data="data"
		/>
	</DialogGlobal>
</template>

<style scoped>
/* * {
	outline: 1px solid rgba(255, 0, 135, 0);
	user-select: none;
} */
.ratingBox {
	gap: 0.5rem;
	padding: 0.8rem;

	border-top: 0.01rem #555 solid;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 150ms linear;
}
.removeItem {
	cursor: pointer;
	display: none;
}

.starIcon {
	font-size: 2.25rem;

	cursor: pointer;
	transition: all 150ms linear;
}
.removeIcon {
	transition: all 150ms linear;
	font-size: 1.55rem;
}

.removeIcon:hover {
	transition: all 150ms linear;
	color: var(--red);
}
.reviewBox {
	border-radius: 0.15rem;
	display: flex;
	flex-flow: column;
	background-color: #1f1f1f;
}
.ratingBox:hover .removeItem {
	display: flex;
}
.reviewText {
	padding: 0.5rem;

	border-top: 0.01rem #555 solid;
	text-align: center;
	cursor: pointer;
	transition: all 150ms linear;
}

.reviewText:hover {
	transition: all 150ms linear;
	background-color: #2a2a2a;
}

.reviewButtons {
	gap: 1.55rem;
	padding: 1rem 2.55rem;

	display: flex;
}

.reviewItem {
	display: flex;
	align-items: center;
}

.reviewItemIcon {
	font-size: 2.95rem;

	cursor: pointer;
	transition: all 150ms linear;
	color: #999;
}
.reviewItemIcon:hover {
	transition: all 150ms linear;
	translate: 0 -0.1rem;
}

@media (min-width: 35rem) {
	.ratingBox {
		gap: 0.5rem;
		padding: 0.5rem;
	}
	.starIcon {
		font-size: 1.95rem;
	}
	.reviewBox {
		width: fit-content;
		border-radius: 0.3rem;
	}
	.reviewText {
		padding: 0.8rem;
	}
	.reviewButtons {
		gap: 1.15rem;
		padding: 0.8rem 1.55rem;
	}
	.reviewItemIcon {
		font-size: 2.75rem;
	}
}
</style>
