<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import supabase from "@/supabase";
import {ref, onBeforeMount} from "vue";
import {useRoute} from "vue-router";

const {
	params: {type, range},
} = useRoute();

const data = ref();
const load = ref(false);
const relationBatch = ref([]);

function addChar() {
	for (const ep of data.value.range_id) {
		relationBatch.value.push({
			crew_id: "peter-capaldi",
			story_id: ep.code,
			character_id: "twelfth-doctor",
			role: "Doctor",
			type: "CHARACTER",
		});
	}

	supabase
		.from("relation")
		.insert(relationBatch.value)
		.then(res => {
			console.log(res);
		});
}

onBeforeMount(() => {
	supabase
		.from("ranges")
		.select("title,range_id(title,released,url,code)")
		.order("released", {foreignTable: "range_id", ascending: true})
		.match({type: type, range: range})
		.limit(1)
		.single()
		.then(res => {
			data.value = res.data;
			setTitle(res.data.title);
			load.value = true;
		});
});
</script>

<template>
	<template v-if="load">
		<div>
			<!-- <button @click="addChar">add</button> -->
			<div class="range">
				<RouterLink
					v-for="({title, code, url}, i) in data.range_id"
					:key="i"
					class="story"
					:to="{name: 'story', params: {type: type, range: range, story: url}}"
				>
					<img
						class="image"
						:src="folder(`${type}/${range}/${code}`, '150')"
						:alt="title"
					/>
					<!-- {{ title }} -->
				</RouterLink>
			</div>
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
