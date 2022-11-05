<script setup>
import {folder, homeFolder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref, watchEffect} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	data: Object,
	context: String,
});

const datalist = ref([]);

datalist.value = props.data;

const user = useUser();

const {name} = useRoute();

const reviews = ref([]);

watchEffect(async () => {
	if (props.context === "home" && user.logged) {
		const {data} = await supabase
			.from("mutuals")
			.select(
				`
		following_id(id,name,picture,
		reviews_id(id,text,rating,user_id(id,name,picture,user),created,rewatch,loved,
		story_id(type,code,title,url,released,range_id),
		likes_id(count)))
		`
			)
			.match({user_id: user.id})
			.limit(1, {foreignTable: "following_id.reviews_id"})
			.order("id", {foreignTable: "following_id.reviews_id", ascending: false});

		for (const rev of data) {
			if (rev.following_id.reviews_id.length > 0) {
				for (const review of rev.following_id.reviews_id) {
					reviews.value.push(review);
				}
			}
		}

		datalist.value = reviews.value;
	}

	if (props.context === "last" && user.logged) {
		const {data} = await supabase
			.from("reviews")
			.select(
				`
		id,text,rating,user_id(id,name,picture,user),created,rewatch,loved,story_id(type,code,title,url,released,range_id),likes_id(count)
		`
			)
			.limit(5)
			.order("id", {ascending: false});

		datalist.value = data;
	}
});
</script>

<template>
	<div class="reviews">
		<div
			:key="i"
			v-for="({id, text, rating, loved, rewatch, created, story_id, user_id}, i) in datalist"
			class="review"
		>
			<div>
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
			</div>
			<RouterLink
				:to="{
					name: 'review',
					params: {type: story_id.type, range: story_id.range_id, story: story_id.url, id: id},
				}"
				class="reviewSide"
			>
				<div class="titleTop">
					<div class="name">{{ user_id.name }}</div>

					<div class="title">
						{{ story_id.title }} ({{ new Date(story_id.released).getFullYear() }})
					</div>
					<div class="titleIcons">
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
						/><span
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
				</div>
				<div
					v-if="name !== 'reviews'"
					class="reviewStory"
				>
					<img
						class="reviewStoryPicture"
						:src="folder(`${story_id.type}/${story_id.range_id}/${story_id.code}`, '500')"
						:alt="story_id.title"
					/>
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
</template>

<style scoped>
* {
	transition: all 150ms linear;
}

.reviewStoryPicture {
	width: 100%;
	max-width: 25rem;
	outline: 0.001rem #333 solid;
	border-radius: 0.15rem;
}
.reviewText {
	padding: 0.55rem 0;
	font-size: 0.95rem;
}
.titleIcons {
	display: flex;
	align-items: center;
	gap: 0.25rem;
}
.titleTop {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}
.reviewDetails {
	font-weight: bold;
	font-size: 0.85rem;
	color: #bbb;
}
.name {
	font-weight: bold;
}
.title {
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
	flex: 1;
	padding: 0.55rem 0;
}
.review {
	display: flex;
	gap: 0.55rem;
}
.reviewSide {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
	flex: 1;
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
	position: sticky;
	top: 0;
	/* border-radius: 0.15rem; */
	border-radius: 0.45rem;
	max-width: 3.55rem;
	outline: 0.001rem solid #333;
}

.storyPicture {
	border-radius: 0.05rem;
	max-width: 4.55rem;
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
