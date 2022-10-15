<script setup>
import {char} from "@/stores/images";
import supabase from "@/supabase";
import {ref} from "vue";

const data = ref([]);
const character = ref("");

const getChar = () => {
	try {
		supabase
			.from("characters")
			.select()
			.then(res => {
				data.value = res.data;
			});
	} catch (e) {
		console.log(e);
	}
};

const addChar = () => {
	try {
		supabase
			.from("characters")
			.insert({
				character_id: character.value.toLowerCase().replaceAll(" ", "-"),
				name: character.value,
			})
			.then(() => {
				getChar();
			});
	} catch (e) {
		console.log(e);
	}
};
getChar();
</script>

<template>
	<div>
		<div v-if="false">
			<input
				type="text"
				name="char"
				id="char"
				v-model.trim="character"
			/>
			<button @click="addChar">add</button>
			<br />
			{{ character }}
			<br />
			{{ character.toLowerCase().replaceAll(" ", "-") }}
			<br />
		</div>
		<div class="chars">
			<RouterLink
				v-for="({character_id, name, type}, i) in data"
				:key="i"
				class="item"
				:to="{name: 'character', params: {id: character_id}}"
			>
				<img
					class="icon"
					onerror="this.src='https://i.ibb.co/Kqbh5YK/imagem-2022-06-17-132705588-1-1.png'"
					:src="char('p/' + character_id, '150')"
					alt=""
				/>
				{{ name }}
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.chars {
	display: flex;
	flex-flow: row wrap;
	gap: 1rem;
}

.item {
	display: flex;
	flex-flow: column;
}
.icon {
	border-radius: 50%;
	max-width: 3.55rem;
}
</style>
