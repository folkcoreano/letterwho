<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const {
	params: {id},
	query: {tab},
} = useRoute();

const {push, back} = useRouter();

const data = ref();
const tabs = ref();
const actTab = ref();
const load = ref(false);

const filtered = ref();

try {
	supabase
		.from("crew")
		.select(
			"*,name,crew_id(character_id(name),role,story_id(title,released,code,range_id,type,url))"
		)
		.match({crew_id: id})
		.limit(1)
		.single()
		.then(res => {
			if (res.data) {
				data.value = res.data;

				let alltabs = res.data.crew_id.flatMap(e => e.role);

				const filteredtabs = [...new Set(alltabs)];

				tabs.value = filteredtabs;

				if (tab) {
					select(tab);
				} else {
					select(tabs.value[0]);
				}

				setTitle(res.data.name);

				load.value = true;
			} else {
				back();
			}
		})
		.catch(e => {
			console.log(e);
		});
} catch (e) {
	console.log(e);
}

function select(tabs) {
	actTab.value = tabs;
	filtered.value = data.value.crew_id.filter(e => e.role === tabs);
}

function size(tab) {
	return data.value.crew_id.filter(e => e.role === tab).length;
}
</script>

<template>
	<template v-if="load">
		<div class="items">
			<div class="tabs">
				<div
					@click="select(tab)"
					v-for="tab in tabs"
					:class="tab === actTab ? 'tab active' : 'tab'"
				>
					{{ tab }}: {{ size(tab) }}
				</div>
			</div>

			<div class="list">
				<RouterLink
					class="item"
					v-for="(
						{role, character_id, story_id: {title, code, range_id, type, url, released}}, i
					) in filtered"
					:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
				>
					<img
						class="poster"
						:src="folder(`${type}/${range_id}/${code}`, '200')"
						:alt="title"
					/>
					<div>{{ title }}</div>
					<div v-if="character_id">{{ character_id.name }}</div>
				</RouterLink>
			</div>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.poster {
	max-width: 10rem;
}
.tabs {
	display: flex;
	transition: all 150ms linear;
}
.tab {
	flex: 1;
	padding: 0.35rem;
	background-color: #0f0f0f;
	text-align: center;
	cursor: pointer;
	transition: all 150ms linear;
}

.tab:hover {
	background-color: #1f1f1f;
}

.active {
	background-color: #1f1f1f;
}
.items {
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	max-width: 50rem;
	margin: auto;
}

.list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
.item {
	gap: 0.25rem;
	display: flex;
	flex-flow: column;
}

.img {
	max-width: 10rem;
}
</style>
