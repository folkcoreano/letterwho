<script setup>
import {folder} from "@/stores/images";
import supabase from "@/supabase";
const props = defineProps({
	type: String,
});
const {data} = await supabase
	.from("story")
	.select(
		`
    title,
    code,
    type,
    range_id,
    url
    `
	)
	.limit(4)
	.order("id", {ascending: false})
	.match({type: props.type});
</script>

<template>
	<div class="block">
		<div class="title">{{ type }}</div>
		<div class="stories">
			<RouterLink
				v-for="({code, range_id, title, type, url}, i) of data"
				:to="{name: 'story', params: {type, range: range_id, story: url}}"
			>
				<img
					class="story"
					:src="folder(`${type}/${range_id}/${code}`, '300')"
					:alt="title"
				/>
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.stories {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 0.25rem;
	padding: 0.55rem 0;
}
.story {
	width: 100%;
	max-width: 13rem;
	border-radius: 0.15rem;
}
</style>
