<script setup>
import supabase from "@/supabase";
import {ref} from "vue";
import {useRouter} from "vue-router";

const {push} = useRouter();

const buttonState = ref("LOGOUT");

async function getOut() {
	supabase.auth.signOut().then(res => {
		localStorage.clear();
		console.log(res);
		push({name: "home"});
	});
}
</script>

<template>
	<ConfirmButton
		:hoverColor="'var(--red)'"
		@click.prevent="getOut"
	>
		<iconify-icon
			width="20"
			icon="ri:logout-box-r-line"
		/>
		{{ buttonState }}
	</ConfirmButton>
</template>
