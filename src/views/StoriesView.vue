<script setup>
import supabase from "@/supabase";
import axios from "axios";
import {ref} from "vue";

// let url = "https://api.catalogopolis.xyz/v1/serials/";
// let episode = 55;
// let end = "/episodes";

// let serial = url + episode;
// let episodes = url + episode + end;

// axios.get(episodes).then(res => {
// 	const file = [];

// 	const first = res.data[0].originalAirDate;

// 	const totaltime = res.data.flatMap(e => +e.runtime.slice(0, 2)).reduce((a, b) => a + b);

// 	let n = 1;

// 	for (let ep of res.data) {
// 		file.push({
// 			story_id: "TV" + ep.serialID,
// 			story: "TV" + ep.serialID + "." + n++,
// 			title: ep.title,
// 			length: +ep.runtime.slice(0, 2),
// 			released: ep.originalAirDate,
// 		});
// 	}

// 	let story = {};

// 	axios.get(serial).then(res => {
// 		story = {
// 			story_id: "TV" + res.data[0].story,
// 			code: "TV" + res.data[0].story,
// 			parts: "TV" + res.data[0].story,
// 			quote: "TV" + res.data[0].story,
// 			range_id: "season-eigth",
// 			length: totaltime,
// 			type: "tv",
// 			released: first,
// 			title: res.data[0].title,
// 			url: new String(res.data[0].title).replaceAll(" ", "-").toLowerCase(),
// 		};

// 		console.log(story);

// 		console.log(file);

// 		// supabase
// 		// 	.from("story")
// 		// 	.insert(story)
// 		// 	.then(res => {
// 		// 		console.log(res);
// 		// 		supabase
// 		// 			.from("parts")
// 		// 			.insert(file)
// 		// 			.then(res => {
// 		// 				console.log(res.data);
// 		// 				console.log(res.error);
// 		// 			});
// 		// 	});
// 	});
// });

const code = ref("");
const data = ref([]);
const title = ref("");
const type = ref("");
const release = ref("");

const getStories = () => {
	supabase
		.from("story")
		.select("story_id, type, title, url, range_id")
		.then(res => {
			data.value = res.data;
		});
};

getStories();

// const addStory = () => {
// 	const file = {
// 		story_id: title.value,
// 		code: code.value,
// 		quote: code.value,
// 		parts: code.value,
// 		url: title.value.toLowerCase().replaceAll(" ", "-"),
// 		type: type.value,
// 		released: release.value,
// 	};
// 	console.log(file);
// };
</script>

<template>
	<div>
		<!-- <div class="inputs">
			code:
			<input
				type="text"
				v-model="code"
			/>
			title
			<input
				type="text"
				v-model="title"
			/>
			type
			<input
				type="text"
				v-model="type"
			/>
			released
			<input
				type="text"
				v-model="release"
			/>
			<button @click="addStory">add</button>
		</div> -->
		<br />
		<div>
			<div
				v-for="({story_id, type, title, url, range_id}, i) in data"
				:key="i"
			>
				<RouterLink :to="{name: 'story', params: {type: type, range: range_id, story: url}}">
					{{ title }}
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<style scoped>
.inputs {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
	width: fit-content;
}
</style>
