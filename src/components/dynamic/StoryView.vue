<script setup>
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import LoadingState from "../layout/LoadingState.vue";
import AudiosStyle from "../templates/AudiosStyle.vue";
import BookStyle from "../templates/BookStyle.vue";
import ComicStyle from "../templates/ComicStyle.vue";
import TVStyle from "../templates/TVStyle.vue";
import CastAndCrew from "../templates/CastAndCrew.vue";
import setTitle from "@/stores/title";

const {
	params: {type, range, story},
} = useRoute();

const {push} = useRouter();

let comp;

if (type === "audios") {
	comp = AudiosStyle;
}

if (type === "books") {
	comp = BookStyle;
}

if (type === "comics") {
	comp = ComicStyle;
}

if (type === "tv") {
	comp = TVStyle;
}

const data = ref();

const load = ref(false);

try {
	supabase
		.from("story")
		.select(
			`*,
		quote(en,pt,character_id(name,character_id)),
		range_id(range),
		story_id(role,type,crew_id(name,crew_id),character_id(name,type,character_id)),
		parts(story,title,released,length)`
		)
		.limit(1)
		.single()
		.match({type: type, range_id: range, url: story})
		.then(res => {
			if (res.data) {
				load.value = true;
				setTitle(res.data.title);
				data.value = res.data;
			} else {
				push({name: "home"});
			}
		});
} catch (e) {
	console.log(e);
}
</script>

<template>
	<template v-if="load">
		<div>
			<component
				:is="comp"
				v-if="load"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
			</component>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>
