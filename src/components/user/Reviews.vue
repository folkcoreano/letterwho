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
				{
					id,
					created,
					text,
					loved,
					rating,
					rewatch,
					story_id: {title, type, range_id, url, released, code},
				},
				i
			) in data"
			class="item"
		>
			<RouterLink
				class="itemIcon"
				:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
			>
				<img
					class="img"
					:src="folder(`${type}/${range_id}/${code}`, '150')"
					alt=""
				/>
			</RouterLink>
			<RouterLink
				:to="{name: 'review', params: {type, range: range_id, story: url, id}}"
				class="side"
			>
				<div class="title">
					<span> {{ title }} ({{ new Date(released).getFullYear() }}) </span>

					<iconify-icon
						v-if="loved"
						style="color: var(--red)"
						icon="ri:heart-3-fill"
					/>

					<iconify-icon
						v-if="rewatch"
						style="color: var(--green)"
						icon="ri:repeat-fill"
					/>

					<span
						class="stars"
						v-if="rating"
					>
						<iconify-icon
							v-for="s in rating"
							style="color: var(--yellow)"
							icon="ri:star-s-fill"
						/>
					</span>
				</div>
				<div class="text">
					{{ text }}
				</div>
				<div class="bot">
					{{ useTime(lang, created) }} &sdot; {{ new Date(created).toLocaleDateString() }}
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
.item {
	display: flex;
	gap: 0.55rem;
	padding: 0.45rem;
}

.item:not(:last-child) {
	border-bottom: 0.01rem #333 solid;
}

.stars {
	display: flex;
}

.side {
	display: flex;
	flex-flow: column;
	gap: 0.35rem;
	justify-content: space-between;
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
	max-width: 4rem;
	outline: 0.001rem solid #555;
	border-radius: 0.05rem;
	transition: 150ms linear all;
}

.img:hover {
	transition: 150ms linear all;
	outline: 0.001rem solid #888;
}
</style>
