<script setup>
import {folder} from "@/stores/images";
import {ref} from "@vue/reactivity";
import {useRoute} from "vue-router";

const {
	params: {type, range, story},
} = useRoute();

const datas = ref();

const load = ref(false);

async function getReviews() {
	const {collection, getDocs, getFirestore} = await import("firebase/firestore");

	const db = getFirestore();

	const query = collection(db, "reviews", type, range, story, "reviews");

	let data = [];

	let item;

	getDocs(query)
		.then(res => {
			res.forEach(doc => {
				item = {
					id: doc.id,
					data: doc.data(),
				};
				data.push(item);
			});
		})
		.finally(() => {
			datas.value = data;
			load.value = true;
		});
}

getReviews();
</script>

<template>
	<template v-if="load">
		<div style="display: flex; gap: 1rem">
			<router-link
				:key="i"
				v-for="({id, data}, i) in datas"
				:to="{
					name: 'review',
					params: {type: type, range: range, story: story, id: id},
				}"
			>
				<img
					style="border-radius: 50%"
					:src="folder(data.picture.slice(0, -4), '50')"
					:alt="data.name"
				/>
				<br />
				{{ data.name }}
				<br />
			</router-link>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>
