<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	data: Object,
	characters: Object,
	code: String,
});

const {lang} = useUser();

const {
	params: {type, range, story},
} = useRoute();

const characters = ref(props.characters.flatMap(e => e.character_id));

const selectedCharacter = ref("");
const quotePT = ref("");
const quoteEN = ref("");
const quoteID = ref("");

const isEditing = ref(false);

const editMode = ref(false);

function addQuote() {
	if (isEditing.value === false) {
		console.log("add");
		supabase
			.from("quotes")
			.insert({
				character_id: selectedCharacter.value,
				story_id: props.code,
				en: quoteEN.value,
				pt: quotePT.value,
			})
			.select("*")
			.then(res => {
				selectedCharacter.value = "";
				quoteEN.value = "";
				quotePT.value = "";
				quoteID.value = "";

				console.table(res.data);
				console.table(res.error);
			});
	} else {
		console.log("edit");
		supabase
			.from("quotes")
			.update({
				character_id: selectedCharacter.value,
				en: quoteEN.value,
				pt: quotePT.value,
			})
			.match({id: quoteID.value})
			.select("*")
			.then(res => {
				isEditing.value = false;

				selectedCharacter.value = "";
				quoteEN.value = "";
				quotePT.value = "";
				quoteID.value = "";

				console.table(res.data);
				console.table(res.error);
			});
	}
}

function editQuote(quoteData) {
	isEditing.value = true;
	selectedCharacter.value = quoteData.character;
	quoteEN.value = quoteData.en;
	quotePT.value = quoteData.pt;
	quoteID.value = quoteData.id;
}
</script>

<template>
	<div class="quoteBlock">
		<div
			v-if="editMode"
			class="addQuote"
		>
			<div>
				<label for="char"
					>Character

					<select
						v-model="selectedCharacter"
						id="char"
					>
						<option :value="null">---</option>
						<option
							v-for="({character_id, name}, i) in characters"
							:key="i"
							:value="character_id"
							v-text="name"
						/>
					</select>
				</label>
			</div>
			<div>
				<label for="pt">
					PT
					<textarea
						name="pt"
						id="pt"
						v-model.trim="quotePT"
						cols="30"
						rows="3"
					/>
				</label>
				<label for="en">
					EN
					<textarea
						name="en"
						id="en"
						v-model.trim="quoteEN"
						cols="30"
						rows="3"
					/>
				</label>
			</div>
			<div>
				<button @click="addQuote()">
					{{ isEditing ? "edit" : "add" }}
				</button>
			</div>
		</div>
		<div class="quotes">
			<div
				class="quote"
				v-for="({id, en, pt, character_id}, i) in data"
				:key="i"
			>
				<q>
					{{ lang === "pt-br" ? pt : en }}
				</q>
				<i> {{ character_id ? character_id.name : "" }}</i>
				<button
					v-if="editMode"
					@click="editQuote({id: id, en: en, pt: pt, character: character_id.character_id})"
				>
					edit
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
.quoteBlock {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
.quote i {
	color: #ccc;
}

.quote q {
	font-weight: bold;
}

.quote {
	display: flex;
	flex-flow: column;
	align-items: flex-start;
	gap: 0.15rem;
}

.quotes {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
</style>
