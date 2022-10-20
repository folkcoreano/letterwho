<script setup>
import {ref} from "vue";
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";
import {onClickOutside} from "@vueuse/core";

const props = defineProps({
	data: Object,
});

const {lang} = useUser();

const {
	code,
	title,
	length,
	range,
	type,
	released,
	time,
	url,
	writer,
	frame,
	liked,
	watched,
	rated,
	rating,
	saved,
	resume,
	quote,
	cover,
} = props.data;

const isPC = ref(window.matchMedia("(min-width: 35rem)").matches);

window.matchMedia("(min-width: 35rem)").onchange = e => {
	isPC.value = e.matches;
};

const icon = ref();

if (type === "audios" || type === "tv") {
	icon.value = "ri:timer-2-fill";
}

if (type === "comics") {
	icon.value = "ri:pages-fill";
}

if (type === "books") {
	icon.value = "ri:file-copy-2-fill";
}

const target = ref();

const open = ref(false);

onClickOutside(target, e => {
	open.value = false;
});
</script>

<template>
	<div
		:class="frame ? 'pageMain' : 'pageBlank'"
		:style="frame ? `background-image: url(${folder(frame)})` : ''"
	>
		<dialog
			v-if="open"
			class="dialog"
		>
			<img
				ref="target"
				:alt="title"
				class="coverDialog"
				:src="folder(cover)"
			/>
		</dialog>
		<div class="mainContent">
			<div class="contentStatus">
				<div class="statusArea">
					<img
						@click="open = true"
						draggable="false"
						:alt="title"
						class="coverPicture"
						:src="folder(cover, '500')"
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
							:icon="icon"
						/>
						<span>
							{{ length }}{{ type === "books" ? (lang === "pt-br" ? " páginas" : " pages") : ""
							}}{{ type === "comics" ? (lang === "pt-br" ? " edições" : " issues") : ""
							}}{{ type === "tv" || type === "audios" ? "min" : "" }}</span
						>
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
					class="slots"
				>
					<div class="cast">
						<slot name="cast" />
					</div>
					<div class="parts">
						<slot name="parts" />
					</div>
				</div>
			</div>
			<div
				v-if="isPC"
				class="reviewBox"
			>
				<slot name="review" />
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
							:icon="icon"
						/>
						<span>
							{{ length }}{{ type === "books" ? (lang === "pt-br" ? " páginas" : " pages") : ""
							}}{{ type === "comics" ? (lang === "pt-br" ? " edições" : " issues") : ""
							}}{{ type === "tv" || type === "audios" ? "min" : "" }}</span
						>
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
				class="slots"
			>
				<div class="cast">
					<slot name="cast" />
				</div>
				<div class="parts">
					<slot name="parts" />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* * {
	outline: 0px solid rgba(255, 0, 135, 0.5);
} */

.writerLink {
	border-bottom: 1px solid #555;
	padding: 0 0.15rem;
	color: #fff;
	font-weight: bold;
}

.reviewBox {
	grid-column: 3;
	grid-row: 1;
}

.coverDialog {
	max-width: 90%;
	max-height: 90%;
}

.dialog {
	transition: all 150ms linear;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
	position: fixed;
	top: 0;
	bottom: 0;
	background-color: rgba(17, 17, 17, 0.5);
	height: 100%;
	width: 100%;
}

.slots {
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	grid-column: 1/3;
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
	cursor: pointer;
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
		box-shadow: inset 0 -3rem 3rem #050505, inset 3rem 0rem 3rem #050505,
			inset -3rem 0rem 3rem #050505;
	}
	.mainContent {
		grid-row: 5;
		grid-template-columns: auto auto;
		grid-template-rows: repeat(4, auto);
		max-width: 70rem;
		width: 100%;
		gap: 2rem;
	}

	.pageDetails {
		justify-content: start;
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
}
</style>
