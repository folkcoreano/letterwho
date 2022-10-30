<script setup>
import {ref, onBeforeMount, shallowRef} from "vue";
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import setTitle from "@/stores/title";
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";
import CharacterBio from "../templates/CharacterBio.vue";
import StoriesList from "../templates/StoriesList.vue";

const {
	params: {id},
} = useRoute();

const data = ref();
const load = ref(false);
const tabs = ref([]);
const actTab = ref("CHARACTER");
const user = useUser();

const activeTab = shallowRef(CharacterBio);
const tabData = ref();

const filtered = ref([]);

const select = tab => {
	// actTab.value = tab;
	// filtered.value = data.value.character_id.filter(e => e.story_id.type === tab);
	tabData.value = data.value.character_id.filter(e => e.story_id.type === tab);
};

function size(tab) {
	return data.value.character_id.filter(e => e.story_id.type === tab).length;
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

onBeforeMount(() => {
	supabase
		.from("characters")
		.select(
			`*,
			character_id(story_id(title,code,released,range_id,type,url,diary_id(*))),
			quotes(id,pt,en,story_id(title,code,url,type,range_id))`
		)
		.match({character_id: id})
		.filter("character_id.story_id.diary_id.user_id", "eq", user.id)
		.limit(1, {foreignTable: "character_id.story_id.diary_id"})
		.order("id", {foreignTable: "character_id.story_id.diary_id", ascending: true})
		.single()
		.then(res => {
			data.value = res.data;

			tabData.value = res.data.quotes;

			let alltabs = res.data.character_id.flatMap(e => e.story_id.type);

			const filteredtabs = [...new Set(alltabs)];

			for (const tb of filteredtabs) {
				if (tb === "audios") {
					tabs.value.push({tab: user.lang === "pt-br" ? "ÁUDIOS" : "AUDIOS", id: tb});
				}
				if (tb === "books") {
					tabs.value.push({tab: user.lang === "pt-br" ? "LIVROS" : "BOOKS", id: tb});
				}
				if (tb === "comics") {
					tabs.value.push({tab: user.lang === "pt-br" ? "HQS" : "COMICS", id: tb});
				}
				if (tb === "tv") {
					tabs.value.push({tab: "TV", id: tb});
				}
			}

			setTitle(res.data.name);

			load.value = true;
		});
});
</script>

<template>
	<template v-if="load">
		<div class="char">
			<div class="tabs">
				<div class="tab">BIO</div>
				<div
					:key="i"
					v-for="({tab, id}, i) in tabs"
					class="tab"
					@click="(tabData = select(id)), (activeTab = StoriesList)"
				>
					{{ tab }}
				</div>
			</div>
			<div class="content">
				<Transition
					name="comp"
					mode="out-in"
				>
					<KeepAlive>
						<Component
							:data="tabData"
							:is="activeTab"
						/>
					</KeepAlive>
				</Transition>
			</div>
			<!-- <div class="tabs">
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
				v-show="actTab !== 'CHARACTER'"
				class="items"
			>
				<RouterLink
					class="item"
					:style="`border: 2px solid ${checkStatus(diary_id)}`"
					v-for="(
						{story_id: {title, diary_id, code, released, range_id, type, url}}, i
					) in filtered"
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
			</div> -->
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>

<style scoped></style>
