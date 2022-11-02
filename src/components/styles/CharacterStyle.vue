<script setup>
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {watchEffect, shallowRef, ref} from "vue";
import {useRoute} from "vue-router";
import CharacterBio from "../templates/CharacterBio.vue";
import StoriesList from "../templates/StoriesList.vue";

const {
	params: {id},
} = useRoute();

const user = useUser();

const {data} = await supabase
	.from("characters")
	.select(
		`
		character_id(story_id(title,code,released,range_id,type,url,diary_id(watched,saved))),
		name,
		quotes(pt,en,by,story_id(title,released,type,range_id,url))
		`
	)
	.limit(1, {foreignTable: "character_id.story_id.diary_id"})
	.order("id", {foreignTable: "character_id.story_id.diary_id", ascending: true})
	.filter("character_id.story_id.diary_id.user_id", "eq", user.id)
	.limit(1)
	.single()
	.match({character_id: id});

watchEffect(() => {
	if (data) {
		setTitle(data.name);
	}
});

const tab = shallowRef(CharacterBio);

const tabData = ref(data.quotes);
</script>

<template>
	<div class="container">
		<div class="tabs">
			<div
				@click="(tabData = data.quotes), (tab = CharacterBio)"
				:class="tab === CharacterBio ? 'tab activeTab' : 'tab'"
			>
				BIO
			</div>
			<div
				@click="(tabData = data.character_id), (tab = StoriesList)"
				:class="tab === StoriesList ? 'tab activeTab' : 'tab'"
			>
				{{ user.lang === "pt-br" ? "Histórias" : "Stories" }}
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
						:is="tab"
					/>
				</KeepAlive>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.tabs {
	overflow: unset;
	padding: unset;
}
@media (min-width: 35rem) {
	.tabs {
		width: auto;
		overflow: unset;
		padding: unset;
	}
	.tab {
		flex: 1;
		text-align: center;
	}
}
</style>
