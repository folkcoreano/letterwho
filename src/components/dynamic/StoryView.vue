<script setup>
import {ref} from "vue";
import supabase from "@/supabase";
import {useUser} from "@/stores/user";
import {useTime} from "@/stores/time";
import setTitle from "@/stores/title";
import {useRoute, useRouter} from "vue-router";
import Tabs from "@/components/templates/Tabs.vue";
import StoryStyle from "@/components/templates/StoryStyle.vue";
import LoadingState from "@/components/layout/LoadingState.vue";
import ReviewBox from "@/components/functions/reviews/ReviewBox.vue";
import ActivityTabs from "../templates/ActivityTabs.vue";

const {
	params: {type, range, story},
} = useRoute();

const {push} = useRouter();

const user = useUser();

const data = ref();
const crew = ref();
const quotes = ref();
const parts = ref();
const doctors = ref();
const characters = ref();
const code = ref();
const activity = ref();
const reviews = ref();

const storyQuery = ref("story_id(title, type,range_id,url,released,code)");

const load = ref(false);

try {
	supabase
		.from("story")
		.select(
			`*,
		quote(id,en,pt,character_id(character_id,name)),
		range_id(range),
		story_id(role,type,crew_id(crew_id,name),character_id(character_id,name)),
		parts(title,story,released,length),
		reviews_id(id,created,text,loved,rating,rewatch,${storyQuery.value}),
		diary_id(id,created,watched,saved,liked,rating,review,review_id(id,rating,loved),rewatch,${storyQuery.value})
		`
		)
		.order("id", {foreignTable: "reviews_id", ascending: false})
		.filter("reviews_id.user_id", "eq", user.id)
		.order("id", {foreignTable: "diary_id", ascending: false})
		.filter("diary_id.user_id", "eq", user.id)
		.single()
		.match({type: type, range_id: range, url: story})
		.then(res => {
			if (res.data) {
				activity.value = res.data.diary_id.length > 0 ? res.data.diary_id : null;
				reviews.value = res.data.reviews_id.length > 0 ? res.data.reviews_id : null;

				setTitle(res.data.title);

				if (res.data.diary_id.length > 0) {
					if (
						res.data.diary_id[0].watched === null &&
						res.data.diary_id[0].saved === null &&
						res.data.diary_id[0].liked === null &&
						res.data.diary_id[0].review === false &&
						res.data.diary_id[0].rewatch === false
					) {
						supabase
							.from("diary")
							.delete()
							.match({
								id: res.data.diary_id[0].id,
							})
							.then(() => {
								console.log("deleting dull data");
							});
					}
				}

				data.value = {
					diary:
						res.data.diary_id.length > 0
							? res.data.diary_id.filter(e => !e.review && !e.rewatch)[0]
							: null,
					hasData: res.data.diary_id.some(e => !e.review && !e.rewatch),
					code: res.data.code,
					title: res.data.title,
					length:
						res.data.parts.length > 0
							? res.data.parts.flatMap(e => +e.length).reduce((a, b) => a + b)
							: res.data.length,
					range: res.data.range_id.range,
					type: res.data.type,
					released: res.data.released,
					time: useTime(user.lang, res.data.released),
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
						? user.lang === "pt-br"
							? res.data.resume.pt
							: res.data.resume.en
						: null,
					quote:
						res.data.quote.length > 0
							? user.lang === "pt-br"
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

				load.value = true;
			} else {
				console.table(res.error);
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
				<template #review>
					<ReviewBox
						v-if="user.logged"
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
					<ActivityTabs
						:context="'story'"
						:diary="activity"
						:reviews="reviews"
					/>
				</template>
			</StoryStyle>
		</div>
	</template>
	<template v-else>
		<LoadingState />
	</template>
</template>
