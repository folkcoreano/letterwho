<script setup>
import {ref, watchEffect} from "vue";
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import {useDialog} from "@/stores/dialog";
import ReviewWindow from "@/components/functions/reviews/ReviewWindow.vue";
import {useReview} from "@/stores/review";

const props = defineProps({
	data: Object,
});

const {
	params: {type, story},
} = useRoute();

const user = useUser();

const dialog = useDialog();

const review = useReview();

const hasDataFile = ref();
const watched = ref();
const liked = ref();
const saved = ref();
const ratingData = ref();
const oldRating = ref();
const rated = ref();

hasDataFile.value = review.storyHasData
	? props.data.diary
	: {
			watched: false,
			saved: false,
			liked: false,
			rating: false,
	  };

watched.value = hasDataFile.value.watched ? hasDataFile.value.watched.status : false;

liked.value = hasDataFile.value.liked ? hasDataFile.value.liked.status : false;

saved.value = hasDataFile.value.saved ? hasDataFile.value.saved.status : false;

rated.value = hasDataFile.value.rating ? true : false;

ratingData.value = hasDataFile.value.rating ? hasDataFile.value.rating.rating : 0;

oldRating.value = hasDataFile.value.rating ? hasDataFile.value.rating.rating : 0;

async function removeRate() {
	if (review.storyHasData === true) {
		await supabase.rpc("rated", {
			qid: props.data.code,
			qval: -1,
		});

		await supabase.rpc("rating", {
			qid: props.data.code,
			qval: -ratingData.value,
		});

		await supabase
			.from("diary")
			.update({
				rating: null,
			})
			.match({
				user_id: user.id,
				story_id: story,
				rewatch: false,
				review: false,
			});

		ratingData.value = 0;
		oldRating.value = 0;
	} else {
		console.log("no data :p");
	}
}

async function rateContent(rating) {
	ratingData.value = rating;

	if (review.storyHasData === false) {
		console.log("no data");

		await supabase.rpc("rated", {
			qid: props.data.code,
			qval: 1,
		});

		await supabase.rpc("rating", {
			qid: props.data.code,
			qval: rating,
		});

		await supabase.from("diary").insert({
			user_id: user.id,
			story_id: story,
			rewatch: false,
			review: false,
			created: new Date().toISOString(),
			rating: {
				rating: rating,
				time: new Date().toISOString(),
			},
		});

		review.storyHasData = true;

		setWatch(false);

		oldRating.value = rating;
	} else {
		if (rating > oldRating.value) {
			console.log("atualiza, adiciona");
			console.log(rating - oldRating.value);

			if (oldRating.value === 0) {
				await supabase.rpc("rated", {
					qid: props.data.code,
					qval: 1,
				});
			}

			await supabase.rpc("rating", {
				qid: props.data.code,
				qval: rating - oldRating.value,
			});

			await supabase
				.from("diary")
				.update({
					rating: {
						rating: rating,
						time: new Date().toISOString(),
					},
				})
				.match({
					user_id: user.id,
					story_id: story,
					rewatch: false,
					review: false,
				});

			oldRating.value = rating;
		} else {
			console.log("atualiza, diminui");
			console.log(rating - oldRating.value);

			await supabase.rpc("rating", {
				qid: props.data.code,
				qval: rating - oldRating.value,
			});

			await supabase
				.from("diary")
				.update({
					rating: {
						rating: rating,
						time: new Date().toISOString(),
					},
				})
				.match({
					user_id: user.id,
					story_id: story,
					rewatch: false,
					review: false,
				});

			oldRating.value = rating;
		}
	}
}

async function setWatch(state) {
	if (review.storyHasData) {
		console.log("has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.rpc("watched", {
					qid: props.data.code,
					qval: 1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							watched: {
								status: true,
								time: new Date().toISOString(),
							},
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);
							watched.value = true;

							if (saved.value === true) {
								saved.value = false;
								setSave(true);
							}
						});
				});
		} else {
			console.log("rem watch");
			supabase
				.rpc("watched", {
					qid: props.data.code,
					qval: -1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							watched: null,
						})
						.match({
							user_id: user.id,
							story_id: story,
							review: false,
							rewatch: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							watched.value = false;
						});
				});
		}
	} else {
		console.log("doesnt has data");
		if (state === false) {
			console.log("set watch");
			supabase
				.rpc("watched", {
					qid: props.data.code,
					qval: 1,
				})
				.then(() => {
					supabase
						.from("diary")
						.insert({
							user_id: user.id,
							rewatch: false,
							review: false,
							story_id: story,
							created: new Date().toISOString(),
							watched: {
								status: true,
								time: new Date().toISOString(),
							},
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							review.storyHasData = true;
							watched.value = true;
							if (saved.value === true) {
								saved.value = false;
								setSave(true);
							}
						});
				});
		} else {
			console.log("rem watch");
			supabase
				.rpc("watched", {
					qid: props.data.code,
					qval: -1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							watched: null,
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);
							review.storyHasData = true;

							watched.value = false;
						});
				});
		}
	}
}

async function setLike(state) {
	if (review.storyHasData) {
		console.log("has data");
		if (state === false) {
			console.log("set like");
			supabase
				.rpc("liked", {
					qid: props.data.code,
					qval: 1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							liked: {
								status: true,
								time: new Date().toISOString(),
							},
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							liked.value = true;
						});
				});
		} else {
			console.log("rem like");
			supabase
				.rpc("liked", {
					qid: props.data.code,
					qval: -1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							liked: null,
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);
							liked.value = false;
						});
				});
		}
	} else {
		console.log("doesnt has data");
		if (state === false) {
			console.log("set like");
			supabase
				.rpc("liked", {
					qid: props.data.code,
					qval: 1,
				})
				.then(() => {
					supabase
						.from("diary")
						.insert({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
							created: new Date().toISOString(),
							liked: {
								status: true,
								time: new Date().toISOString(),
							},
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							review.storyHasData = true;
							liked.value = true;
						});
				});
		} else {
			console.log("rem like");
			supabase
				.rpc("liked", {
					qid: props.data.code,
					qval: -1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							liked: null,
						})
						.match({
							user_id: user.id,
							story_id: story,
							review: false,
							rewatch: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);
							liked.value = false;
						});
				});
		}
	}
}

async function setSave(state) {
	if (review.storyHasData) {
		console.log("has data");
		if (state === false) {
			console.log("set saved");
			supabase
				.rpc("saved", {
					qid: props.data.code,
					qval: 1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							saved: {
								status: true,
								time: new Date().toISOString(),
							},
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							saved.value = true;
						});
				});
		} else {
			console.log("rem saved");
			supabase
				.rpc("saved", {
					qid: props.data.code,
					qval: -1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							saved: null,
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							saved.value = false;
						});
				});
		}
	} else {
		console.log("doesnt has data");
		if (state === false) {
			console.log("set saved");
			supabase
				.rpc("saved", {
					qid: props.data.code,
					qval: 1,
				})
				.then(() => {
					supabase
						.from("diary")
						.insert({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
							created: new Date().toISOString(),
							saved: {
								status: true,
								time: new Date().toISOString(),
							},
						})
						.select()
						.then(res => {
							checkData(res.data[0]);

							review.storyHasData = true;

							saved.value = true;
						});
				});
		} else {
			console.log("rem saved");
			supabase
				.rpc("saved", {
					qid: props.data.code,
					qval: -1,
				})
				.then(() => {
					supabase
						.from("diary")
						.update({
							saved: null,
						})
						.match({
							user_id: user.id,
							story_id: story,
							rewatch: false,
							review: false,
						})
						.select()
						.then(res => {
							checkData(res.data[0]);
							saved.value = false;
						});
				});
		}
	}
}

const cloud = ref(props.data.diary);
const bookProgress = ref(0);
const maxPages = ref(props.data.length);

function checkData(array) {
	return;
	array.watched ? (watched.value = true) : (watched.value = false);
	array.saved ? (saved.value = true) : (saved.value = false);
	array.liked ? (liked.value = true) : (liked.value = false);
	array.rating ? (ratingData.value = array.rating.rating) : (ratingData.value = 0);
	array.rating ? (oldRating.value = array.rating.rating) : (oldRating.value = 0);

	if (
		array.watched === null &&
		array.saved === null &&
		array.liked === null &&
		array.rating === null
	) {
		supabase
			.from("diary")
			.delete()
			.match({
				id: array.id,
			})
			.then(res => {
				review.storyHasData = false;
				console.log("hum");
				console.log(res);
			});
	}
}

watchEffect(() => {
	if (review.setWatch === true) {
		console.log("wf set watch");
		watched.value = true;
		review.setWatch = false;
	}
	if (review.setLove === true) {
		console.log("wf set love");
		liked.value = true;
		review.setLove = false;
	}
	if (review.setRate === true) {
		console.log("wf set rating");
		ratingData.value = review.setRating;
		review.setRate = false;
	}
	// if (bookProgress.value > maxPages.value) {
	// 	bookProgress.value = maxPages.value;
	// }
	// if (bookProgress.value < 1) {
	// 	bookProgress.value = 0;
	// }
	// if (cloud.value.progress) {
	// 	if (cloud.value.progress.pages !== bookProgress.value) {
	// 		console.log("ei");
	// 	}
	// }
});
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
				@click="removeRate()"
			>
				<iconify-icon
					class="removeIcon"
					icon="ri:close-circle-line"
				/>
			</div>
			<div class="starsBox">
				<iconify-icon
					v-for="s in 5"
					@click="rateContent(s)"
					class="starIcon"
					:icon="'ri:star-' + (ratingData >= s ? 'fill' : 'line')"
					:style="ratingData >= s ? 'color: var(--yellow)' : ''"
				/>
			</div>
		</div>
		<div
			class="bookProgress"
			v-if="type === 'booksR'"
		>
			<button
				class="progBtn"
				@click="bookProgress--"
			>
				-
			</button>
			<input
				type="text"
				name="progress"
				id="progress"
				v-model="bookProgress"
				:max="maxPages"
			/>
			<button
				class="progBtn"
				@click="bookProgress++"
			>
				+
			</button>
		</div>
		<div
			@click="dialog.isReview = !dialog.isReview"
			class="reviewText"
		>
			{{ user.lang ? "Escreva algo!" : "Write something!" }}
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
* {
	/* outline: 0 solid rgb(255, 0, 136); */
	user-select: none;
}

.progBtn {
	border: none;
	background: none;
	background-color: #3a3a3a;
	padding: 0.15rem 0.65rem;
	border-radius: 0.15rem;
	color: #eee;
	font-weight: bold;
	cursor: pointer;
	font-size: 1.15rem;
}

#progress {
	background: none;
	border: none;
	color: #eee;
	text-align: center;
	font-weight: bold;
	padding: 0.25rem 0;
	background-color: #101010;
	border-radius: 0.15rem;
	width: 5rem;
}

.bookProgress {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.35rem;
	padding: 0.35rem;

	border-top: 0.01rem #555 solid;
	text-align: center;
	cursor: pointer;
	transition: all 150ms linear;
}

.starsBox {
	display: flex;
}
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
	display: flex;
	flex-flow: column;
	background-color: #1f1f1f;
}
.ratingBox:hover .removeItem {
	display: flex;
}
.reviewText {
	padding: 1rem;

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
	justify-content: center;
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
