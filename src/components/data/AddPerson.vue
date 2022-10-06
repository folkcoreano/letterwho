<script setup>
import supabase from "@/supabase";
import {onErrorCaptured, ref} from "vue";

const crew = ref("");
const id = ref(crew.value.replaceAll(" ", "-"));

function addPerson() {
	supabase
		.from("crew")
		.insert({crew_id: crew.value.toLowerCase().replaceAll(" ", "-"), name: crew.value})
		.then(res => {
			console.log(res);
		});
}

const {data, error} = await supabase.from("crew").select();
</script>

<template>
	<div>
		<input
			type="text"
			v-model.trim="crew"
			name="crew"
			id="crew"
		/>
		<br />
		<button @click="addPerson">add</button>
		<br />
		<p>
			name:
			{{ crew }}
		</p>
		<p>
			id:
			{{ crew.toLowerCase().replaceAll(" ", "-") }}
		</p>
		<br />
		<div v-if="error">
			{{ error.code }}
			{{ error.details }}
			{{ error.hint }}
			{{ error.message }}
		</div>
		<div v-if="data">
			<div v-for="({crew_id, name, birth}, i) in data">{{ name }}: {{ crew_id }}, {{ birth }}</div>
		</div>
	</div>
</template>
