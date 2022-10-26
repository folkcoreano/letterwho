<script setup>
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import setTitle from "@/stores/title";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";
import Likes from "../user/Likes.vue";
import {useFavicon} from "@vueuse/core";
import Reviews from "../user/Reviews.vue";
import Friends from "../user/Friends.vue";
import Activity from "../user/Activity.vue";
import Comments from "../user/Comments.vue";
import {favicon, folder} from "@/stores/images";
import Settings from "../templates/Settings.vue";
import {ref, onMounted, onUnmounted, shallowRef} from "vue";

const {
	params: {id},
} = useRoute();

const userStore = useUser();

const user = ref();
const data = ref();
const diary = ref();
const reviews = ref();
const likes = ref();
const comments = ref();
const social = ref({
	followers: 0,
	following: 0,
});
const friends = ref();

const isFollowing = ref(false);
const friendStatus = ref("ri:user-add-line");

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
			diary_id(id,created,watched,saved,liked,rating,review,review_id(id,rating,loved),rewatch,${storyQuery.value}),
			reviews_id(id,created,text,loved,rating,rewatch,${storyQuery.value}),
			likes_id(id,review_id(id,created,user_id(name,picture),text,rating,rewatch,${storyQuery.value})),
			follower_id(following_id(id,name,picture)),
			following_id(user_id(id,name,picture))
			`
		)
		.limit(1)
		.order("id", {foreignTable: "diary_id", ascending: false})
		.order("id", {foreignTable: "reviews_id", ascending: false})
		.order("id", {foreignTable: "likes_id", ascending: false})
		.order("id", {foreignTable: "follower_id", ascending: false})
		.order("id", {foreignTable: "following_id", ascending: false})
		.match({id: id})
		.single()
		.then(res => {
			let followers = [];
			let following = [];

			for (const person of res.data.follower_id) {
				following.push({
					id: person.following_id.id,
					name: person.following_id.name,
					picture: person.following_id.picture,
				});
			}

			for (const person of res.data.following_id) {
				followers.push({
					id: person.user_id.id,
					name: person.user_id.name,
					picture: person.user_id.picture,
				});
			}

			friends.value = {following, followers};

			user.value = res.data;
			diary.value = res.data.diary_id;
			reviews.value = res.data.reviews_id;
			likes.value = res.data.likes_id;
			data.value = reviews.value;

			setTitle(res.data.name);
			useFavicon(favicon(res.data.picture, "50"));

			load.value = true;
		});
});
onUnmounted(() => {
	useFavicon("https://ik.imagekit.io/letterwho/tardis.svg");
});

function follow() {
	if (isFollowing.value === false) {
		supabase
			.from("mutuals")
			.insert({
				user_id: userStore.id,
				following_id: id,
				created: new Date().toISOString(),
			})
			.then(res => {
				friendStatus.value = "ri:user-follow-fill";
				isFollowing.value = true;
			});
	} else {
		supabase
			.from("mutuals")
			.delete()
			.match({
				user_id: userStore.id,
				following_id: id,
			})
			.then(res => {
				friendStatus.value = "ri:user-add-line";
				isFollowing.value = false;
			});
	}
}

function checkFollow() {
	if (userStore.id !== id) {
		supabase
			.from("mutuals")
			.select("*", {count: "exact", head: true})
			.match({user_id: userStore.id, following_id: id})
			.then(res => {
				if (res.count) {
					isFollowing.value = true;
					friendStatus.value = "ri:user-follow-fill";
					supabase
						.from("mutuals")
						.select("*", {count: "exact", head: true})
						.match({user_id: id, following_id: userStore.id})
						.then(res => {
							if (res.count) {
								console.log("mutual");
								friendStatus.value = "ri:user-heart-fill";
							} else {
								console.log("not mutual");
							}
						});
				} else {
					isFollowing.value = false;
					friendStatus.value = "ri:user-add-line";
				}
			});
	} else {
		console.log(":p");
	}
}

checkFollow();
</script>

<template>
	<template v-if="load">
		<div class="user">
			<div class="profile">
				<div class="side">
					<img
						:src="folder(user.picture, '200')"
						:alt="user.name"
						class="pic"
					/>
				</div>
				<div class="side">
					<div class="add">
						{{ user.name }}
						<iconify-icon
							v-if="id !== userStore.id"
							@click="follow"
							class="addicon"
							:icon="friendStatus"
						/>
					</div>
					<!-- seguindo {{ social.following }}, {{ social.followers }} seguidores -->
				</div>
			</div>
			<div class="tabs">
				<div
					@click="(data = reviews), (tab = Reviews)"
					:style="tab === Reviews ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'"
					class="tab"
				>
					Reviews
				</div>
				<div
					@click="(data = diary), (tab = Activity)"
					class="tab"
					:style="tab === Activity ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'"
				>
					{{ userStore.lang === "pt-br" ? "Atividade" : "Activity" }}
				</div>
				<div
					v-if="false"
					@click="(data = likes), (tab = Likes)"
					:style="tab === Likes ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'"
					class="tab"
				>
					Likes
				</div>
				<div
					@click="(data = friends), (tab = Friends)"
					:style="tab === Friends ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'"
					class="tab"
				>
					Social
				</div>
				<div
					v-if="userStore.logged && userStore.id === id"
					@click="tab = Settings"
					:style="tab === Settings ? 'border-bottom: 2px solid var(--yellow);flex:0' : 'flex:0'"
					class="tab"
				>
					<iconify-icon icon="ri:settings-3-fill" />
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
.addicon {
	cursor: pointer;
}

.add {
	display: flex;
	gap: 1rem;
	font-size: 1.55rem;
	font-weight: bold;
	align-items: center;
}
.profile {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.pic {
	border-radius: 50%;
	max-width: 5rem;
}
.user {
	max-width: 40rem;
	margin: auto;
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
}

@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}

	.tab {
		text-align: center;
	}
}
</style>
