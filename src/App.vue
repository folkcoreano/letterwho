<script setup>
import {ref, onBeforeMount, watchEffect} from "vue";
import supabase from "@/supabase";
import {useUser} from "@/stores/user";
import {RouterView} from "vue-router";
import {useTime} from "./stores/time";

const init = ref(false);

const user = useUser();

onBeforeMount(() => {
	// console.log("mounted");

	supabase.auth.getSession().then(res => {
		// console.log("check session");

		if (res.data.session) {
			// console.log("has session");

			user.data.id = res.data.session.user.id;
			user.data.email = res.data.session.user.email ? res.data.session.user.email : null;
			user.data.created = res.data.session.user.created_at;
			user.data.language = res.data.session.user.user_metadata.language;
			user.data.logged = true;

			if (res.data.session.user.user_metadata.language === "pt-br") {
				document.documentElement.setAttribute("lang", "pt-BR");
			}

			if (res.data.session.user.user_metadata.language === "en") {
				document.documentElement.setAttribute("lang", "en");
			}

			supabase
				.from("users")
				.select("id,name,picture,user")
				.limit(1)
				.single()
				.match({id: res.data.session.user.id})
				.then(res => {
					if (res.data) {
						user.data.user = res.data.user;
						user.data.name = res.data.name;
						user.data.picture = res.data.picture;

						init.value = true;
					} else {
						init.value = true;
					}
				});
		} else {
			console.log("no session");

			user.data.language = "en";
			user.data.id = null;
			user.data.name = null;
			user.data.user = null;
			user.data.email = null;
			user.data.picture = null;
			user.data.created = null;
			user.data.logged = false;

			init.value = true;
		}
	});

	watchEffect(async () => {
		// console.log("watching");
		supabase.auth.onAuthStateChange(async (e, s) => {
			if (e === "USER_UPDATED" && s) {
				// console.log(e);

				user.data.id = s.user.id;
				user.data.email = s.user.email ? s.user.email : null;
				user.data.created = s.user.created_at;
				user.data.language = s.user.user_metadata.language;
				user.data.logged = true;
			}

			if (e === "SIGNED_IN" && s) {
				// console.log(e);

				user.data.id = s.user.id;
				user.data.email = s.user.email ? s.user.email : null;
				user.data.created = s.user.created_at;
				user.data.language = s.user.user_metadata.language;

				if (!user.name && !user.picture) {
					supabase
						.from("users")
						.select("id,name,picture,user")
						.limit(1)
						.single()
						.match({id: s.user.id})
						.then(res => {
							user.data.user = res.data.user;
							user.data.name = res.data.name;
							user.data.picture = res.data.picture;
						});
				}

				user.data.logged = true;
			}

			if (e === "SIGNED_OUT") {
				// console.log(e);

				user.data.language = "en";
				user.data.id = null;
				user.data.user = null;
				user.data.name = null;
				user.data.email = null;
				user.data.picture = null;
				user.data.created = null;
				user.data.logged = false;
			}

			if (e === "TOKEN_REFRESHED" && s) {
				// console.log(e);
			}
		});
	});
});
</script>

<template>
	<template v-if="init">
		<TheHeader />
		<main>
			<RouterView v-slot="{Component}">
				<Transition
					name="route"
					mode="out-in"
				>
					<Component :is="Component"></Component>
				</Transition>
			</RouterView>
		</main>
		<TheFooter id="foot" />
	</template>
	<template v-else>
		<MainState />
	</template>
</template>
