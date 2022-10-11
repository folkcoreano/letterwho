<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const {
	params: {type, range},
} = useRoute();

const data = ref();
const load = ref(false);

async function getRange() {
	supabase
		.from("ranges")
		.select("*, range_id(title,type,range_id,released,url,story_id)")
		.order("released", {foreignTable: "range_id", ascending: true})
		.match({range: range})
		.limit(1)
		.single()
		.then(res => {
			data.value = res.data;
			setTitle(res.data.title);
			load.value = true;
		});
}

getRange();
</script>

<template>
	<template v-if="load">
		<div class="range">
			<RouterLink
				v-for="({title, story_id, type, range_id, url}, i) in data.range_id"
				:key="i"
				class="story"
				:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
			>
				<img
					class="image"
					:src="folder(`${type}/${range_id}/${story_id}`, '150')"
					:alt="title"
				/>
				<!-- {{ title }} -->
			</RouterLink>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.image {
	max-width: 100%;
}
.range {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0.35rem;
	max-width: 50rem;
	margin: auto;
}

.story {
	align-items: center;
	flex-flow: column;
	display: flex;
}
</style>
