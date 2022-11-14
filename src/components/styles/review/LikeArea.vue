<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	id: Number,
});

const user = useUser();

const isLiked = ref();

const {count} = await supabase.from("likes").select("*", {count: "exact", head: true}).match({
	review_id: props.id,
	user_id: user.id,
});

if (count > 0) {
	isLiked.value = true;
} else {
	isLiked.value = false;
}

async function likeReview(state) {
	if (state === false) {
		const {data} = await supabase.from("likes").insert({
			review_id: props.id,
			user_id: user.id,
		});
		isLiked.value = true;
		console.log(data);
	} else {
		const {data} = await supabase.from("likes").delete().match({
			review_id: props.id,
			user_id: user.id,
		});
		isLiked.value = false;
		console.log(data);
	}
}
</script>

<template>
	<div class="likeBar">
		<iconify-icon
			@click="likeReview(isLiked)"
			class="likeIcon"
			:style="isLiked ? 'color: var(--red)' : ''"
			:icon="isLiked ? 'ri:heart-fill' : 'ri:heart-line'"
		/>
	</div>
</template>

<style scoped>
.likeIcon {
	font-size: 2rem;
	cursor: pointer;
}

.likeBar {
	padding: 0.35rem;
}
</style>
