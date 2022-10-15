<script setup>
import supabase from "@/supabase";
import {ref} from "vue";

const data = ref();
const character = ref();
const story = ref();

const en = ref("");
const pt = ref("");
const charlist = ref([]);
const storylist = ref([]);

const getQuotes = () => {
	supabase
		.from("quotes")
		.select("id,pt,en,character_id(character_id,name),story_id(title,code,url,type,range_id)")
		.then(r => {
			data.value = r.data;
		});
};

function getChar() {
	supabase
		.from("characters")
		.select()
		.then(res => {
			charlist.value = res.data;
		});
}

function getStory() {
	supabase
		.from("story")
		.select()
		.then(res => {
			storylist.value = res.data;
		});
}

const addQuote = () => {
	const file = {
		en: en.value,
		pt: pt.value,
		character_id: character.value,
		story_id: story.value,
	};

	supabase
		.from("quotes")
		.insert(file)
		.then(res => {
			if (res.data) {
				console.log("added!");
				en.value = "";
				pt.value = "";
			} else {
				console.log(res.error);
			}
		});
};

// getChar();
// getStory();
getQuotes();
</script>

<template>
	<div>
		<div v-if="false">
			<div>
				character
				<select
					name="thing"
					id="thing"
					v-model="character"
				>
					<option :value="null">---</option>
					<option
						v-for="a in charlist"
						:key="a"
						:value="a.character_id"
					>
						{{ a.name }}
					</option>
				</select>
			</div>
			<div>
				story
				<select
					name="thing"
					id="thing"
					v-model="story"
				>
					<option
						v-for="a in storylist"
						:key="a"
						:value="a.code"
					>
						{{ a.title }}
					</option>
				</select>
			</div>
			<div>
				pt
				<input
					v-model.trim="pt"
					type="text"
					name="pt"
					id="pt"
				/>
			</div>
			<div>
				en
				<input
					v-model.trim="en"
					type="text"
					name="en"
					id="en"
				/>
			</div>
			<div>
				<button @click.prevent="addQuote">add</button>
			</div>
		</div>
		<br />
		<div class="quotes">
			<div
				class="quote"
				:key="id"
				v-for="({id, pt, en, character_id, story_id: {title, url, type, range_id}}, i) in data"
			>
				<q>{{ pt }}</q>
				<br />
				<q>{{ en }}</q>
				<br />
				<div
					class="auth"
					v-if="character_id"
				>
					<router-link
						v-if="character_id"
						:to="{name: 'character', params: {id: character_id.character_id}}"
						>{{ character_id.name }},
					</router-link>
				</div>
				<router-link
					class="auth"
					:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
					>{{ title }}</router-link
				>
			</div>
		</div>
	</div>
</template>

<style scoped>
.quotes {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.quote {
	color: #eee;
	font-weight: bold;
}

.auth {
	color: #aaa;
	font-weight: normal;
}
</style>
