<script setup>
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";

const user = useUser();

const props = defineProps({
	data: Object,
});
</script>

<template>
	<div class="comments">
		<RouterLink
			:to="{name: 'review', params: {type: type, range: range_id, story: url, id: id}}"
			v-for="(
				{
					comment,
					created,
					review_id: {
						id,
						user_id,
						story_id: {type, range_id, url},
					},
				},
				i
			) in data"
			:key="i"
			class="comment"
		>
			<div class="side">
				<img
					class="img"
					:src="folder(user_id.picture, '150')"
					:alt="user_id.name"
				/>
			</div>
			<div class="other">
				<div>{{ user_id.name }}</div>
				<div>
					{{ comment }}
				</div>
				<div>
					{{ useTime(user.lang, created) }}
				</div>
			</div>
		</RouterLink>
	</div>
</template>

<style scoped>
.comments {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.other {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}

.comment {
	display: flex;
	gap: 0.5rem;
}

.img {
	max-width: 3rem;
	border-radius: 50%;
}
</style>
