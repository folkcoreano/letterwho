<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref} from "vue";
import {useRouter} from "vue-router";

const {push} = useRouter();

const user = useUser();

const buttonState = ref("LOGOUT");

async function getOut() {
	supabase.auth.signOut().then(res => {
		user.data.logged = false;
		user.data.id = "";
		user.data.email = "";
		user.data.created = "";
		user.data.language = "en";
		user.data.name = "";
		user.data.picture = "";

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
