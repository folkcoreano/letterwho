<script setup>
import {folder, favicon} from "@/stores/images";
import setTitle from "@/stores/title";
import supabase from "@/supabase";
import {ref, onMounted, onUnmounted} from "vue";
import {useRoute} from "vue-router";
import {Pie, Doughnut} from "vue-chartjs";

import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	BarElement,
	CategoryScale,
	LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const {
	params: {id},
} = useRoute();

const user = ref();

const load = ref(false);
const chartData = ref({
	labels: ["January", "February", "March"],
	datasets: [
		{
			label: "Statistics",
			color: "red",
			backgroundColor: "deeppink",
			data: [400, 20, 12],
		},
	],
});

async function getUser() {
	const {getFirestore, getDoc, doc} = await import("firebase/firestore");

	const db = getFirestore();
	const userQuery = doc(db, "users", id);

	getDoc(userQuery).then(res => {
		if (res.exists()) {
			user.value = res.data();
			setTitle(user.value.name);
			const icon = favicon(user.value.picture.slice(0, -4));
			document.querySelector("link[rel*='icon']").href = icon;

			user.value.tv !== undefined
				? ((load.value = true),
				  (chartData.value = {
						labels: ["TV", "Audios", "Books", "Comics"],
						datasets: [
							{
								label: user.value.name,
								color: "#999",
								backgroundColor: ["#ff3863", "#80558c", "#fcc14a", "#59ce8f"],
								data: [user.value.tv, user.value.audios, user.value.books, user.value.comics],
							},
						],
				  }))
				: (load.value = false);
		} else {
			user.value = null;
		}
	});

	// supabase
	// 	.from("story")
	// 	.select("*", {count: "exact", head: true})
	// 	.match({type: "tv"})
	// 	.then(res => {
	// 		console.log(res.count);
	// 	});
}

onMounted(() => {
	getUser();
});
onUnmounted(() => {
	document.querySelector("link[rel*='icon']").href = "https://ik.imagekit.io/letterwho/tardis.svg";
});
</script>

<template>
	<div class="user">
		<!-- <pre>{{ user }}</pre> -->
		<Doughnut
			v-if="load"
			:chartData="chartData"
		/>
		<!-- <Pie
			v-if="load"
			:chartData="chartData"
		/> -->
	</div>
</template>

<style scoped>
.user {
	max-width: 40rem;
	margin: auto;
}
</style>
