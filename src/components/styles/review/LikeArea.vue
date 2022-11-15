<script setup>
import {useUpdateKey} from "@/stores/keys";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	id: Number,
	likes_size: Number,
});

const user = useUser();

const updateKey = useUpdateKey();

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
		await supabase.from("likes").insert({
			review_id: props.id,
			user_id: user.id,
		});
		isLiked.value = true;
	} else {
		await supabase.from("likes").delete().match({
			review_id: props.id,
			user_id: user.id,
		});
		isLiked.value = false;
	}
	updateKey.reviewKey += 1;
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
		<span>{{ likes_size }}</span>
	</div>
</template>

<style scoped>
.likeBar {
	display: flex;
	gap: 0.25rem;
	align-items: center;
	font-weight: bold;
}
.likeIcon {
	font-size: 1.65rem;
	cursor: pointer;
}

.likeBar {
	padding: 0.35rem;
}
</style>
