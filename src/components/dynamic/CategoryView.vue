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
		.select(`order,title,type,range`)
		.match({type: name})
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
			<div v-for="({title, range, type}, i) in data">
				<RouterLink
					:key="i"
					:to="{name: 'range', params: {type: type, range: range}}"
				>
					<img
						class="cover"
						:src="folder(`${type}/${range}/${range}`, '500')"
						:alt="title"
					/>
				</RouterLink>
			</div>
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
	gap: 0.75rem;
	max-width: 45rem;
	margin: auto;
}
.cover {
	max-width: 100%;
	outline: 0.001rem #2f2f2f solid;
	border-radius: 0.15rem;
	transition: all 150ms linear;
}

.cover:hover {
	transition: all 150ms linear;
	outline: 0.001rem #3f3f3f solid;
}
</style>
