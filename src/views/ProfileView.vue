<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";

const language = ref("pt-br");

const user = useUser();

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
		<pre>{{ user }}</pre>
	</div>
</template>
