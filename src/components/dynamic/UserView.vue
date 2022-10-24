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

const tab = shallowRef(Activity);

onMounted(() => {
	supabase
		.from("users")
		.select(
			`
			id,
			name,
			picture,
			diary_id(id,created,watched,saved,liked,rating,review,review_id(id,rating,loved),rewatch,${storyQuery.value}),
			reviews_id(id,created,text,loved,rating,rewatch,${storyQuery.value}),
			likes_id(id,review_id(id,created,user_id(name,picture),text,rating,rewatch,${storyQuery.value}))
			`
		)
		.limit(1)
		.order("id", {foreignTable: "diary_id", ascending: false})
		.order("id", {foreignTable: "reviews_id", ascending: false})
		.order("id", {foreignTable: "likes_id", ascending: false})
		// .limit(10, {foreignTable: "diary_id"})
		// .filter("diary_id.watched", "not.is", null)
		.match({id: id})
		.single()
		.then(res => {
			user.value = res.data;
			diary.value = res.data.diary_id;
			reviews.value = res.data.reviews_id;
			likes.value = res.data.likes_id;
			data.value = diary.value;

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
				<div
					@click="(tab = Activity), (data = diary)"
					class="tab"
					:style="tab === Activity ? 'border-bottom: 2px solid var(--yellow)' : ''"
				>
					{{ lang === "pt-br" ? "Atividade" : "Activity" }}
				</div>
				<div
					@click="(tab = Reviews), (data = reviews)"
					:style="tab === Reviews ? 'border-bottom: 2px solid var(--yellow)' : ''"
					class="tab"
				>
					Reviews
				</div>
				<div
					v-if="false"
					@click="(tab = Likes), (data = likes)"
					:style="tab === Likes ? 'border-bottom: 2px solid var(--yellow)' : ''"
					class="tab"
				>
					Likes
				</div>
			</div>
			<div class="activeTab">
				<transition
					name="route"
					mode="out-in"
				>
					<keep-alive>
						<component
							:data="data"
							:is="tab"
						/>
					</keep-alive>
				</transition>
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
	border-bottom: 2px solid #444;
}

.tab {
	padding: 0.55rem;
	cursor: pointer;
	flex: 1;
	text-align: center;
	transition: all 150ms linear;
	border-bottom: 2px solid transparent;
	translate: 0 2px;
}

.tab:hover {
	transition: all 150ms linear;
	border-bottom: 2px solid #666;
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
