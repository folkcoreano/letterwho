<script setup>
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import setTitle from "@/stores/title";
import {favicon, folder} from "@/stores/images";
import {ref, onMounted, onUnmounted} from "vue";
import {useFavicon} from "@vueuse/core";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";

const {
	params: {id},
} = useRoute();

const {lang} = useUser();

const user = ref();
const diary = ref();

const load = ref(false);

onMounted(() => {
	supabase
		.from("users")
		.select(
			"id,name,picture,diary_id(created,review,rewatch,story_id(title, type,range_id,url,released,code))"
		)
		.limit(1)
		.order("created", {foreignTable: "diary_id", ascending: false})
		.match({id: id})
		.single()
		.then(res => {
			user.value = res.data;
			diary.value = res.data.diary_id.filter(e => e.review === true || e.rewatch === true);

			setTitle(res.data.name);
			useFavicon(favicon(res.data.picture, "50"));
		});
});
onUnmounted(() => {
	useFavicon("https://ik.imagekit.io/letterwho/tardis.svg");
});
</script>

<template>
	<div class="user">
		<div class="diary">
			<div
				:key="i"
				v-for="(
					{created, review, rewatch, story_id: {title, range_id, url, type, code, released}}, i
				) in diary"
				class="item"
			>
				<div
					v-if="review"
					class="itemIcon"
				>
					<img
						:src="folder(`${type}/${range_id}/${code}`, '100')"
						alt=""
					/>
				</div>
				<div v-if="review">
					<RouterLink :to="{name: 'story', params: {type: type, range: range_id, story: url}}">
						{{ title }} {{ useTime(lang, created) }}
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.user {
	max-width: 40rem;
	margin: auto;
}

.diary {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
}

.item {
	display: flex;
	gap: 1rem;
	border-top: 1px solid #444;
	padding: 0.45rem;
}
</style>
