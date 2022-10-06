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
const tabs = ref();
const actTab = ref();
const load = ref(false);

const filtered = ref();

supabase
	.from("crew")
	.select("*,name,crew_id(character_id(name),role,story_id(title,released,code,range_id,type,url))")
	.match({crew_id: id})
	.limit(1)
	.single()
	.then(res => {
		data.value = res.data;

		tabs.value = res.data.crew_id.flatMap(e => e.role);

		select(tabs.value[0]);
		actTab.value = tabs.value[0];
		setTitle(res.data.name);

		load.value = true;
	});

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
					class="tab"
					v-for="tab in tabs"
					:style="tab === actTab ? 'background-color: #444' : ''"
				>
					{{ tab }}: {{ size(tab) }}
				</div>
			</div>

			<div>
				<div
					v-for="(
						{role, character_id, story_id: {title, code, range_id, type, url, released}}, i
					) in filtered"
				>
					{{ role }}
					<RouterLink :to="{name: 'story', params: {type: type, range: range_id, story: url}}">
						<img
							:src="folder(`${type}/${range_id}/${code}`, '200')"
							:alt="title"
						/>
						<div>{{ title }}:{{ role }}</div>
						<div v-if="character_id">{{ character_id.name }}</div>
					</RouterLink>
				</div>
			</div>
			<br />
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped>
.tabs {
	display: flex;
	flex-flow: column;
	transition: all 150ms linear;
	gap: 0.35rem;
}
.tab {
	padding: 0.35rem;
	background-color: #222;
	border-radius: 0.15rem;
	cursor: pointer;
	transition: all 150ms linear;
}
.items {
	display: flex;
	gap: 0.5rem;
}
.item {
	display: flex;
	flex-flow: column;
}

.img {
	max-width: 10rem;
}
</style>
