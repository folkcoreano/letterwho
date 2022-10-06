<script setup>
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import AudiosStyle from "@/components/templates/AudiosStyle.vue";
import TVStyle from "@/components/templates/TVStyle.vue";
import setTitle from "@/stores/title";
import CastAndCrew from "../templates/CastAndCrew.vue";

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

			// let file = [];

			// for (const {type} of res.data.story_id.filter(e => e.type === "DOCTOR")) {
			// 	file.push(type);
			// }

			// console.log(file);
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
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
			</AudiosStyle>
			<TVStyle
				v-if="type === 'tv'"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
			</TVStyle>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>
