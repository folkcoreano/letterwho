<script setup>
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";

const {lang} = useUser();

const props = defineProps({
	data: Object,
	context: String,
});
</script>

<template>
	<div class="diary">
		<div
			:key="i"
			v-for="(
				{
					created,
					watched,
					liked,
					saved,
					review,
					rating,
					review_id,
					rewatch,
					story_id: {title, range_id, url, type, code, released},
				},
				i
			) in data"
			class="item"
		>
			<RouterLink
				v-if="context !== 'story'"
				class="itemIcon"
				:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
			>
				<img
					class="img"
					:src="folder(`${type}/${range_id}/${code}`, '150')"
					:alt="title"
				/>
			</RouterLink>
			<RouterLink
				:to="
					review
						? {name: 'review', params: {type, range: range_id, story: url, id: review_id.id}}
						: {name: 'story', params: {type, range: range_id, story: url}}
				"
				class="side"
			>
				<div class="title">
					<span> {{ title }} ({{ new Date(released).getFullYear() }}) </span>

					<iconify-icon
						v-if="watched"
						style="color: var(--blue)"
						icon="ri:eye-fill"
					/>

					<iconify-icon
						v-if="liked"
						style="color: var(--red)"
						icon="ri:heart-fill"
					/>

					<iconify-icon
						v-if="saved"
						style="color: var(--green)"
						icon="ri:bookmark-fill"
					/>

					<iconify-icon
						v-if="review"
						style="color: #ccc"
						icon="ri:align-left"
					/>

					<span
						class="stars"
						v-if="rating"
					>
						<iconify-icon
							v-for="s in rating.rating"
							style="color: var(--yellow)"
							icon="ri:star-s-fill"
						/>
					</span>

					<iconify-icon
						v-if="rewatch"
						style="color: var(--green)"
						icon="ri:repeat-fill"
					/>

					<span
						class="stars"
						v-if="review"
					>
						<iconify-icon
							v-if="review_id.loved"
							style="color: var(--red)"
							icon="ri:heart-3-fill"
						/>
						<iconify-icon
							v-for="s in review_id.rating"
							style="color: var(--yellow)"
							icon="ri:star-s-fill"
						/>
					</span>
				</div>
				<div class="bot">
					{{ useTime(lang, created) }} - {{ new Date(created).toLocaleDateString() }}
				</div>
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.diary {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}

.stars {
	display: flex;
}
.item {
	display: flex;
	gap: 0.55rem;
	padding: 0.45rem;
}

.item:not(:last-child) {
	border-bottom: 0.01rem #333 solid;
}

.side {
	display: flex;
	flex-flow: column;
	justify-content: space-evenly;
}
.title {
	display: flex;
	flex-flow: row;
	gap: 0.25rem;
	align-items: center;
	font-weight: bold;
}

.bot {
	color: #aaa;
}

.img {
	max-width: 2.55rem;
	outline: 0.001rem solid #555;
	border-radius: 0.05rem;
	transition: 150ms linear all;
}

.img:hover {
	transition: 150ms linear all;
	outline: 0.001rem solid #888;
}
</style>
