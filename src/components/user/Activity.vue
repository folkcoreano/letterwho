<script setup>
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";

const {lang} = useUser();

const props = defineProps({
	data: Object,
});
</script>

<template>
	<div class="diary">
		<div
			:key="i"
			v-for="(
				{created, review, rewatch, story_id: {title, range_id, url, type, code, released}}, i
			) in data"
			class="item"
		>
			<div
				v-if="review"
				class="itemIcon"
			>
				<img
					:src="folder(`${type}/${range_id}/${code}`, '100')"
					alt=""
				/>
			</div>
			<div v-if="review">
				<RouterLink :to="{name: 'story', params: {type: type, range: range_id, story: url}}">
					{{ title }} {{ useTime(lang, created) }}
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<style scoped>
.diary {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}

.item {
	display: flex;
	gap: 1rem;
	padding: 0.45rem;
}
</style>
