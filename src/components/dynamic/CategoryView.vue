<script setup lang="ts">
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
	<div>
		<div v-if="load">
			<div
				v-for="({title, range, type}, i) in data"
				:key="i"
			>
				<RouterLink :to="{name: 'range', params: {type: type, range: range}}">
					<img
						:src="folder(`${type}/${range}/${range}`, '200')"
						alt=""
					/>
					{{ title }}
				</RouterLink>
			</div>
		</div>
		<div v-else>
			<LoadingState />
		</div>
	</div>
</template>
