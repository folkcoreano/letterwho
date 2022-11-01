<script setup>
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";
import ReviewList from "../templates/ReviewList.vue";

const {
	params: {type, range, story},
} = useRoute();

const user = useUser();

const code = ref("");
const title = ref("");

const datalist = ref([]);
const compKey = ref(0);
const reviewsList = ref("all");

const allData = ref([]);
const userData = ref([]);
const friendsData = ref([]);

const {data} = await supabase
	.from("reviews")
	.select(
		`
        id,
        user_id(id,name,user,picture),
        story_id(title,released,code,url,range_id,type),
        text,
        rating,
        created,
        rewatch,
        loved
        `
	)
	.order("id", {ascending: false})
	.match({story_id: story});

allData.value = data;
datalist.value = data;

if (data.length > 0) {
	code.value = data[0].story_id.code;
	title.value = data[0].story_id.title;

	setTitle(title.value);
}

async function filterReviews(query) {
	if (query === "user" && reviewsList.value !== "user" && userData.value.length < 1) {
		console.log("req");
		const {data} = await supabase
			.from("reviews")
			.select(
				`id,
			user_id(id,name,user,picture),
			        story_id(title,released,code,url,range_id,type),

				text,
				rating,
				created,
				rewatch,
				loved
				`
			)
			.order("id", {ascending: false})
			.match({
				user_id: user.id,
				story_id: story,
			});

		userData.value = data;
		datalist.value = userData.value;
		compKey.value += 1;
	}

	if (query === "friends" && reviewsList.value !== "friends" && friendsData.value.length < 1) {
		console.log("req");
		const {data} = await supabase
			.from("reviews")
			.select(
				`
			id,
			user_id(id,name,user,picture,following_id(*)),
			        story_id(title,released,code,url,range_id,type),

			text,
			rating,
			created,
			rewatch,
			loved
			`
			)
			.filter("user_id.following_id.user_id", "eq", user.id)
			.order("id", {ascending: false})
			.match({story_id: story});

		const filtered = ref([]);

		for (const rv of data) {
			if (rv.user_id.following_id.length) {
				filtered.value.push(rv);
			}
		}

		friendsData.value = filtered.value;
		datalist.value = friendsData.value;
		compKey.value += 1;
	}

	if (query === "user" && reviewsList.value !== "user" && userData.value.length) {
		datalist.value = userData.value;
		compKey.value += 1;
	}

	if (query === "friends" && reviewsList.value !== "friends" && friendsData.value.length) {
		datalist.value = friendsData.value;
		compKey.value += 1;
	}

	if (query === "all" && reviewsList.value !== "all" && allData.value.length) {
		datalist.value = allData.value;
		compKey.value += 1;
	}

	reviewsList.value = query;
}
</script>

<template>
	<div class="layout">
		<div class="tabs">
			<div
				@click="filterReviews('all')"
				:class="reviewsList === 'all' ? 'tab activeTab' : 'tab'"
			>
				REVIEWS
			</div>
			<div
				@click="filterReviews('user')"
				:class="reviewsList === 'user' ? 'tab activeTab' : 'tab'"
			>
				{{ user.lang === "pt-br" ? "SUAS" : "YOURS" }}
			</div>
			<div
				@click="filterReviews('friends')"
				:class="reviewsList === 'friends' ? 'tab activeTab' : 'tab'"
			>
				{{ user.lang === "pt-br" ? "AMIGOS" : "FRIENDS" }}
			</div>
		</div>
		<div class="content">
			<Transition
				name="comp"
				mode="out-in"
			>
				<KeepAlive>
					<Suspense>
						<ReviewList
							:key="compKey"
							:data="datalist"
						/>
					</Suspense>
				</KeepAlive>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.layout {
	max-width: 35rem;
	margin: auto;
}
.tabs {
	overflow: unset;
	padding: unset;
	width: auto;
}
.tab {
	text-align: center;
	flex: 1;
}
</style>
