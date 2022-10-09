<script setup>
import {ref} from "vue";
import {useRoute} from "vue-router";
import {folder} from "@/stores/images";
import supabase from "@/supabase";

const {name} = useRoute();

const data = ref();

const load = ref(false);

async function getRanges() {
	supabase
		.from("ranges")
		.select("title, type, range")
		.match({type: name})
		.then(res => {
			if (res.data) {
				data.value = res.data;
			}
			load.value = true;
		});
}

getRanges();
</script>
<template>
	<template v-if="load">
		<div class="ranges">
			<div
				class="range"
				v-for="({title, range, type}, i) in data"
				:key="i"
			>
				<RouterLink
					class="item"
					:to="{name: 'range', params: {type: type, range: range}}"
				>
					<img
						class="cover"
						onerror="this.src='https://i.ibb.co/Kqbh5YK/imagem-2022-06-17-132705588-1-1.png'"
						:src="folder(`${type}/${range}/${range}`, '200')"
						alt=""
					/>
					{{ title }}
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
	display: flex;
	gap: 1rem;
}

.item {
	align-items: center;
	gap: 1rem;
	display: flex;
	flex-flow: column;
}

.cover {
	max-width: 10rem;
}
</style>
