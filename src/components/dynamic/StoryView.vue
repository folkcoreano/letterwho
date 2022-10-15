<script setup>
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import LoadingState from "../layout/LoadingState.vue";
import CastAndCrew from "../templates/CastAndCrew.vue";
import setTitle from "@/stores/title";
import StoryStyle from "../templates/StoryStyle.vue";
import {useUser} from "@/stores/user";
import {folder} from "@/stores/images";
import {useTime} from "@/stores/time";

const {
	params: {type, range, story},
} = useRoute();

const {push} = useRouter();

const {lang} = useUser();

const data = ref();
const cast = ref();

const load = ref(false);

try {
	supabase
		.from("story")
		.select(
			`*,
		quote(en,pt),
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

				data.value = {
					code: res.data.code,
					title: res.data.title,
					length: res.data.length,
					range: res.data.range_id.range,
					type: res.data.type,
					released: res.data.released,
					time: useTime(lang, res.data.released),
					url: res.data.url,
					writer: res.data.story_id.some(e => e.role === "Writer")
						? res.data.story_id.filter(e => e.role === "Writer").flatMap(e => e.crew_id)[0]
						: null,
					frame:
						res.data.frames < 0
							? null
							: res.data.type +
							  "/" +
							  res.data.range_id.range +
							  "/" +
							  res.data.code +
							  "F" +
							  Math.floor(Math.random() * res.data.frames),
					liked: res.data.liked,
					watched: res.data.watched,
					rated: res.data.rated,
					rating: res.data.rating,
					saved: res.data.watchlist,
					resume: res.data.resume
						? lang === "pt-br"
							? res.data.resume.pt
							: res.data.resume.en
						: null,
					quote:
						res.data.quote.length > 0
							? lang === "pt-br"
								? res.data.quote[Math.floor(Math.random() * res.data.quote.length)].pt
								: res.data.quote[Math.floor(Math.random() * res.data.quote.length)].en
							: null,
					cover: res.data.type + "/" + res.data.range_id.range + "/" + res.data.code,
				};

				cast.value = res.data.story_id;
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
			<StoryStyle
				v-if="load"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="cast" />
				</template>
			</StoryStyle>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>
