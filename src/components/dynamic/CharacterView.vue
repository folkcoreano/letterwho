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
			quotes(en,pt,story_id(url,title))`
			)
			.match({character_id: id})
			.limit(1)
			.single()
			.then(res => {
				data.value = res.data;
				tabs.value = res.data.character_id.flatMap(e => e.story_id.type);
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

			<div v-if="actTab === 'CHARACTER'">
				<div>
					<img
						class="image"
						:src="folder('p/' + id, '500')"
						alt=""
					/>
				</div>
			</div>

			<div class="items">
				<div
					class="item"
					v-for="({story_id: {title, code, released, range_id, type, url}}, i) in filtered"
					:key="i"
				>
					<RouterLink :to="{name: 'story', params: {type: type, range: range_id, story: url}}">
						<img
							class="img"
							:src="folder(`${type}/${range_id}/${code}`, '250')"
							alt=""
						/>
						<div>{{ title + " (" + new Date(released).getFullYear() + ")" }}</div>
					</RouterLink>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.image {
	max-width: 100%;
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
.items {
	display: grid;
	grid-template-columns: 1fr auto;
}
.item {
	display: flex;
	flex-flow: column;
	width: fit-content;
}

.img {
	max-width: 10rem;
}
</style>
