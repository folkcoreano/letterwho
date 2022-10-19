<script setup>
import {useDialog} from "@/stores/dialog";
import {useUser} from "@/stores/user";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import ReviewWindow from "@/components/functions/reviews/ReviewWindow.vue";
import supabase from "@/supabase";

const props = defineProps({
	data: Object,
	doctors: Object,
});

let doctors = [];

// try {
// 	doctors = [...new Set(props.doctors)];
// 	// for (let doc of props.doctors) {
// 	// 	let file = {
// 	// 		[doc.replace("-", "")]: {
// 	// 			watchtime: "",
// 	// 			stories: "",
// 	// 		},
// 	// 	};
// 	// 	doctors.push(file);
// 	// 	// doctors.doctors.push({
// 	// 	// 	[doc.replace("-", "")]: {
// 	// 	// 		watchtime: "",
// 	// 	// 		stories: "",
// 	// 	// 	},
// 	// 	// });
// 	// }
// 	console.log(doctors);
// } catch (e) {
// 	console.log(e);
// }

const {
	params: {type, range, story},
} = useRoute();

const {id, lang} = useUser();

const dialog = useDialog();

const reference = `users/${id}/diary/${story}`;

const watched = ref(false);
const liked = ref(false);
const saved = ref(false);

const rated = ref();

const watching = ref(false);

const ratingData = ref(0);
const oldRating = ref(0);

const {released, length, title, url, code} = props.data;

const cover = type + "/" + range + "/" + props.data.code + ".jpg";

const meta = {
	released: released,
	length: length,
	title: title,
	range: range,
	story: url,
	code: code,
};

async function getData() {
	const {getFirestore, getDoc, doc} = await import("firebase/firestore");
	const db = getFirestore();
	const query = doc(db, reference);

	let request = {};

	getDoc(query).then(res => {
		res.exists() ? (request = res.data()) : (request = {});

		if (request.watched !== undefined) {
			watched.value = request.watched.status;
		} else {
			watched.value = false;
		}

		if (request.liked !== undefined) {
			liked.value = request.liked.status;
		} else {
			liked.value = false;
		}

		if (request.saved !== undefined) {
			saved.value = request.saved.status;
		} else {
			saved.value = false;
		}

		if (request.rating !== undefined) {
			rated.value = true;
			ratingData.value = request.rating.rating;
			oldRating.value = request.rating.rating;
		} else {
			rated.value = false;
			ratingData.value = 0;
			oldRating.value = 0;
		}
	});
}

async function rateContent(rating) {
	const {getFirestore, setDoc, doc} = await import("firebase/firestore");

	const db = getFirestore();

	const query = doc(db, reference);

	console.log("rateContent");

	console.log("oldrating", oldRating.value);
	console.log("ratingdata", ratingData.value);

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
				setDoc(
					query,
					{rating: {rating: rating, time: new Date().toISOString()}},
					{merge: true}
				).then(() => {
					if (watched.value === false) {
						watched.value = true;
						setWatch(false);
					}
					if (saved.value === true) {
						saved.value = false;
						setSave(true);
					}
					getData();
				});
			});
	}
}

async function removeRate() {
	const {getFirestore, updateDoc, deleteField, doc} = await import("firebase/firestore");

	const db = getFirestore();
	const query = doc(db, reference);

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
					updateDoc(query, {rating: deleteField()}, {merge: true}).then(res => {
						getData();
					});
				});
		});
}

async function setWatch(state) {
	const {getFirestore, setDoc, increment, doc} = await import("firebase/firestore");

	const db = getFirestore();
	const query = doc(db, reference);

	const doctorfile = doc(db, "users", id, "stats", "DOCTORS");

	const addDoctors = {
		doctors: [],
	};

	const remDoctors = {doctors: []};

	for (let doc of props.doctors) {
		addDoctors.doctors.push({
			status: {
				[doc]: {
					watchtime: increment(+1),
					stories: increment(+length),
				},
			},
		});
	}

	for (let doc of props.doctors) {
		remDoctors.doctors.push({
			status: {
				[doc]: {
					watchtime: increment(-1),
					stories: increment(-length),
				},
			},
		});
	}

	state ? desloga() : loga();

	function loga() {
		console.log("watch");

		watched.value = true;

		const data = {
			type: type,
			range: range,
			story: story,
			created: new Date().toISOString(),
			data: meta,
			watched: {
				status: true,
				time: new Date().toISOString(),
			},
		};

		supabase
			.rpc("watched", {
				qid: props.data.code,
				qval: 1,
			})
			.then(() => {
				setDoc(query, data, {merge: true})
					.then(res => {
						setDoc(doctorfile, addDoctors, {merge: true});
						console.log("watch success");
						if (saved.value === true) {
							saved.value = false;
							setSave(true);
						}
					})
					.catch(err => {
						console.log(err);
					});
			});
	}

	function desloga() {
		console.log("deswatch");

		watched.value = false;

		supabase
			.rpc("watched", {
				qid: props.data.code,
				qval: -1,
			})
			.then(() => {
				setDoc(
					query,
					{
						watched: false,
					},
					{merge: true}
				)
					.then(() => {
						setDoc(doctorfile, remDoctors, {merge: true});
						console.log("deswatch success");
					})
					.catch(err => {
						console.log(err);
					});
			});
	}
}

async function setLike(state) {
	const {getFirestore, setDoc, doc} = await import("firebase/firestore");

	const db = getFirestore();
	const query = doc(db, reference);

	state ? desloga() : loga();

	function loga() {
		console.log("like");

		liked.value = true;

		const data = {
			type: type,
			range: range,
			story: story,
			created: new Date().toISOString(),
			data: meta,
			liked: {
				status: true,
				time: new Date().toISOString(),
			},
		};
		supabase
			.rpc("liked", {
				qid: props.data.code,
				qval: 1,
			})
			.then(() => {
				setDoc(query, data, {merge: true})
					.then(() => {
						console.log("like success");
					})
					.catch(err => {
						console.log(err);
					});
			});
	}

	function desloga() {
		console.log("deslike");

		liked.value = false;

		supabase
			.rpc("liked", {
				qid: props.data.code,
				qval: -1,
			})
			.then(() => {
				setDoc(
					query,
					{
						liked: false,
					},
					{merge: true}
				)
					.then(() => {
						console.log("deslike success");
					})
					.catch(err => {
						console.log(err);
					});
			});
	}
}

async function setSave(state) {
	const {getFirestore, setDoc, doc} = await import("firebase/firestore");

	const db = getFirestore();
	const query = doc(db, reference);

	state ? desloga() : loga();

	function loga() {
		console.log("loga");

		saved.value = true;

		const data = {
			type: type,
			range: range,
			story: story,
			created: new Date().toISOString(),
			data: meta,
			saved: {
				status: true,
				time: new Date().toISOString(),
			},
		};
		supabase
			.rpc("watchlist", {
				qid: props.data.code,
				qval: 1,
			})
			.then(() => {
				setDoc(query, data, {merge: true})
					.then(() => {
						console.log("success");
					})
					.catch(err => {
						console.log(err);
					});
			});
	}

	function desloga() {
		console.log("desloga");

		saved.value = false;

		supabase
			.rpc("watchlist", {
				qid: props.data.code,
				qval: -1,
			})
			.then(() => {
				setDoc(
					query,
					{
						saved: {status: false},
					},
					{merge: true}
				)
					.then(() => {
						console.log("success");
					})
					.catch(err => {
						console.log(err);
					});
			});
	}
}

onMounted(() => {
	getData();
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
* {
	outline: 1px solid rgba(255, 0, 135, 0);
	user-select: none;
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
