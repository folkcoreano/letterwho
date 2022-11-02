<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {useStorage} from "@vueuse/core";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	data: Object,
});

const datalist = ref(props.data);

const {
	name,
	params: {type, range},
} = useRoute();

const user = useUser();
const stories = ref([]);

if (type && range) {
	const {data} = await supabase
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
			released: story.released,
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

const view = ref(useStorage("tabs", false));

function changeView() {
	view.value = !view.value;
}
</script>

<template>
	<div class="block">
		<div class="options">
			<iconify-icon
				@click="changeView"
				class="toggle"
				:icon="view ? 'ri:list-check-2' : 'ri:function-fill'"
			/>
			<span class="size">
				{{ datalist.length }}
			</span>
		</div>
		<div
			v-show="view === true"
			class="range"
		>
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
		<div
			v-show="view === false"
			class="rangeComp"
		>
			<RouterLink
				v-for="({title, character, type, released, range, code, url, diary_id}, i) in datalist"
				:key="i"
				class="itemComp"
				:to="{name: 'story', params: {type: type, range: range, story: url}}"
			>
				<img
					class="imageComp"
					:style="'outline: 0.15rem solid ' + checkStatus(diary_id)"
					:src="folder(`${type}/${range}/${code}`, '100')"
					:alt="title"
					loading="lazy"
				/>
				<div class="itemDetails">
					<span class="title">
						<span>{{ title }}({{ new Date(released).getFullYear() }})</span>
						<span>
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
						</span>
					</span>
					<span
						class="char"
						v-if="character"
					>
						<iconify-icon icon="ri:user-3-fill" />
						<span>
							{{ character.name }}
						</span>
					</span>
				</div>
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
* {
	outline: 0 dotted pink;
}

.options {
	display: flex;
	justify-content: space-between;
	padding: 0.25rem;
	align-items: center;
}

.size {
	font-size: 1.25rem;
	font-weight: bold;
}

.toggle {
	font-size: 2rem;
	cursor: pointer;
	padding: 0.15rem;
}
.block {
	max-width: 45rem;
	margin: auto;
}
.char {
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.title {
	display: flex;
	gap: 0.35rem;
	align-items: center;
}

.itemDetails {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
.imageComp {
	max-width: 3.55rem;
}
.itemComp {
	display: flex;
	align-items: center;
	gap: 0.55rem;
	padding: 0.35rem 0.15rem;
}

.itemComp:not(:last-child) {
	border-bottom: 1px solid #444;
}
.rangeComp {
	display: flex;
	flex-flow: column;
}
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
