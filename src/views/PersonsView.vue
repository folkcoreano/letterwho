<script setup>
import supabase from "@/supabase";
import {ref} from "vue";

const data = ref([]);
const crew = ref("");
const id = ref(crew.value.replaceAll(" ", "-"));

const getCrew = () => {
	try {
		supabase
			.from("crew")
			.select()
			.order("updated", {ascending: false})
			.then(res => {
				data.value = res.data;
			});
	} catch (e) {
		console.log(e);
	}
};

const addCrew = () => {
	try {
		supabase
			.from("crew")
			.insert({crew_id: crew.value.toLowerCase().replaceAll(" ", "-"), name: crew.value})
			.then(() => {
				crew.value = "";
				getCrew();
			});
	} catch (e) {
		console.log(e);
	}
};

getCrew();
</script>

<template>
	<div>
		<div v-if="false">
			<input
				type="text"
				v-model.trim="crew"
				name="crew"
				id="crew"
			/>
			<button @click="addCrew">add</button>
			<br />
			{{ crew }}
			<br />
			{{ crew.toLowerCase().replaceAll(" ", "-") }}
		</div>
		<p class="per">
			<RouterLink
				class="item"
				v-for="({crew_id, name}, i) in data"
				:key="i"
				:to="{name: 'person', params: {id: crew_id}}"
			>
				{{ name }}
			</RouterLink>
		</p>
	</div>
</template>

<style scoped>
.per {
	/* width: fit-content; */
	display: flex;
	flex-flow: row wrap;
	gap: 0.25rem;
}

.item {
	font-weight: bold;
	border-bottom: 2px #aaa solid;
}
</style>
