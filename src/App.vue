<script setup>
import {ref, onMounted, watchEffect} from "vue";
import supabase from "@/supabase";
import {useUser} from "@/stores/user";
import {RouterLink, RouterView} from "vue-router";

const init = ref(false);

const user = useUser();

const {lang} = useUser();

onMounted(() => {
	console.log("mounted");
	supabase.auth.getSession().then(res => {
		console.log("check session");
		if (res.data.session) {
			console.log("has session");
			user.logged = true;

			user.id = res.data.session.user.id;
			user.email = res.data.session.user.email ? res.data.session.user.email : "";
			user.created = res.data.session.user.created_at;
			user.lang = res.data.session.user.user_metadata.language;

			if (res.data.session.user.user_metadata.language === "pt-br") {
				document.documentElement.setAttribute("lang", "pt-BR");
			}

			if (res.data.session.user.user_metadata.language === "en") {
				document.documentElement.setAttribute("lang", "en");
			}

			supabase
				.from("users")
				.select()
				.limit(1)
				.single()
				.match({id: res.data.session.user.id})
				.then(res => {
					if (res.data) {
						user.name = res.data.name;
						user.picture = res.data.picture;
						init.value = true;
					} else {
						init.value = true;
					}
				});
		} else {
			console.log("no session");
			localStorage.clear();
			user.logged = false;
			user.id = "";
			user.email = "";
			user.created = "";
			user.lang = "en";
			user.name = "";
			user.picture = "";

			init.value = true;
		}
	});
	watchEffect(async () => {
		console.log("watching");
		supabase.auth.onAuthStateChange((e, s) => {
			if (e === "USER_UPDATED" && s) {
				console.log(e);
				user.logged = true;
				user.id = s.user.id;
				user.email = s.user.email ? s.user.email : "";
				user.created = s.user.created_at;
				user.lang = s.user.user_metadata.language;
			}

			if (e === "SIGNED_IN" && s) {
				console.log(e);
				user.logged = true;
				user.id = s.user.id;
				user.email = s.user.email ? s.user.email : "";
				user.created = s.user.created_at;
				user.lang = s.user.user_metadata.language;
			}

			if (e === "SIGNED_OUT") {
				console.log(e);
				localStorage.clear();
				user.logged = false;
				user.id = "";
				user.email = "";
				user.created = "";
				user.lang = "en";
				user.name = "";
				user.picture = "";
			}

			if (e === "TOKEN_REFRESHED" && s) {
				console.log(e);
				user.logged = true;
				user.id = s.user.id;
				user.email = s.user.email ? s.user.email : "";
				user.created = s.user.created_at;
				user.lang = s.user.user_metadata.language;
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
