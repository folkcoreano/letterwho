<script setup>
import ConfirmButton from "@/components/buttons/ConfirmButton.vue";
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {names} from "@/stores/names";

const user = useUser();

const name = ref("");

name.value = user.name;

const button = ref(true);

function changeName() {
	button.value = false;
	supabase
		.from("users")
		.update({
			name: name.value,
		})
		.match({id: user.id})
		.select("name")
		.then(res => {
			if (res.data) {
				user.data.name = name.value;
				button.value = true;
			}
		});
}

function shuffleName() {
	name.value = names[Math.floor(Math.random() * names.length)];
}
</script>

<template>
	<div class="sectionName">
		<input
			type="text"
			name="name"
			class="inputName"
			v-model.trim="name"
		/>
		<ConfirmButton
			@click="shuffleName"
			:hoverColor="'var(--blue)'"
		>
			<iconify-icon icon="ri:shuffle-fill" />
		</ConfirmButton>
		<ConfirmButton
			:state="!button || name === '' || name === user.name"
			@click="changeName"
			:hoverColor="'var(--blue)'"
		>
			<iconify-icon icon="ri:send-plane-2-fill" />
		</ConfirmButton>
	</div>
</template>
