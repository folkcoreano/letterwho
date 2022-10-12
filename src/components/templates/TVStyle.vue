<script setup>
import {folder, url} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";
import {useImage, watchOnce} from "@vueuse/core";
import {ref} from "vue";

const props = defineProps({
	data: Object,
});

const {lang} = useUser();

const {
	title,
	length,
	frames,
	range_id: {range},
	story_id,
	type,
	story,
	released,
	rating,
	code,
	rated,
	watched,
	liked,
} = props.data;

const frameNumber = Math.floor(Math.random() * frames);

let haveFrame = false;

if (frames < 0) {
} else {
	haveFrame = true;
}

let frame = folder(`${type}/${range}/${code}F${frameNumber}`);

const {isReady} = useImage({src: frame});

let writer = {crew_id: "aaaa", name: "aaaa"};

if (story_id.some(e => e.role === "Writer")) {
	writer = story_id.filter(e => e.role === "Writer").flatMap(e => e.crew_id)[0];
}

let quote = "";

if (props.data.quote.length > 0) {
	const sortedQuote = props.data.quote[Math.floor(Math.random() * props.data.quote.length)];
	quote = lang === "pt-br" ? sortedQuote.pt : sortedQuote.en;
}

const cover = `${type}/${range}/${code}`;

let resume = "";

if (props.data.resume) {
	resume = lang === "pt-br" ? props.data.resume.pt : props.data.resume.en;
}

const time = useTime(lang, released);

const isPC = ref(window.matchMedia("(min-width: 35rem)").matches);

window.matchMedia("(min-width: 35rem)").onchange = e => {
	isPC.value = e.matches;
};
</script>

<template>
	<div
		v-show="isReady"
		:class="haveFrame ? 'pageMain' : 'pageBlank'"
		:style="haveFrame ? `background-image: url(${frame})` : ''"
	>
		<div class="mainContent">
			<div class="contentStatus">
				<div class="statusArea">
					<img
						draggable="false"
						:alt="title"
						class="coverPicture"
						:src="folder(cover, 250)"
					/>

					<div
						v-if="false"
						class="coverStatus"
					>
						<div class="coverStatusItem">
							<iconify-icon
								style="color: var(--yellow)"
								icon="ri:star-fill"
							/>
							<span>
								{{ rating ? (rating / rated).toFixed(1) : 0 }}
							</span>
						</div>
						<div class="coverStatusItem">
							<iconify-icon
								style="color: var(--blue)"
								icon="ri:eye-fill"
							/>
							<span>
								{{ watched }}
							</span>
						</div>
						<div class="coverStatusItem">
							<iconify-icon
								style="color: var(--red)"
								icon="ri:hearts-fill"
							/>
							<span>
								{{ liked }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="pageData mobileHeader">
				<div class="pageHeader">
					<div class="pageTitle">
						{{ title }}
					</div>

					<div class="pageWriter">
						{{ lang === "pt-br" ? "Escrito por " : "Written by " }}
						<RouterLink
							class="writerLink"
							:to="{name: 'person', params: {id: writer.crew_id}}"
						>
							{{ writer.name }}
						</RouterLink>
					</div>
				</div>

				<span class="pageQuote">
					{{ quote }}
				</span>

				<div
					v-if="isPC"
					class="pageResume"
				>
					{{ resume }}
				</div>

				<div
					v-if="isPC"
					class="pageDetails"
				>
					<div class="pageDetailsItem">
						<iconify-icon
							class="pageDetailsItemIcon"
							icon="ri:cake-2-fill"
						/>
						<span>
							{{ time }}
						</span>
					</div>

					<div class="pageDetailsItem">
						<iconify-icon
							class="pageDetailsItemIcon"
							icon="ri:timer-2-fill"
						/>
						<span> {{ length }}MIN </span>
					</div>

					<div class="pageDetailsItem">
						<iconify-icon
							class="pageDetailsItemIcon"
							icon="ri:calendar-fill"
						/>
						<span>
							{{ new Date(released).toLocaleDateString() }}
						</span>
					</div>
				</div>
				<div
					v-if="isPC"
					class="cast"
				>
					<slot name="cast" />
				</div>
			</div>

			<div
				v-if="!isPC"
				class="pageData mobile"
			>
				<div
					v-if="!isPC"
					class="pageResume"
				>
					{{ resume }}
				</div>

				<div
					v-if="!isPC"
					class="pageDetails"
				>
					<div class="pageDetailsItem">
						<iconify-icon
							class="pageDetailsItemIcon"
							icon="ri:cake-2-fill"
						/>
						<span>
							{{ time }}
						</span>
					</div>

					<div class="pageDetailsItem">
						<iconify-icon
							class="pageDetailsItemIcon"
							icon="ri:timer-2-fill"
						/>
						<span> {{ length }}MIN </span>
					</div>

					<div class="pageDetailsItem">
						<iconify-icon
							class="pageDetailsItemIcon"
							icon="ri:calendar-fill"
						/>
						<span>
							{{ new Date(released).toLocaleDateString() }}
						</span>
					</div>
				</div>
			</div>
			<div
				v-if="!isPC"
				class="cast"
			>
				<slot name="cast" />
			</div>
			<div class="parts">
				<slot name="parts" />
			</div>
		</div>
	</div>
	<div v-if="!isReady">
		<loading-state />
	</div>
</template>

<style scoped>
* {
	outline: 0px solid rgba(255, 0, 135, 0.5);
}
.parts {
	grid-column: 2;
}
.cast {
	grid-column: 1/3;
}

.pageProgress {
	grid-column: 1/3;
}

.reviewBarShowIcon {
	display: flex;
	font-size: 3.55rem;
	padding: 0.5rem;
	cursor: pointer;
	color: #fff;
	background-color: var(--yellow);
	border-radius: 50%;
}

.activityBox {
	grid-column: 1/3;
}

.reviewBarShow {
	position: fixed;
	bottom: 3.55rem;
	right: 1.55rem;
	display: block;
	--trans: all 200ms ease;

	transition: var(--trans);
}

.rotate {
	rotate: 135deg;
	transition: var(--trans);
}

.reviewBar {
	position: fixed;
	bottom: 0;
	height: 100%;
	left: 0;
	right: 0;
	z-index: 2;
	translate: 0 100%;
	--time: all 350ms ease-in-out;
	transition: var(--time);

	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: end;
	background-image: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 1)
	);
}

.reviewBarUp {
	translate: 0 0;
	transition: var(--time);
}

.reviewSide {
	display: none;
}

.pageMain {
	background-size: contain;
	background-position: center top;
	background-repeat: no-repeat;
	padding: 0.5rem;
	max-width: 75rem;
	margin: -0.5rem;
	transition: all 300ms linear;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: repeat(5, 100px);
	box-shadow: inset 0rem -20rem 3rem #050505;
}
.mainContent {
	grid-row: 3;
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: repeat(3, auto);
	gap: 1rem 0.35rem;
	margin: auto;
}
.coverStatus {
	display: flex;
	flex-flow: row;
	justify-content: space-around;
}
.statusArea {
	display: flex;
	flex-flow: column;
	gap: 0.35rem;
	width: fit-content;
}
.coverStatusItem {
	display: flex;
	gap: 0.2rem;
	align-items: center;
	font-size: 0.95rem;
}
.contentStatus {
	display: grid;
	align-content: flex-start;
	gap: 1rem;
	grid-column: 1;
	grid-row: 1;
}
.coverPicture {
	max-width: 100%;
	width: 9rem;
	border: solid 0.001rem #555;
	transition: all 150ms linear;
}
.coverPicture:hover {
	border: solid 0.001rem #777;
}
.pageDetails {
	justify-content: space-evenly;
	grid-row: 5;

	display: flex;
	gap: 0.5rem;
}
.pageDetailsItem {
	font-size: 0.85rem;
	display: flex;
	flex-flow: row wrap;
	gap: 0.35rem;
	align-items: center;
	color: #ccc;
	font-weight: bold;
}
.pageDetailsItemIcon {
	font-size: 1rem;
}
.pageData {
	grid-column: 2 / 3;
	grid-row: 1;

	display: flex;
	flex-flow: column;
	text-shadow: 0 0 0.5rem #050505;
	gap: 1rem;
	padding: 0 0.5rem;
}
.pageTitle {
	font-size: 1.65rem;
	font-weight: bold;
}
.pageWriter {
	color: #dfdfdf;
}
.pageQuote {
	text-transform: uppercase;
	color: #ddd;
	font-style: italic;
	font-size: 0.95rem;
	word-spacing: 0.15rem;
	font-weight: bold;
}
.pageResume {
	word-spacing: 0.15rem;
	color: #eaeaea;
	line-height: 1.2;
}

.mobile {
	grid-column: 1 /3;
	grid-row: 2;
}

.mobileHeader {
	justify-content: center;
}

@media (min-width: 35rem) {
	.pageMain {
		margin: auto;
		margin-top: -0.5rem;
		background-size: cover;
		background-position: center top;
		background-repeat: no-repeat;
		box-shadow: inset 0 -4rem 3rem #050505, inset 4rem 0rem 3rem #050505,
			inset -4rem 0rem 3rem #050505;
	}
	.mainContent {
		grid-row: 5;
		grid-template-columns: auto auto;
		grid-template-rows: repeat(4, auto);
		max-width: 70rem;
		width: 100%;
		gap: 2rem;
	}
	.reviewBar {
		display: none;
	}
	.activityBox {
		grid-column: 2;
	}
	.reviewBarShow {
		display: none;
	}
	.pageDetails {
		justify-content: start;
	}
	.reviewSide {
		grid-column: 3;
		grid-row: 1;
		display: block;
	}
	.coverPicture {
		width: 13rem;
	}
	.pageData {
		grid-column: 2;
		grid-row: 1;
		place-self: start;
		padding: 0;
	}
	.statusArea {
		position: sticky;
		top: 0;
	}
	.contentStatus {
		position: sticky;
		top: 0;
	}
	.pageProgress {
		grid-column: 2;
	}
	.cast {
		grid-column: 2;
	}
}
</style>
