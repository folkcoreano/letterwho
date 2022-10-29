<script setup>
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "@vue/reactivity";
import {useRoute} from "vue-router";

const {
	params: {type, range, story},
} = useRoute();

const user = useUser();

const datas = ref();

const load = ref(false);

async function getReviews() {
	let data = [];

	let item;
	supabase
		.from("reviews")
		.select("*,story_id(title,url,released),user_id(user,name,picture,id)")
		.match({story_id: story})
		.then(res => {
			datas.value = res.data;
			load.value = true;
		});
}

getReviews();
</script>

<template>
	<template v-if="load">
		<div class="reviews">
			<div
				v-for="(
					{id, user_id, story_id: {title, released}, text, rating, created, rewatch}, i
				) in datas"
				:key="i"
				class="review"
			>
				<div class="icon">
					<RouterLink :to="{name: 'user', params: {id: user_id.user}}">
						<img
							class="reviewIcon"
							:src="folder(user_id.picture, '50')"
							:alt="user_id.name"
						/>
					</RouterLink>
				</div>
				<div class="rev">
					<div class="top">
						<span> {{ user_id.name }} </span> -
						<span> {{ title }} ({{ new Date(released).getFullYear() }}) </span>
						<span
							><iconify-icon
								icon="ri:star-fill"
								style="color: var(--yellow)"
								v-for="a in rating"
						/></span>
						<iconify-icon
							v-if="rewatch"
							icon="ri:repeat-fill"
							style="color: var(--green)"
						/>
					</div>
					<div class="mid">
						<RouterLink :to="{name: 'review', params: {id: id}}">
							{{ text }}
						</RouterLink>
					</div>
					<div class="bot">
						{{ useTime(user.lang, created) }}
					</div>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>

<style scoped>
.reviews {
	display: flex;
	flex-flow: column;
	gap: 0.25rem;
	max-width: 50rem;
	margin: auto;
}

.review {
	display: flex;
	flex-flow: row;
	gap: 1rem;
	padding: 0.55rem;
	border-bottom: 1px solid #333;
}

.reviewIcon {
	max-width: 100%;
	border-radius: 50%;
}

.rev {
	display: flex;
	justify-content: flex-start;
	flex-flow: column;
	gap: 0.25rem;
}

.icon {
	min-width: 3rem;
}

.top {
	display: flex;
	gap: 0.35rem;
	align-items: center;
}

.mid {
	color: #ddd;
	font-weight: bold;
}

.bot {
	color: #aaa;
}
</style>
