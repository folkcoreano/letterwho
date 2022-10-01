<script setup lang="ts">
import {watchEffect} from "@vue/runtime-core";
import {useHead} from "@vueuse/head";
import {ref} from "vue";
import {RouterLink, RouterView} from "vue-router";

const init = ref(false);

useHead({
	title: "LetterWHO",
	meta: [
		{
			name: "title",
			content: "LetterWHO",
		},
		{
			name: "og:title",
			content: "LetterWHO",
		},
		{
			name: "twitter:title",
			content: "LetterWHO",
		},
		{
			name: "description",
			content: "Hey there!!!",
		},
		{
			name: "og:description",
			content: "Hey there!!!",
		},
		{
			name: "twitter:description",
			content: "Hey there!!!",
		},
		{
			name: "twitter:site",
			content: "@letterwho",
		},
		{
			name: "twitter:card",
			content: "summary",
		},
	],
});

watchEffect(async () => {
	const {getAuth, onAuthStateChanged} = await import("@firebase/auth");

	const auth = getAuth();

	onAuthStateChanged(auth, async res => {
		if (res) {
			console.log(res.uid);
			console.log(":D");
			init.value = true;
		} else {
			console.log(":p");
			init.value = true;
		}
	});
});
</script>

<template>
	<template v-if="init">
		<TheHeader />
		<main>
			<RouterView v-slot="{Component}">
				<transition
					name="route"
					mode="out-in"
				>
					<component :is="Component" />
				</transition>
			</RouterView>
		</main>
		<TheFooter id="foot" />
	</template>
	<template v-else>
		<MainState />
	</template>
</template>
