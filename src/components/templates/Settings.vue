<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import axios from "axios";
import {ref} from "vue";
import SignOUT from "../functions/SignOUT.vue";

const user = useUser();

const language = ref(user.lang === "pt-br" ? "en" : "pt-br");

const username = ref(user.name);
const names = ref([]);
const load = ref(false);

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

function changeName() {
	supabase
		.from("users")
		.update({
			name: "",
		})
		.select("name")
		.then(res => {
			console.log(res);
			console.log(res.data.name);
			return;
			if (res.data) {
				user.data.name = res.data.name;
			}
		});
}

// axios
// 	.get("https://api.jsonbin.io/v3/b/635ca08465b57a31e6a5c573", {
// 		headers: {
// 			"X-Master-Key": "$2b$10$g8uTkz/CtKOOlu4vBB6tZu8gmPlBKO1q9E/ecR9zzsdsb7bKdI/yi",
// 			"X-Access-Key": "$2b$10$YV6SNsQ08.d.WFHzYiET6eJ6SPUjipRjPHbgdEEs2QQdCV3RXg7eC",
// 			"X-Bin-Meta": "false",
// 			"X-JSON-Path": "$..names[55]",
// 		},
// 	})
// 	.then(res => {
// 		console.log(res.data);
// 		names.value = res.data.names;
// 		load.value = true;
// 	});
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
		<div v-if="load">
			<h2>Name</h2>
			<div>
				<input
					type="text"
					name="name"
					id="name"
					v-model="username"
				/>
			</div>
		</div>
		<br />
		<SignOUT />
	</div>
</template>
