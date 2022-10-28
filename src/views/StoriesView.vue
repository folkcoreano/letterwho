<script setup>
import supabase from "@/supabase";
import axios from "axios";
import {ref} from "vue";

const data = ref([]);

const getStories = () => {
	supabase
		.from("story")
		.select("story_id, released, type, title, url, range_id")
		.order("released", {ascending: true})
		.then(res => {
			data.value = res.data;
		});
};

getStories();
</script>

<template>
	<div>
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
