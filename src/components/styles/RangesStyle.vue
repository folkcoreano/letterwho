<script setup>
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const {name} = useRoute();

const user = useUser();

const datalist = ref([]);

const {data} = await supabase
	.from("ranges")
	.select(`order,title,type,range,range_id(diary_id(watched))`)
	.filter("range_id.diary_id.user_id", "eq", user.id)
	.limit(1, {foreignTable: "range_id.diary_id"})
	.order("id", {foreignTable: "range_id.diary_id", ascending: false})
	.order("order", {ascending: true})
	.match({type: name});

for (const rag of data) {
	if (rag.range_id.length > 0) {
		datalist.value.push({
			title: rag.title,
			type: rag.type,
			range: rag.range,
		});
	}
}
</script>

<template>
	<div class="range">
		<RouterLink
			v-for="({title, type, range}, i) in datalist"
			:key="i"
			class="item"
			:to="{name: 'range', params: {type: type, range: range}}"
		>
			<img
				class="image"
				:src="folder(`${type}/${range}/${range}`, '400')"
				:alt="title"
				loading="lazy"
			/>
		</RouterLink>
	</div>
</template>

<style scoped>
.item {
	display: grid;
	grid-template-columns: 1fr;
}
.range {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: 1fr;
	gap: 0.35rem;
	max-width: 45rem;
	margin: auto;
}
.image {
	grid-column: 1;
	grid-row: 1;

	max-width: 100%;
	outline: 0.001rem #2f2f2f solid;
	border-radius: 0.15rem;
	transition: all 150ms linear;
}
.image:hover {
	transition: all 150ms linear;
	outline: 0.001rem #3f3f3f solid;
}
@media (min-width: 35rem) {
	.range {
		grid-template-columns: repeat(4, 1fr);
	}
}
</style>
