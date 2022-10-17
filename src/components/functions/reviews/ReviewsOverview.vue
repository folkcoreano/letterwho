<script setup>
import {url} from "@/stores/url";
import {ref} from "vue";
import {useRoute} from "vue-router";

const {
	params: {type, range, story},
} = useRoute();

const reviews = ref([]);

async function getReviews() {
	const {getFirestore, query, collection, getDocs, limit} = await import("firebase/firestore");
	const q = query(collection(getFirestore(), "reviews", type, range, story, "reviews"), limit(3));

	let file;

	getDocs(q).then(res => {
		res.forEach(doc => {
			file = {
				id: doc.id,
				data: doc.data(),
			};
			reviews.value.push(file);
		});
	});
}

getReviews();
</script>

<template>
	<div>
		<router-link
			:to="{name: 'review', params: {type: type, range: range, story: story, id: id}}"
			v-for="({id, data}, i) in reviews"
			:key="i"
		>
			<img
				:src="url + 'tr:w-50/' + data.picture"
				:alt="data.name"
			/>{{ data.name }}:{{ data.review }}:{{ data.rating }}
		</router-link>
	</div>
</template>
