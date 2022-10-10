<script setup>
import supabase from "@/supabase";
import axios from "axios";
import {ref} from "vue";

const props = defineProps({
	data: Object,
});

const data = props.data;

// try {
// 	axios.get("https://api.catalogopolis.xyz/v1/serials/1/episodes").then(res => {
// 		console.log(res);
// 	});
// } catch (e) {
// 	console.log(e);
// }
</script>

<template>
	<div class="parts">
		<div
			v-for="({story, title, released, length}, i) in data"
			:key="i"
		>
			{{ story }}: {{ title }}, {{ released }} - {{ length }}
		</div>
	</div>
</template>
