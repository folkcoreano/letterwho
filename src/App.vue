<script setup>
import {ref, onMounted} from "vue";
import supabase from "@/supabase";
import {useUser} from "@/stores/user";
import {watchEffect} from "@vue/runtime-core";
import {RouterLink, RouterView} from "vue-router";

const init = ref(true);

const user = useUser();

const {lang} = useUser();

function checkUser() {
	supabase.auth.getUser().then(res => {
		if (res.data.user) {
			user.logged = true;
			user.id = res.data.user.id;
			user.email = res.data.user.email ? res.data.user.email : "";
			user.created = res.data.user.created_at;
			user.lang = res.data.user.user_metadata.language;
			supabase
				.from("users")
				.select()
				.limit(1)
				.single()
				.match({id: res.data.user.id})
				.then(res => {
					if (res.data) {
						user.name = res.data.name;
						user.picture = res.data.picture;
					}
				});

			if (res.data.user.user_metadata.language === "pt-br") {
				document.documentElement.setAttribute("lang", "pt-BR");
			}

			if (res.data.user.user_metadata.language === "en") {
				document.documentElement.setAttribute("lang", "en");
			}
		} else {
			user.logged = false;
			user.id = "";
			user.email = "";
			user.created = "";
			user.lang = "en";
			user.name = "";
			user.picture = "";
		}

		if (res.error) {
		}
	});
}

watchEffect(async () => {
	supabase.auth.onAuthStateChange((e, s) => {
		if (e === "USER_UPDATED" && s) {
			user.logged = true;
			user.id = s.user.id;
			user.email = s.user.email ? s.user.email : "";
			user.created = s.user.created_at;
			user.lang = s.user.user_metadata.language;
		}

		if (e === "SIGNED_IN" && s) {
			user.logged = true;
			user.id = s.user.id;
			user.email = s.user.email ? s.user.email : "";
			user.created = s.user.created_at;
			user.lang = s.user.user_metadata.language;
		}

		if (e === "SIGNED_OUT") {
			user.logged = false;
			user.id = "";
			user.email = "";
			user.created = "";
			user.lang = "en";
			user.name = "";
			user.picture = "";
		}

		if (e === "TOKEN_REFRESHED" && s) {
			user.logged = true;
			user.id = s.user.id;
			user.email = s.user.email ? s.user.email : "";
			user.created = s.user.created_at;
			user.lang = s.user.user_metadata.language;
		}
	});
});

onMounted(() => {
	checkUser();
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
