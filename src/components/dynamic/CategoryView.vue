<script setup>
import {ref, onBeforeMount} from "vue";
import {useRoute} from "vue-router";
import {folder} from "@/stores/images";
import supabase from "@/supabase";

const {name} = useRoute();

const data = ref();

const load = ref(false);

onBeforeMount(() => {
	supabase
		.from("ranges")
		.select(`order,range_id(released),title,type,range`)
		.match({type: name})
		.limit(1, {foreignTable: "range_id"})
		.order("order", {ascending: true})
		.then(res => {
			if (res.data) {
				data.value = res.data;
			}
			load.value = true;
		});
});
</script>
<template>
	<template v-if="load">
		<div class="ranges">
			<RouterLink
				v-for="({title, range, type}, i) in data"
				:key="i"
				class="item"
				:to="{name: 'range', params: {type: type, range: range}}"
			>
				<img
					class="cover"
					:src="folder(`${type}/${range}/${range}`, '200')"
					:alt="title"
				/>
			</RouterLink>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>

<style scoped>
.ranges {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 0.35rem;
	max-width: 50rem;
	margin: auto;
}
.item {
	align-items: center;
	gap: 1rem;
	display: flex;
	flex-flow: column;
}
.cover {
	max-width: 100%;
}
</style>
