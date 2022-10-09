<script setup>
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";
import {ref} from "vue";

const props = defineProps({
	data: Object,
});

const {lang} = useUser();

const {
	code,
	type,
	title,
	length,
	released,
	range_id: {range},
	story_id,
} = props.data;

const writer = story_id.filter(e => e.role === "Writer").flatMap(e => e.crew_id)[0];

const pages = length + (lang ? " páginas" : " pages");

const sortedQuote = props.data.quote[Math.floor(Math.random() * props.data.quote.length)];

const quote = lang === "pt-br" ? sortedQuote.pt : sortedQuote.en;

const resume = lang === "pt-br" ? props.data.resume.pt : props.data.resume.en;

const time = useTime(lang, released);

const cover = `${type}/${range}/${code}`;

const isPC = ref(window.matchMedia("(min-width: 35rem)").matches);

window.matchMedia("(min-width: 35rem)").onchange = e => {
	isPC.value = e.matches;
};
</script>

<template>
	<div class="mainArea">
		<div class="coverArea">
			<picture>
				<source
					media="(min-width: 35rem)"
					:srcset="folder(cover, '500')"
				/>

				<img
					class="cover"
					:src="folder(cover, '250')"
					:alt="title"
				/>
			</picture>
		</div>
		<div
			class="dataArea"
			v-if="!isPC"
		>
			<div class="dataHeader">
				<div class="title">
					{{ title }}
				</div>
				<div class="writter">
					{{ lang === "pt-br" ? "Escrito por " : "Written by " }}
					<RouterLink
						class="writerLink"
						:to="{name: 'person', params: {id: writer.crew_id}}"
					>
						{{ writer.name }}
					</RouterLink>
				</div>
			</div>
			<div class="quote">
				{{ quote }}
			</div>
		</div>
		<div :class="isPC ? 'dataArea' : 'dataArea dataResume'">
			<div
				v-if="isPC"
				class="dataHeader"
			>
				<div class="title">
					{{ title }}
				</div>
				<div class="writter">
					{{ lang === "pt-br" ? "Escrito por " : "Written by " }}
					<RouterLink
						class="writerLink"
						:to="{name: 'person', params: {id: writer.crew_id}}"
					>
						{{ writer.name }}
					</RouterLink>
				</div>
			</div>
			<div
				v-if="isPC"
				class="quote"
			>
				{{ quote }}
			</div>

			<div class="resume">
				{{ resume }}
			</div>
			<div class="details">
				<div class="detail">
					<iconify-icon
						class="detailIcon"
						icon="ri:cake-2-fill"
					/>
					<span>
						{{ time }}
					</span>
				</div>
				<div class="detail">
					<iconify-icon
						class="detailIcon"
						icon="ri:file-copy-2-fill"
					/>
					<span> {{ pages }} </span>
				</div>
				<div class="detail">
					<iconify-icon
						class="detailIcon"
						icon="ri:calendar-fill"
					/>
					<span>
						{{ released }}
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
			class="cast"
		>
			<slot name="cast" />
		</div>
	</div>
</template>

<style scoped>
* {
	outline: 0px dotted deeppink;
}

.cast {
	grid-column: 1/3;
	grid-row: 3;
}

.quote {
	text-transform: uppercase;
	font-style: italic;
	font-size: 0.95rem;
	word-spacing: 0.15rem;
	font-weight: bold;
}

.mainArea {
	gap: 1rem;
	max-width: 60rem;
	display: grid;
	grid-template-columns: auto 1fr auto;
	grid-template-rows: auto;
	margin: auto;
}

.reviewSlot {
	display: flex;
	align-items: center;
}

.cover {
	max-width: 100%;
	width: 10rem;
	border: 0.01rem #3f3f3f solid;
	border-radius: 0.1rem;
	transition: all 150ms linear;
}

.cover:hover {
	border: 0.01rem #5f5f5f solid;
	transition: all 150ms linear;
}

.dataHeader {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}

.title {
	font-size: 1.55rem;
	font-weight: bold;
}

.coverArea {
	display: flex;
	align-items: flex-start;
	grid-column: 1;
	grid-row: 1;
}

.dataArea {
	grid-column: 2;
	grid-row: 1;
	display: flex;
	flex-flow: column;
	justify-content: center;
	gap: 1rem;
}

.dataResume {
	grid-column: 1/3;
	grid-row: 2;
}

.details {
	display: flex;
	gap: 1rem;
	justify-content: space-evenly;
}

.detail {
	font-size: 0.85rem;
	display: flex;
	align-items: center;
	gap: 0.35rem;
	padding: 0.15rem;
	color: #ccc;
}

.detailIcon {
	font-size: 1rem;
}

@media (min-width: 35rem) {
	.details {
		justify-content: flex-start;
	}
	.coverArea {
		grid-column: 1;
		grid-row: 1;
	}

	.cover {
		width: 16.55rem;
	}
	.dataArea {
		grid-column: 2;
		grid-row: 1;
	}

	.dataResume {
		grid-column: 2;
		grid-row: 2;
	}

	.cast {
		grid-column: 2;
		grid-row: 2;
	}
}
</style>
