<script setup lang="ts">
import {watchEffect} from "@vue/runtime-core";
import {ref} from "vue";
import {RouterLink, RouterView} from "vue-router";
import {useUser} from "@/stores/user";

const init = ref(false);

const user = useUser();

watchEffect(async () => {
	const {getAuth, onAuthStateChanged} = await import("firebase/auth");

	const auth = getAuth();

	onAuthStateChanged(auth, async res => {
		if (res) {
			user.logged = true;

			const {getDoc, doc, getFirestore} = await import("firebase/firestore");

			const db = getFirestore();

			const query = doc(db, "users", res.uid);

			user.data = {
				data: res,
				email: res.email,
			};

			user.id = res.uid;

			getDoc(query).then(res => {
				let document;
				if (res.exists()) {
					document = res.data();

					user.info = {
						name: document.name,
						created: document.created,
						picture: document.picture,
						lang: document.lang,
					};
				} else {
					console.log("no data :(");
				}
			});

			init.value = true;
		} else {
			user.info = {
				name: "nobody",
				created: "sla",
				lang: "en",
				picture: "aa",
			};
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
