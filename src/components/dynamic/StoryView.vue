<script setup>
import {ref} from "vue";
import supabase from "@/supabase";
import {useUser} from "@/stores/user";
import {useTime} from "@/stores/time";
import {useRoute, useRouter} from "vue-router";
import setTitle from "@/stores/title";
import StoryStyle from "@/components/templates/StoryStyle.vue";
import LoadingState from "@/components/layout/LoadingState.vue";
import ReviewBox from "@/components/functions/reviews/ReviewBox.vue";
import Tabs from "../templates/Tabs.vue";

const {
	params: {type, range, story},
} = useRoute();

const {push} = useRouter();

const {lang, logged} = useUser();

const data = ref();
const crew = ref();
const quotes = ref();
const parts = ref();
const doctors = ref();
const characters = ref();
const code = ref();

const load = ref(false);

try {
	supabase
		.from("story")
		.select(
			`*,
		quote(id,en,pt,character_id(character_id,name)),
		range_id(range),
		story_id(role,type,crew_id(crew_id,name),character_id(character_id,name)),
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
					length:
						res.data.parts.length > 0
							? res.data.parts.flatMap(e => +e.length).reduce((a, b) => a + b)
							: res.data.length,
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
							: `${res.data.type}/${res.data.range_id.range}/${res.data.code}F${Math.floor(
									Math.random() * res.data.frames
							  )}`,
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
					cover: `${res.data.type}/${res.data.range_id.range}/${res.data.code}`,
				};

				const crewFile = [];

				for (const person of res.data.story_id) {
					if (person.crew_id) {
						crewFile.push({
							tab: person.role,
							type: person.type,
							person: {
								name: person.crew_id.name,
								url: person.crew_id.crew_id,
							},
							role: {
								name: person.character_id ? person.character_id.name : person.role,
								url: person.character_id ? person.character_id.character_id : null,
							},
						});
					}
				}

				crew.value = crewFile;

				characters.value = res.data.story_id.filter(e => e.type === "CHARACTER");

				quotes.value = res.data.quote;

				code.value = res.data.code;

				parts.value = res.data.parts.length > 0 ? res.data.parts : null;

				doctors.value = res.data.story_id
					.filter(e => e.type === "DOCTOR")
					.flatMap(e => e.character_id.character_id);
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
			<router-link :to="{name: 'reviews', params: {type: type, range: range, story: story}}"
				>REVIEWS</router-link
			>
			<StoryStyle
				v-if="load"
				:data="data"
			>
				<template #review>
					<ReviewBox
						v-if="false"
						:doctors="doctors"
						:data="data"
					/>
				</template>
				<template #cast>
					<Tabs
						:code="code"
						:quotes="quotes"
						:parts="parts"
						:crew="crew"
						:characters="characters"
					/>
				</template>
			</StoryStyle>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>
