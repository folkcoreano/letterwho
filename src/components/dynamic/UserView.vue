<script setup>
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import setTitle from "@/stores/title";
import {Pie, Bar, Doughnut} from "vue-chartjs";
import {folder, favicon} from "@/stores/images";
import {ref, onMounted, onUnmounted} from "vue";
import {useFavicon} from "@vueuse/core";

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
const chartData = ref({});

const chartOptions = ref({});

async function getUser() {
	const {getFirestore, getDoc, doc} = await import("firebase/firestore");

	const db = getFirestore();
	const userQuery = doc(db, "users", id);

	getDoc(userQuery).then(res => {
		if (res.exists()) {
			user.value = res.data();
			setTitle(user.value.name);
			const icon = favicon(user.value.picture.slice(0, -4));
			useFavicon(icon);

			if (user.value.tv !== undefined) {
				chartData.value = {
					responsive: true,
					labels: ["TV", "Audios", "Books", "Comics"],
					datasets: [
						{
							label: user.value.name,
							backgroundColor: ["#ff3863", "#80558c", "#fcc14a", "#59ce8f"],
							data: [user.value.tv, user.value.audios, user.value.books, user.value.comics],
						},
					],
				};

				chartOptions.value = {
					resposive: true,
					maintainAspectRatio: true,
					layout: {
						padding: 20,
					},
					plugins: {
						title: {
							display: true,
							color: "#eee",
							font: {
								size: 25,
								weight: "bold",
							},
							text: user.value.name,
						},
						legend: {
							labels: {
								font: {
									size: 15,
									weight: "bold",
								},
								color: "#eee",
							},
						},
					},
				};
			}

			load.value = true;
		} else {
			load.value = false;
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
	useFavicon("https://ik.imagekit.io/letterwho/tardis.svg");
});
</script>

<template>
	<div class="user">
		<!-- <pre>{{ user }}</pre> -->
		<Bar
			v-if="load"
			:chartData="chartData"
			:chartOptions="chartOptions"
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
