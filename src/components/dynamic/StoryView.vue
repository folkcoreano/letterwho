<script setup>
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useUser} from "@/stores/user";
import AudiosStyle from "@/components/templates/AudiosStyle.vue";
import TVStyle from "@/components/templates/TVStyle.vue";
import setTitle from "@/stores/title";
import CastAndCrew from "../templates/CastAndCrew.vue";
import BookStyle from "../templates/BookStyle.vue";
import ComicStyle from "../templates/ComicStyle.vue";
import MultipleParts from "../templates/MultipleParts.vue";

const {
	params: {type, range, story},
} = useRoute();

const data = ref();

const load = ref(false);

const {lang} = useUser();

const {push} = useRouter();

try {
	supabase
		.from("story")
		.select(
			`*,
		quote(en,pt,character_id(name,character_id)),
		range_id(range),
		story_id(role,type,
		crew_id(name,crew_id),
					character_id(name,type,character_id)),
					parts(story,title,released,length)`
		)
		.limit(1)
		.match({type: type, range_id: range, url: story})
		.single()
		.then(res => {
			if (res.data) {
				data.value = res.data;
				setTitle(res.data.title);
				load.value = true;
			} else {
				push({name: "home"});
			}

			// let file = [];

			// for (const {type} of res.data.story_id.filter(e => e.type === "DOCTOR")) {
			// 	file.push(type);
			// }

			// console.log(file);
		});
} catch (err) {
	console.log(err);
}
const crewlist = ref([]);

function getCrew() {
	supabase
		.from("crew")
		.select()
		.then(res => {
			crewlist.value = res.data;
		});
}

const charlist = ref([]);

function getChar() {
	supabase
		.from("characters")
		.select()
		.then(res => {
			charlist.value = res.data;
		});
}

// getChar();
// getCrew();
const crew = ref();
const char = ref();
const typegroup = ref();
const role = ref();

function addRelation() {
	const file = {
		crew_id: crew.value,
		story_id: data.value.code,
		character_id: char.value,
		role: role.value,
		type: typegroup.value,
	};
	// console.log(file);
	// return;
	supabase
		.from("relation")
		.insert(file)
		.then(res => {
			console.log(res);
		});
}
</script>

<template>
	<template v-if="load">
		<div>
			<div v-if="false">
				<p>
					character
					<select
						name="rel"
						id="rel"
						v-model="char"
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
				</p>
				<p>
					crew
					<select
						name="rel"
						id="rel"
						v-model="crew"
					>
						<option :value="null">---</option>
						<option
							v-for="a in crewlist"
							:key="a"
							:value="a.crew_id"
						>
							{{ a.name }}
						</option>
					</select>
				</p>
				<p>
					type
					<select
						name="rel"
						id="rel"
						v-model="typegroup"
					>
						<option value="CREW">CREW</option>
						<option value="CHARACTER">CHARACTER</option>
						<option value="FEATURING">FEATURING</option>
						<option value="ENEMY">ENEMY</option>
						<option value="DOCTOR">DOCTOR</option>
						<option value="COMPANION">COMPANION</option>
					</select>
				</p>
				<p>
					role
					<input
						type="text"
						name="text"
						id="text"
						v-model="role"
					/>
				</p>
				<p></p>
				<button @click="addRelation">add</button>
			</div>
			<AudiosStyle
				v-if="type === 'audios'"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
			</AudiosStyle>
			<BookStyle
				v-if="type === 'books'"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
			</BookStyle>
			<ComicStyle
				v-if="type === 'comics'"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
			</ComicStyle>
			<TVStyle
				v-if="type === 'tv'"
				:data="data"
			>
				<template #cast>
					<CastAndCrew :data="data.story_id" />
				</template>
				<template #parts>
					<MultipleParts :data="data.parts" />
				</template>
			</TVStyle>
		</div>
	</template>
	<template v-else>
		<loading-state />
	</template>
</template>
