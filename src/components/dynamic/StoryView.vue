<script setup>
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import AudiosStyle from "@/components/templates/AudiosStyle.vue";
import TVStyle from "@/components/templates/TVStyle.vue";
import setTitle from "@/stores/title";

const {
	params: {type, range, story},
} = useRoute();

const data = ref();

const load = ref(false);

const {lang} = useUser();

async function getStory() {
	supabase
		.from("story")
		.select(
			"*,range_id(range),story_id(type,role,crew_id(crew_id,name),character_id(character_id,name,type))"
		)
		.limit(1)
		.match({type: type, range_id: range, url: story})
		.single()
		.then(res => {
			data.value = res.data;
			setTitle(res.data.title);
			load.value = true;
		});
}
getStory();
</script>

<template>
	<template v-if="load">
		<div>
			<AudiosStyle
				v-if="type === 'audios'"
				:data="data"
			/>
			<TVStyle
				v-if="type === 'tv'"
				:data="data"
			/>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>
