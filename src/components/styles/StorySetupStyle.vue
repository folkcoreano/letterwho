<script setup>
import {ref} from "vue";
import supabase from "@/supabase";
import {useRoute} from "vue-router";
import {useTime} from "@/stores/time";
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
import {useReview} from "@/stores/review";
import Tabs from "@/components/templates/Tabs.vue";
import StoryStyle from "@/components/styles/StoryStyle.vue";
import ActivityTabs from "@/components/templates/ActivityTabs.vue";
import ReviewBox from "@/components/functions/reviews/ReviewBox.vue";

const {
	params: {type, range, story},
} = useRoute();

const user = useUser();
const review = useReview();

const storyData = ref();
const crew = ref();
const quotes = ref();
const parts = ref();
const characters = ref();
const code = ref();
const activity = ref();
const reviews = ref();
const watched = ref(false);

const {data} = await supabase
	.from("story")
	.select(
		`*,
		quote(id,en,pt,character_id(character_id,name)),
		range_id(range),
		story_id(role,type,crew_id(crew_id,name),character_id(character_id,name)),
		parts(title,story,released,length),
		reviews_id(id,created,text,loved,rating,rewatch,story_id(title, type,range_id,url,released,code)),
		diary_id(id,created,watched,saved,liked,rating,review,review_id(id,rating,loved),rewatch,story_id(title, type,range_id,url,released,code))
		`
	)
	.order("id", {foreignTable: "reviews_id", ascending: false})
	.filter("reviews_id.user_id", "eq", user.id)
	.order("id", {foreignTable: "diary_id", ascending: false})
	.filter("diary_id.user_id", "eq", user.id)
	.single()
	.match({type: type, range_id: range, url: story});

setTitle(data.title);

review.storyHasData = data.diary_id.some(e => !e.review && !e.rewatch);

const status = data.diary_id.find(e => !e.review && !e.rewatch);

if (data.diary_id.some(e => !e.review && !e.rewatch)) {
	status.watched && status.watched.status ? (watched.value = true) : (watched.value = false);
}

activity.value = data.diary_id.length > 0 ? data.diary_id : null;

reviews.value = data.reviews_id.length > 0 ? data.reviews_id : null;

storyData.value = {
	diary: data.diary_id.length > 0 ? status : null,
	hasData: data.diary_id.some(e => !e.review && !e.rewatch),
	code: data.code,
	title: data.title,
	length:
		data.parts.length > 0
			? data.parts.flatMap(e => +e.length).reduce((a, b) => a + b)
			: data.length,
	range: data.range_id.range,
	type: data.type,
	released: data.released,
	time: useTime(user.lang, data.released),
	url: data.url,
	writer: data.story_id.some(e => e.role === "Writer")
		? data.story_id.filter(e => e.role === "Writer").flatMap(e => e.crew_id)[0]
		: null,
	frame:
		data.frames < 0
			? null
			: `${data.type}/${data.range_id.range}/${data.code}F${Math.floor(
					Math.random() * data.frames
			  )}`,
	liked: data.liked,
	watched: data.watched,
	rated: data.rated,
	rating: data.rating,
	saved: data.watchlist,
	resume: data.resume ? (user.lang === "pt-br" ? data.resume.pt : data.resume.en) : null,
	quote:
		data.quote.length > 0
			? user.lang === "pt-br"
				? data.quote[Math.floor(Math.random() * data.quote.length)].pt
				: data.quote[Math.floor(Math.random() * data.quote.length)].en
			: null,
	cover: `${data.type}/${data.range_id.range}/${data.code}`,
};

const crewFile = [];

for (const person of data.story_id) {
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

characters.value = data.story_id.filter(e => e.type === "CHARACTER");

quotes.value = data.quote;

code.value = data.code;

parts.value = data.parts.length > 0 ? data.parts : null;
</script>

<template>
	<StoryStyle
		:data="storyData"
		:watched="watched"
	>
		<template #review>
			<ReviewBox
				v-if="user.logged"
				:data="storyData"
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
</template>
