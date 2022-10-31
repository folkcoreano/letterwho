<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	data: Object,
});

const datalist = ref(props.data);

const {
	params: {type, range},
} = useRoute();

const user = useUser();
const stories = ref([]);

if (type && range) {
	const {data, error} = await supabase
		.from("ranges")
		.select("title,range_id(title,code,released,range_id,type,url,diary_id(watched,saved))")
		.limit(1, {foreignTable: "range_id.diary_id"})
		.order("released", {foreignTable: "range_id", ascending: true})
		.order("id", {foreignTable: "range_id.diary_id", ascending: true})
		.filter("range_id.diary_id.user_id", "eq", user.id)
		.order("id", {foreignTable: "range_id.diary_id", ascending: true})
		.limit(1)
		.single()
		.match({type: type, range: range});

	for (const story of data.range_id) {
		stories.value.push({
			title: story.title,
			type: story.type,
			range: story.range_id,
			code: story.code,
			url: story.url,
			diary_id: story.diary_id,
		});
	}

	datalist.value = stories.value;

	setTitle(data.title);
}

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
	<div class="range">
		<RouterLink
			v-for="({title, character, type, range, code, url, diary_id}, i) in datalist"
			:key="i"
			class="item"
			:to="{name: 'story', params: {type: type, range: range, story: url}}"
		>
			<img
				class="image"
				:style="'outline: 0.15rem solid ' + checkStatus(diary_id)"
				:src="folder(`${type}/${range}/${code}`, '400')"
				:alt="title"
				loading="lazy"
			/>
			<div class="status">
				<iconify-icon
					v-if="checkStatus(diary_id) === 'watched' || checkStatus(diary_id) === 'both'"
					style="color: var(--blue)"
					icon="ri:bookmark-3-fill"
				/>
				<iconify-icon
					v-if="checkStatus(diary_id) === 'saved' || checkStatus(diary_id) === 'both'"
					style="color: var(--green)"
					icon="ri:bookmark-2-fill"
				/>
			</div>
			{{ character ? character.name : "" }}
		</RouterLink>
	</div>
</template>

<style scoped>
.item {
	display: grid;
	grid-template-columns: 1fr;
}
.status {
	font-size: 1.45rem;
	grid-row: 1;
	grid-column: 1;
	place-self: start end;
	margin: -0.25rem -0.05rem;
}
.range {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: 1fr;
	gap: 0.35rem;
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
@media (min-width: 35rem) {
	.range {
		grid-template-columns: repeat(4, 1fr);
	}
	.status {
		font-size: 2rem;
		grid-row: 1;
		grid-column: 1;
		place-self: start end;
		margin: -0.35rem -0.15rem;
	}
}
</style>
