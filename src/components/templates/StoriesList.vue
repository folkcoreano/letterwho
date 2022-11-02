<script setup>
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";
import {ref} from "vue";
import {useRoute} from "vue-router";
import StoriesListType from "./StoriesListType.vue";

const props = defineProps({
	data: Object,
});

const {name} = useRoute();

const user = useUser();

const stories = ref([]);

for (const story of props.data) {
	stories.value.push({
		title: story.story_id.title,
		type: story.story_id.type,
		range: story.story_id.range_id,
		code: story.story_id.code,
		released: story.story_id.released,
		url: story.story_id.url,
		diary_id: story.story_id.diary_id,
		role: story.role,
		character: story.character_id,
	});
}

const filteredTabs = ref([]);

if (name === "person") {
	filteredTabs.value = [...new Set(stories.value.flatMap(e => e.role))];
}

if (name === "character") {
	filteredTabs.value = [...new Set(stories.value.flatMap(e => e.type))];
}

if (name === "user") {
	filteredTabs.value = [...new Set(stories.value.flatMap(e => e.type))];
}

const tabs = ref([]);
const tabKey = ref(0);
const filteredTab = ref([]);
const actualTab = ref("");

for (const tb of filteredTabs.value) {
	if (name === "person") {
		tabs.value.push({
			tab: tb.toUpperCase(),
			id: tb,
			size: stories.value.filter(e => e.role === tb).length,
		});
	}
	if (tb === "audios") {
		tabs.value.push({
			tab: user.lang === "pt-br" ? "ÁUDIOS" : "AUDIOS",
			id: tb,
			size: stories.value.filter(e => e.type === tb).length,
		});
	}
	if (tb === "books") {
		tabs.value.push({
			tab: user.lang === "pt-br" ? "LIVROS" : "BOOKS",
			id: tb,
			size: stories.value.filter(e => e.type === tb).length,
		});
	}
	if (tb === "comics") {
		tabs.value.push({
			tab: user.lang === "pt-br" ? "HQS" : "COMICS",
			id: tb,
			size: stories.value.filter(e => e.type === tb).length,
		});
	}
	if (tb === "tv") {
		tabs.value.push({tab: "TV", id: tb, size: stories.value.filter(e => e.type === tb).length});
	}
}
if (tabs.value.length > 0) {
	filter(tabs.value[0].id);
}

function filter(id) {
	if (actualTab.value !== id) {
		if (name === "character") {
			actualTab.value = id;
			filteredTab.value = stories.value.filter(e => e.type === id);
		}

		if (name === "user") {
			actualTab.value = id;
			filteredTab.value = stories.value.filter(e => e.type === id);
		}

		if (name === "person") {
			actualTab.value = id;
			filteredTab.value = stories.value.filter(e => e.role === id);
		}
		tabKey.value += 1;
	}
}
</script>

<template>
	<div class="subcontainer">
		<div class="tabs">
			<div
				:key="i"
				v-for="({tab, id, size}, i) in tabs"
				:class="id === actualTab ? 'tab activeTab' : 'tab'"
				@click="filter(id)"
			>
				{{ tab }} ({{ size }})
			</div>
		</div>
		<div class="content">
			<Transition
				name="comp"
				mode="out-in"
			>
				<StoriesListType
					:key="tabKey"
					:data="filteredTab"
				/>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.tabs {
	padding: unset;
	overflow: unset;
}
@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}
	.tab {
		flex: 0;
	}
}
</style>
