<script setup>
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {watchEffect, shallowRef, ref} from "vue";
import {useRoute} from "vue-router";
import CharacterBio from "./CharacterBio.vue";
import StoriesList from "./StoriesList.vue";

const {
	params: {id},
} = useRoute();

const user = useUser();

const {data, error} = await supabase
	.from("crew")
	.select(
		`
    name,
    crew_id(character_id(name),role,story_id(title,code,released,range_id,type,url,diary_id(watched,saved)))
    `
	)
	.limit(1, {foreignTable: "crew_id.story_id.diary_id"})
	.order("id", {foreignTable: "crew_id.story_id.diary_id", ascending: true})
	.filter("crew_id.story_id.diary_id.user_id", "eq", user.id)
	.limit(1)
	.single()
	.match({crew_id: id});

watchEffect(() => {
	if (data) {
		setTitle(data.name);
	}
});

const tab = shallowRef(CharacterBio);

const tabData = ref(data.crew_id);
</script>

<template>
	<div class="container">
		<div class="tabs">
			<div
				@click="tab = CharacterBio"
				:class="tab === CharacterBio ? 'tab activeTab' : 'tab'"
			>
				BIO
			</div>
			<div
				@click="tab = StoriesList"
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
				<!-- <KeepAlive> -->
				<Component
					:data="tabData"
					:is="tab"
				/>
				<!-- </KeepAlive> -->
			</Transition>
		</div>
	</div>
</template>

<style scoped>
@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}
	.tab {
		flex: 1;
		text-align: center;
	}
}
</style>
