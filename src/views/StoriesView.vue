<script setup lang="ts">
import supabase from "@/supabase";
import {ref} from "vue";

interface Story {
	story_id: any;
	code?: any;
	quote?: any;
	parts?: any;

	url?: any;

	type?: any | "tv" | "audios" | "books" | "comics";
	title?: any;
	released?: any;
	length?: any;
	resume?: JSON;
	range_id?: any;
	publisher_id?: any;
}

const code = ref("");
const data: any = ref([]);
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
// 	const file: Story = {
// 		story_id: title.value,
// 		code: code.value,
// 		quote: code.value,
// 		parts: code.value,
// 		url: title.value.toLowerCase().replaceAll(" ", "-"),
// 		type: type.value,
// 		released: release.value,
// 	};
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
		</div> -->
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
