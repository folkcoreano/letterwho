<script setup>
import {folder} from "@/stores/images";

const props = defineProps({
	data: Object,
});
</script>

<template>
	<div class="likes">
		<RouterLink
			:to="{name: 'review', params: {type: type, range: range_id, story: url, id: id}}"
			v-for="(
				{
					review_id: {
						id,
						text,
						user_id: {name, picture},
						story_id: {type, range_id, url},
					},
				},
				i
			) in data"
			:key="i"
			class="like"
		>
			<div>
				<img
					style="max-width: 3rem; border-radius: 50%"
					:src="folder(picture, '150')"
					:alt="name"
				/>
			</div>
			<div>
				<div>{{ name }}</div>
				<div>{{ text }}</div>
			</div>
		</RouterLink>
	</div>
</template>

<style scoped>
.likes {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
.like {
	display: flex;
	gap: 0.5rem;
}
</style>
