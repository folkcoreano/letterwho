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
	<div class="reviews">
		<RouterLink
			:to="{name: 'review', params: {type: type, range: range_id, story: url, id: id}}"
			v-for="(
				{
					id,
					created,
					text,
					rating,
					rewatch,
					story_id: {title, type, range_id, url, released, code},
				},
				i
			) in data"
			:key="i"
			class="review"
		>
			<div class="side">
				<img
					class="img"
					:src="folder(`${type}/${range_id}/${code}`, '100')"
					:alt="title"
				/>
			</div>
			<div class="text">
				<div>
					{{ title }} ({{ new Date(released).getFullYear() }})
					<span v-if="rating > 0"
						><iconify-icon
							v-for="s in rating"
							icon="ri:star-fill"
							style="color: var(--yellow)"
						/>
						<iconify-icon
							v-if="rewatch"
							icon="ri:repeat-fill"
							style="color: var(--green)"
						/>
					</span>
				</div>
				<div>
					{{ text }}
				</div>
				<div>
					{{ useTime(lang, created) }}
				</div>
			</div>
		</RouterLink>
	</div>
</template>

<style scoped>
.reviews {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.review {
	display: flex;
	gap: 0.5rem;
}
.text {
	display: flex;
	flex-flow: column;
	gap: 0.15rem;
	justify-content: space-evenly;
}
.img {
	max-height: 8rem;
}
</style>
