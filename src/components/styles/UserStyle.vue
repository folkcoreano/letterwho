<script setup>
import {favicon, folder} from "@/stores/images";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {useFavicon} from "@vueuse/core";
import {ref, shallowRef, onBeforeUnmount, onBeforeMount} from "vue";
import ReviewList from "../templates/ReviewList.vue";
import StoriesList from "../templates/StoriesList.vue";
import Activity from "../user/Activity.vue";
import Friends from "../user/Friends.vue";
import Likes from "../user/Likes.vue";
import Settings from "../user/Settings.vue";

const props = defineProps({
	id: String,
});

const userStore = useUser();
const username = ref(props.id);
const id = ref("");

const user = ref();
const data = ref();
const diary = ref();
const reviews = ref();
const likes = ref();
const friends = ref();
const isFollowing = ref(false);
const friendStatus = ref("ri:user-add-line");
const storyQuery = ref("story_id(title,type,range_id,url,released,code)");
const load = ref(false);
const tab = shallowRef(ReviewList);
const found = ref(false);

onBeforeMount(() => {
	supabase
		.from("users")
		.select(
			`
			id,
			name,
			user,
			picture,
			diary_id(id,created,watched,saved,liked,rating,review,review_id(id,rating,loved),rewatch,${storyQuery.value}),
			reviews_id(id,created,text,loved,rating,user_id(id,name,picture,user),rewatch,${storyQuery.value}),
			likes_id(id,review_id(id,created,user_id(name,user,picture),text,rating,rewatch,${storyQuery.value})),
			follower_id(following_id(id,user,name,picture)),
			following_id(user_id(id,name,user,picture))
			`
		)
		.limit(1)
		.order("id", {foreignTable: "diary_id", ascending: false})
		.order("id", {foreignTable: "reviews_id", ascending: false})
		.order("id", {foreignTable: "likes_id", ascending: false})
		.order("id", {foreignTable: "follower_id", ascending: false})
		.order("id", {foreignTable: "following_id", ascending: false})
		.match({user: username.value})
		.single()
		.then(res => {
			if (res.data) {
				found.value = true;

				id.value = res.data.id;
				checkFollow();
				let raw_followers = [];
				let raw_following = [];
				let mutuals = [];
				let following = [];
				let followers = [];

				for (const person of res.data.follower_id) {
					raw_following.push({
						id: person.following_id.id,
						user: person.following_id.user,
						name: person.following_id.name,
						picture: person.following_id.picture,
					});
				}

				for (const person of res.data.following_id) {
					raw_followers.push({
						id: person.user_id.id,
						user: person.user_id.user,
						name: person.user_id.name,
						picture: person.user_id.picture,
					});
				}

				for (const person of raw_following) {
					if (raw_followers.some(e => e.id === person.id)) {
						mutuals.push(person);
					}
				}

				for (const person of raw_following) {
					if (mutuals.some(e => e.id === person.id)) {
					} else {
						following.push(person);
					}
				}

				for (const person of raw_followers) {
					if (mutuals.some(e => e.id === person.id)) {
					} else {
						followers.push(person);
					}
				}

				friends.value = {following, followers, mutuals};

				user.value = res.data;
				diary.value = res.data.diary_id;
				reviews.value = res.data.reviews_id;
				likes.value = res.data.likes_id;
				data.value = reviews.value;

				setTitle(res.data.name);
				useFavicon(favicon(res.data.picture, "50"));

				load.value = true;
			} else {
				found.value = false;
				load.value = true;
			}
		});
});

function follow() {
	if (isFollowing.value === false) {
		supabase
			.from("mutuals")
			.insert({
				user_id: userStore.id,
				following_id: id.value,
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
				following_id: id.value,
			})
			.then(res => {
				friendStatus.value = "ri:user-add-line";
				isFollowing.value = false;
			});
	}
}

function checkFollow() {
	if (userStore.id !== id.value) {
		supabase
			.from("mutuals")
			.select("*", {count: "exact", head: true})
			.match({user_id: userStore.id, following_id: id.value})
			.then(res => {
				if (res.count) {
					isFollowing.value = true;
					friendStatus.value = "ri:user-follow-fill";
					supabase
						.from("mutuals")
						.select("*", {count: "exact", head: true})
						.match({user_id: id.value, following_id: userStore.id})
						.then(res => {
							if (res.count) {
								// console.log("mutual");
								friendStatus.value = "ri:user-heart-fill";
							} else {
								// console.log("not mutual");
							}
						});
				} else {
					isFollowing.value = false;
					friendStatus.value = "ri:user-add-line";
				}
			});
	}
}

onBeforeUnmount(() => {
	useFavicon("https://ik.imagekit.io/letterwho/tardis.svg");
});

function storiesTab() {
	supabase
		.from("diary")
		.select(`watched,story_id(title,code,released,range_id,type,url,diary_id(watched))`)
		.not("watched", "is", null)
		.is("review", false)
		.limit(1, {foreignTable: "story_id.diary_id"})
		.order("id", {foreignTable: "story_id.diary_id", ascending: true})
		.filter("story_id.diary_id.user_id", "eq", userStore.id)
		.match({user_id: id.value})
		.then(res => {
			data.value = res.data;
			tab.value = StoriesList;
		});
}
</script>

<template>
	<template v-if="load">
		<div>
			<template v-if="found">
				<div class="user">
					<div
						v-if="userStore.id !== id"
						class="profile"
					>
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
									@click="follow"
									class="addicon"
									:icon="friendStatus"
								/>
							</div>
						</div>
					</div>
					<div
						v-else
						class="profile"
					>
						<div class="side">
							<img
								:src="folder(userStore.picture, '200')"
								:alt="userStore.name"
								class="pic"
							/>
						</div>
						<div class="side">
							<div class="add">
								{{ userStore.name }}
							</div>
						</div>
					</div>
					<div class="tabs">
						<div
							@click="(data = reviews), (tab = ReviewList)"
							:style="
								tab === ReviewList ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'
							"
							class="tab"
						>
							Reviews
						</div>
						<div
							@click="(data = diary), (tab = Activity)"
							class="tab"
							:style="
								tab === Activity ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'
							"
						>
							{{ userStore.lang === "pt-br" ? "Atividade" : "Activity" }}
						</div>
						<div
							@click="storiesTab"
							class="tab"
							:style="
								tab === StoriesList ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'
							"
						>
							{{ userStore.lang === "pt-br" ? "Histórias" : "Stories" }}
						</div>
						<div
							v-if="false"
							@click="(data = likes), (tab = Likes)"
							:style="
								tab === Likes ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'
							"
							class="tab"
						>
							Likes
						</div>
						<div
							@click="(data = friends), (tab = Friends)"
							:style="
								tab === Friends ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'
							"
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
					<div class="content">
						<Transition
							name="comp"
							mode="out-in"
						>
							<KeepAlive>
								<Suspense>
									<Component
										:data="data"
										:is="tab"
								/></Suspense>
							</KeepAlive>
						</Transition>
					</div>
				</div>
			</template>
			<template v-else>
				<h1>User not found :/</h1>
			</template>
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
