<script setup>
import supabase from "@/supabase";
import {ref} from "vue";

const results = ref([]);
const resultsChar = ref([]);
const query = ref("");
const queryChar = ref("");

const search = () => {
	supabase
		.from("story")
		.select("url,title,type,range_id")
		.textSearch("url", query.value.toLowerCase().replaceAll(" ", "-"), {
			type: "websearch",
		})
		.then(res => {
			results.value = res.data;
		});
};

const searchChar = () => {
	supabase
		.from("characters")
		.select("character_id,name")
		.textSearch("character_id", queryChar.value.toLowerCase().replaceAll(" ", "-"), {
			type: "websearch",
		})
		.then(res => {
			resultsChar.value = res.data;
		});
};
</script>

<template>
	<div>
		<div>
			Search stories
			<br />
			<input
				type="text"
				name="search"
				id="search"
				@input="search"
				v-model.trim="query"
				autocomplete="off"
			/>
			<button @click="search">search</button>

			<br />
			<br />
			<div v-for="a in results">
				<router-link :to="{name: 'story', params: {type: a.type, range: a.range_id, story: a.url}}">
					{{ a.title }}
				</router-link>
			</div>
		</div>
		<div>
			Search characters
			<br />
			<input
				type="text"
				name="chars"
				id="chars"
				@input="searchChar"
				v-model.trim="queryChar"
				autocomplete="off"
			/>
			<button @click="searchChar">search</button>

			<br />
			<br />
			<div v-for="a in resultsChar">
				<router-link :to="{name: 'character', params: {id: a.character_id}}">
					{{ a.name }}
				</router-link>
			</div>
		</div>
	</div>
</template>
