<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const {
	params: {id},
} = useRoute();

const data = ref();
const load = ref(false);

const getData = () => {
	supabase
		.from("characters")
		.select("name,character_id(story_id(title,released,code,range_id,type,url))")
		.match({character_id: id})
		.limit(1)
		.single()
		.then(res => {
			data.value = res.data;
			setTitle(res.data.name);
			load.value = true;
		});
};

getData();
</script>

<template>
	<template v-if="load">
		<div class="items">
			<div
				class="item"
				v-for="({story_id: {title, code, released, range_id, type, url}}, i) in data.character_id"
				:key="i"
			>
				<RouterLink :to="{name: 'story', params: {type: type, range: range_id, story: url}}">
					<img
						class="img"
						:src="folder(`${type}/${range_id}/${code}`, '250')"
						alt=""
					/>
					<div>{{ title + " (" + new Date(released).getFullYear() + ")" }}</div>
				</RouterLink>
			</div>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.items {
	display: flex;
	gap: 0.5rem;
}
.item {
	display: flex;
	flex-flow: column;
}

.img {
	max-width: 10rem;
}
</style>
