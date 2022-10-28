<script setup>
import Reviews from "@/components/user/Reviews.vue";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {onBeforeMount, ref} from "vue";
import {onBeforeRouteLeave} from "vue-router";
setTitle("Home");

const user = useUser();
const feed = ref();
const reviews = ref([]);
const load = ref(false);

function getFeed() {
	supabase
		.from("mutuals")
		.select(
			`
		following_id(id,name,picture,
		reviews_id(id,text,rating,created,rewatch,loved,
		story_id(type,code,title,url,released,range_id),
		likes_id(count)))
		`
		)
		.match({user_id: user.id})
		.limit(1, {foreignTable: "following_id.reviews_id"})
		.order("id", {foreignTable: "following_id.reviews_id", ascending: false})
		.then(res => {
			feed.value = res.data;
			for (const rev of res.data) {
				if (rev.following_id.reviews_id.length > 0) {
					for (const review of rev.following_id.reviews_id) {
						reviews.value.push(review);
					}
				}
			}
			load.value = true;
		});
}

onBeforeMount(() => {
	if (user.logged) {
		getFeed();
	}
});
</script>

<template>
	<div>
		<!-- <pre>{{ feed }}</pre> -->
		<Reviews
			v-if="load"
			:data="reviews"
		/>
		<div v-else>logai</div>
		<!-- <RouterLink :to="{name: 'register'}">Login</RouterLink>
		<br />
		<RouterLink :to="{name: 'persons'}">Pessoas</RouterLink>
		<br />
		<RouterLink :to="{name: 'users'}">Users</RouterLink>
		<br />
		<RouterLink :to="{name: 'characters'}">Personagens</RouterLink>
		<br />
		<RouterLink :to="{name: 'quotes'}">Citações</RouterLink>
		<br />
		<RouterLink :to="{name: 'stories'}">Histórias</RouterLink>
		<br /> -->
	</div>
</template>
