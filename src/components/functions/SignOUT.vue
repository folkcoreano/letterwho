<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";

const {push} = useRouter();

const buttonState = ref("LOGOUT");

async function getOut() {
	const {getAuth, signOut} = await import("firebase/auth");

	const auth = getAuth();

	signOut(auth)
		.then(res => {
			push({name: "home"});
			console.log(res);
		})
		.catch(error => {
			console.log(error);
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
