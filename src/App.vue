<script setup>
import {ref, onMounted, watchEffect} from "vue";
import supabase from "@/supabase";
import {useUser} from "@/stores/user";
import {RouterLink, RouterView} from "vue-router";

const init = ref(false);

const user = useUser();

const {lang} = useUser();

const data = ref();

onMounted(() => {
	console.log("mounted");

	supabase.auth.getSession().then(res => {
		console.log("check session");

		if (res.data.session) {
			console.log("has session");

			// let fold = {
			// 	logged: true,
			// 	id: res.data.session.user.id,
			// 	language: res.data.session.user.user_metadata.language,
			// 	created: res.data.session.user.created_at,
			// 	email: res.data.session.user.email ? res.data.session.user.email : "",
			// };

			user.data.logged = true;
			user.data.id = res.data.session.user.id;
			user.data.email = res.data.session.user.email ? res.data.session.user.email : "";
			user.data.created = res.data.session.user.created_at;
			user.data.language = res.data.session.user.user_metadata.language;

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
						user.data.name = res.data.name;
						user.data.picture = res.data.picture;

						// let file = {
						// 	name: res.data.name,
						// 	picture: res.data.picture,
						// };

						// user.data = {
						// 	...fold,
						// 	...file,
						// };

						init.value = true;
					} else {
						init.value = true;
					}
				});
		} else {
			console.log("no session");

			user.data = {
				logged: false,
				language: "en",
				id: "",
				name: "",
				email: "",
				picture: "",
				created: "",
			};

			// user.logged = false;
			// user.id = "";
			// user.email = "";
			// user.created = "";
			// user.lang = "en";
			// user.name = "";
			// user.picture = "";

			init.value = true;
		}
	});
	watchEffect(async () => {
		console.log("watching");
		supabase.auth.onAuthStateChange((e, s) => {
			if (e === "USER_UPDATED") {
				console.log(e);

				// user.data = {
				// 	logged: true,
				// 	id: s.user.id,
				// 	email: s.user.email ? s.user.email : "",
				// 	created: s.user.created_at,
				// 	language: s.user.user_metadata.language,
				// };

				user.data.logged = true;
				user.data.id = s.user.id;
				user.data.email = s.user.email ? s.user.email : "";
				user.data.created = s.user.created_at;
				user.data.language = s.user.user_metadata.language;
			}

			if (e === "SIGNED_IN") {
				console.log(e);
				// user.data = {
				// 	logged: true,
				// 	id: s.user.id,
				// 	email: s.user.email ? s.user.email : "",
				// 	created: s.user.created_at,
				// 	language: s.user.user_metadata.language,
				// };

				user.data.logged = true;
				user.data.id = s.user.id;
				user.data.email = s.user.email ? s.user.email : "";
				user.data.created = s.user.created_at;
				user.data.language = s.user.user_metadata.language;
			}

			if (e === "SIGNED_OUT") {
				console.log(e);

				user.data = {
					logged: false,
					language: "en",
					id: "",
					name: "",
					email: "",
					picture: "",
					created: "",
				};
			}

			if (e === "TOKEN_REFRESHED") {
				console.log(e);

				// user.data = {
				// 	logged: true,
				// 	id: s.user.id,
				// 	email: s.user.email ? s.user.email : "",
				// 	created: s.user.created_at,
				// 	language: s.user.user_metadata.language,
				// };

				user.data.logged = true;
				user.data.id = s.user.id;
				user.data.email = s.user.email ? s.user.email : "";
				user.data.created = s.user.created_at;
				user.data.language = s.user.user_metadata.language;
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
