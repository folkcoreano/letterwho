<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import SignOUT from "../functions/SignOUT.vue";

const user = useUser();

const language = ref(user.lang === "pt-br" ? "en" : "pt-br");

function changeLanguage() {
	supabase.auth
		.updateUser({
			data: {
				language: language.value,
				beta: true,
			},
		})
		.then(res => {
			console.log(res);
		});
}
</script>

<template>
	<div>
		<h2>Language</h2>
		<div>
			<select
				v-model="language"
				name="lang"
				id="lang"
			>
				<option value="pt-br">pt-br</option>
				<option value="en">en</option>
			</select>
			<br />
			<button @click="changeLanguage">change lang to: {{ language }}</button>
			<br />
		</div>
		<br />
		<SignOUT />
	</div>
</template>
