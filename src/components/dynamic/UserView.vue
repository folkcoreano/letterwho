<script setup>
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import setTitle from "@/stores/title";
import {favicon, folder} from "@/stores/images";
import {ref, onMounted, onUnmounted, shallowRef} from "vue";
import {useFavicon} from "@vueuse/core";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";
import Activity from "../user/Activity.vue";
import Reviews from "../user/Reviews.vue";
import Likes from "../user/Likes.vue";
import Comments from "../user/Comments.vue";

const {
	params: {id},
} = useRoute();

const {lang} = useUser();

const user = ref();
const data = ref();
const diary = ref();
const reviews = ref();
const likes = ref();
const comments = ref();

const storyQuery = ref("story_id(title, type,range_id,url,released,code)");

const load = ref(false);

const tab = shallowRef(Reviews);

onMounted(() => {
	supabase
		.from("users")
		.select(
			`
		id,
		name,
		picture,
		diary_id(id,created,review,rewatch,${storyQuery.value}),
		reviews_id(id,created,text,rating,rewatch,${storyQuery.value}),
		likes_id(id,review_id(id,created,user_id(name,picture),text,rating,rewatch,${storyQuery.value})),
		comments_id(id,comment,created,review_id(id,user_id(id,picture,name),${storyQuery.value}))
		`
		)
		.limit(1)
		.order("id", {foreignTable: "diary_id", ascending: false})
		.order("id", {foreignTable: "reviews_id", ascending: false})
		.order("id", {foreignTable: "likes_id", ascending: false})
		.order("id", {foreignTable: "comments_id", ascending: false})
		.match({id: id})
		.single()
		.then(res => {
			user.value = res.data;
			diary.value = res.data.diary_id.filter(e => e.review === true || e.rewatch === true);
			reviews.value = res.data.reviews_id;
			likes.value = res.data.likes_id;
			comments.value = res.data.comments_id;
			data.value = reviews.value;

			load.value = true;

			setTitle(res.data.name);
			useFavicon(favicon(res.data.picture, "50"));
		});
});
onUnmounted(() => {
	useFavicon("https://ik.imagekit.io/letterwho/tardis.svg");
});
</script>

<template>
	<template v-if="load">
		<div class="user">
			<div class="profile">
				<div class="side">
					<img
						:src="folder(user.picture, '150')"
						:alt="user.name"
						class="pic"
					/>
				</div>
				<div class="side">
					<h1>{{ user.name }}</h1>
				</div>
			</div>
			<div class="tabs">
				<!-- <div
					@click="(tab = Activity), (data = diary)"
					class="tab"
				>
					ACTIVITY
				</div> -->
				<div
					@click="(tab = Reviews), (data = reviews)"
					:style="tab === Reviews ? 'background-color: #1f1f1f' : ''"
					class="tab"
				>
					REVIEWS
				</div>
				<div
					@click="(tab = Comments), (data = comments)"
					:style="tab === Comments ? 'background-color: #1f1f1f' : ''"
					class="tab"
				>
					COMMENTS
				</div>
				<div
					@click="(tab = Likes), (data = likes)"
					:style="tab === Likes ? 'background-color: #1f1f1f' : ''"
					class="tab"
				>
					LIKES
				</div>
			</div>
			<div class="activeTab">
				<keep-alive>
					<component
						:data="data"
						:is="tab"
					/>
				</keep-alive>
			</div>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.tabs {
	display: flex;
}

.tab {
	flex: 1;
	padding: 0.25rem;
	background-color: #0f0f0f;
	text-align: center;
	transition: all 150ms linear;
	cursor: pointer;
}

.tab:hover {
	transition: all 150ms linear;
	background-color: #1f1f1f;
}
.profile {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.pic {
	border-radius: 50%;
}
.user {
	max-width: 40rem;
	margin: auto;
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
}
</style>
