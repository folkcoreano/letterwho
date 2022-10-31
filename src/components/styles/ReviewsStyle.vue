<script setup>
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const {
	params: {type, range, story},
} = useRoute();

const user = useUser();

const code = ref("");
const title = ref("");

const {data} = await supabase
	.from("reviews")
	.select(
		`
        id,
        user_id(id,name,user,picture),
        story_id(title,released,code),
        text,
        rating,
        created,
        rewatch,
        loved
        `,
		{count: "exact"}
	)
	.match({story_id: story});

code.value = data[0].story_id.code;
title.value = data[0].story_id.title;

setTitle(title.value);
</script>

<template>
	<div class="layout">
		<div class="story">
			<RouterLink :to="{name: 'story'}">
				<img
					class="image"
					:src="folder(`${type}/${range}/${code}`, '300')"
					:alt="title"
				/>
			</RouterLink>
		</div>
		<div class="reviews">
			<div
				v-for="({id, text, rating, loved, rewatch, created, story_id, user_id}, i) in data"
				class="review"
			>
				<RouterLink
					class="reviewUser"
					:to="{name: 'user', params: {id: user_id.user}}"
				>
					<img
						class="userPicture"
						:src="folder(user_id.picture, '100')"
						:alt="user_id.name"
					/>
				</RouterLink>
				<RouterLink
					:to="{name: 'review', params: {id}}"
					class="reviewSide"
				>
					<div class="reviewTitle">
						<span class="name">{{ user_id.name }}</span>
						<span> &sdot; </span>
						<span class="title"
							>{{ story_id.title }} ({{ new Date(story_id.released).getFullYear() }})</span
						>
						<span class="title"> &sdot; </span>
						<iconify-icon
							class="icon"
							v-if="loved"
							style="color: var(--red)"
							icon="ri:heart-3-fill"
						/>
						<iconify-icon
							class="icon"
							style="color: var(--green)"
							icon="ri:repeat-fill"
							v-if="rewatch"
						/>
						<span
							class="icons"
							v-if="rating"
						>
							<iconify-icon
								class="icon"
								style="color: var(--yellow)"
								icon="ri:star-fill"
								v-for="star in rating"
							/>
						</span>
					</div>
					<div class="reviewText">
						{{ text }}
					</div>
					<div class="reviewDetails">
						{{ useTime(user.lang, created) }}
					</div>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* * {
	outline: 1px dotted rgba(255, 0, 0, 0.404);
} */

.reviewDetails {
	font-weight: bold;
	font-size: 0.85rem;
	color: #bbb;
}

.name {
	font-weight: bold;
}

.title {
	display: none;
	color: #ddd;
}

.story {
	display: none;
}

.image {
	max-width: 12rem;
	position: sticky;
	top: 0;
}

.layout {
	display: flex;
	max-width: 55rem;
	margin: auto;
	gap: 1rem;
}

.reviews {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.review {
	display: flex;
	gap: 0.55rem;
}

.reviewSide {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}

.reviewTitle {
	display: flex;
	gap: 0.35rem;
	align-items: center;
}

.icon {
	display: flex;
	align-items: center;
}

.icons {
	display: flex;
	align-items: center;
}

.userPicture {
	border-radius: 50%;
	max-width: 3.5rem;
}
@media (min-width: 35rem) {
	.title {
		display: unset;
	}
	.story {
		display: flex;
	}
}
</style>
