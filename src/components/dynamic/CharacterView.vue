<script setup>
import {folder} from "@/stores/images";
import setTitle from "@/stores/title";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const {
	params: {id},
} = useRoute();

const data = ref();
const load = ref(false);
const tabs = ref([]);
const actTab = ref("CHARACTER");

const filtered = ref([]);

const getData = () => {
	try {
		supabase
			.from("characters")
			.select(
				`*,
			character_id(story_id(title,code,released,range_id,type,url)),
			quotes(id,pt,en,story_id(title,code,url,type,range_id))`
			)
			.match({character_id: id})
			.limit(1)
			.single()
			.then(res => {
				data.value = res.data;

				let alltabs = res.data.character_id.flatMap(e => e.story_id.type);

				const filteredtabs = [...new Set(alltabs)];

				tabs.value = filteredtabs;

				setTitle(res.data.name);

				load.value = true;
			});
	} catch (error) {
		console.log(error);
	}
};

getData();

const select = tab => {
	actTab.value = tab;
	filtered.value = data.value.character_id.filter(e => e.story_id.type === tab);
};

function size(tab) {
	return data.value.character_id.filter(e => e.story_id.type === tab).length;
}
</script>

<template>
	<template v-if="load">
		<div class="char">
			<div class="tabs">
				<div
					@click="select('CHARACTER')"
					:class="actTab === 'CHARACTER' ? 'tab active' : 'tab'"
				>
					{{ "CHARACTER" }}
				</div>
				<div
					@click="select(tab)"
					:class="actTab === tab ? 'tab active' : 'tab'"
					v-for="tab in tabs"
				>
					{{ tab.toUpperCase() }}: {{ size(tab) }}
				</div>
			</div>

			<div
				class="character"
				v-if="actTab === 'CHARACTER'"
			>
				<div>
					<img
						class="image"
						:src="folder('p/' + id, '500')"
						alt=""
					/>
				</div>
				<div class="quotes">
					<div
						class="quote"
						:key="id"
						v-for="({id, pt, en, story_id: {title, url, type, range_id}}, i) in data.quotes"
					>
						<q>{{ pt }}</q>
						<br />
						<q>{{ en }}</q>
						<br />
						<router-link
							class="auth"
							:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
							>{{ title }}</router-link
						>
					</div>
				</div>
			</div>

			<div
				v-if="actTab !== 'CHARACTER'"
				class="items"
			>
				<RouterLink
					class="item"
					v-for="({story_id: {title, code, released, range_id, type, url}}, i) in filtered"
					:key="i"
					:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
				>
					<img
						class="img"
						:src="folder(`${type}/${range_id}/${code}`, '250')"
						alt=""
					/>
					<div>{{ title + " (" + new Date(released).getFullYear() + ")" }}</div>
				</RouterLink>
			</div>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.items {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
.item {
	display: flex;
	flex-flow: column;
	width: fit-content;
	max-width: 10rem;
}
.img {
	max-width: 100%;
}
.character {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
.quotes {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.quote {
	color: #eee;
	font-weight: bold;
}

.auth {
	color: #aaa;
	font-weight: normal;
}
.image {
	max-width: 100%;
	width: 20rem;
}
.char {
	display: flex;
	flex-flow: column;
	max-width: 50rem;
	margin: auto;
	gap: 0.35rem;
}

.tabs {
	display: flex;
	flex: 1;
}

.tab {
	flex: 1;
	padding: 0.35rem;
	background-color: #0f0f0f;
	text-align: center;
	transition: all 150ms linear;
	cursor: pointer;
}

.tab:hover {
	background-color: #1f1f1f;
}

.active {
	background-color: #1f1f1f;
}
</style>
