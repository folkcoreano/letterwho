<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref, onBeforeMount} from "vue";
import {useRoute} from "vue-router";

const {
	params: {type, range},
} = useRoute();

const user = useUser();

const data = ref();
const load = ref(false);
const relationBatch = ref([]);

function addChar() {
	for (const ep of data.value.range_id) {
		relationBatch.value.push({
			crew_id: "peter-capaldi",
			story_id: ep.code,
			character_id: "twelfth-doctor",
			role: "Doctor",
			type: "CHARACTER",
		});
	}

	supabase
		.from("relation")
		.insert(relationBatch.value)
		.then(res => {
			console.log(res);
		});
}

onBeforeMount(() => {
	supabase
		.from("ranges")
		.select("title,range_id(title,released,url,code,diary_id(watched,saved))")
		.order("released", {foreignTable: "range_id", ascending: true})
		.match({type: type, range: range})
		.filter("range_id.diary_id.user_id", "eq", user.id)
		.order("id", {foreignTable: "range_id.diary_id", ascending: true})
		.limit(1, {foreignTable: "range_id.diary_id"})
		.limit(1)
		.single()
		.then(res => {
			console.log(res.data);
			if (res.data) {
				data.value = res.data;
				setTitle(res.data.title);
			}
			load.value = true;
		});
});

function checkStatus(array) {
	if (array.length > 0) {
		const arr = array.find(e => !e.rewatch && !e.review);

		if (arr.saved && arr.watched) {
			return "both";
		}

		if (arr.watched) {
			return "watched";
		}

		if (arr.saved) {
			return "saved";
		}
	}
	return "nah";
}
</script>

<template>
	<template v-if="load">
		<div>
			<!-- <button @click="addChar">add</button> -->
			<div class="range">
				<RouterLink
					v-for="({title, code, url, diary_id}, i) in data.range_id"
					:key="i"
					class="item"
					:to="{name: 'story', params: {type, range, story: url}}"
				>
					<img
						class="image"
						:style="'outline: 0.15rem solid ' + checkStatus(diary_id)"
						:src="folder(`${type}/${range}/${code}`, '400')"
						:alt="title"
					/>
					<div class="status">
						<iconify-icon
							class="watch"
							v-if="checkStatus(diary_id) === 'watched' || checkStatus(diary_id) === 'both'"
							style="color: var(--blue); font-size: 2rem"
							icon="ri:bookmark-3-fill"
						/>
						<iconify-icon
							class="saved"
							v-if="checkStatus(diary_id) === 'saved' || checkStatus(diary_id) === 'both'"
							style="color: var(--green); font-size: 2rem"
							icon="ri:bookmark-2-fill"
						/>
					</div>
				</RouterLink>
			</div>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.item {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-columns: 1fr;
}

.status {
	grid-row: 1;
	grid-column: 1;
	place-self: start end;
	margin: -0.25rem -0.15rem;
}

.range {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-template-rows: 1fr;
	gap: 0.75rem;
	max-width: 45rem;
	margin: auto;
}
.image {
	grid-column: 1;
	grid-row: 1;

	max-width: 100%;
	outline: 0.001rem #2f2f2f solid;
	border-radius: 0.15rem;
	transition: all 150ms linear;
}

.image:hover {
	transition: all 150ms linear;
	outline: 0.001rem #3f3f3f solid;
}
</style>
