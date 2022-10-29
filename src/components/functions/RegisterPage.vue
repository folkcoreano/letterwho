<script setup>
import {ref} from "vue";
import {useUser} from "@/stores/user";
import {useRoute, useRouter} from "vue-router";
import supabase from "@/supabase";
import setTitle from "@/stores/title";

const user = useUser();

const {push} = useRouter();
setTitle("Register");
const {
	query: {from, id},
} = useRoute();

const response = ref(user.lang === "pt-br" ? "Vamos lá!" : "Let's go!");

const color = ref("var(--blue)");

const credentials = ref({
	email: "",
	password: "",
});

const isPass = ref(false);

async function signUP() {
	const {names, propics} = await import("@/stores/names");

	const random = Math.floor(Math.random() * names.length);

	const randompics = Math.floor(Math.random() * propics.length);

	response.value = user.lang ? "Trabalhando..." : "Working...";

	supabase.auth
		.signUp({
			email: credentials.value.email,
			password: credentials.value.password,
			options: {
				data: {
					beta: true,
					language: "en",
				},
			},
		})
		.then(res => {
			console.log(res);

			if (res.data.user) {
				console.log("user created!");

				supabase
					.from("users")
					.insert({
						name: names[random],
						picture: propics[randompics],
						id: res.data.user.id,
						user: res.data.user.id,
						diary_id: res.data.user.id,
						reviews_id: res.data.user.id,
						likes_id: res.data.user.id,
						comments_id: res.data.user.id,
						follower_id: res.data.user.id,
						following_id: res.data.user.id,
					})
					.then(res => {
						console.log(res);

						console.log("user added to the table!");
						setTimeout(() => {
							if (from === "user") {
								push({name: "user", params: {id}});
							} else {
								push({name: "home"});
							}
						}, 500);
					});
			}
		});
}
</script>

<template>
	<div class="content">
		<form @submit.prevent="signUP">
			<label for="email">
				<span class="label">Email</span>
				<input
					type="email"
					placeholder="email@adress.com"
					autocomplete="new-email"
					name="new-email"
					id="new-email"
					v-model="credentials.email"
					required
				/>
			</label>
			<label for="password">
				<span class="label">Password</span>
				<iconify-icon
					tabindex="0"
					class="ico"
					width="25"
					style="cursor: pointer"
					@click="isPass = !isPass"
					:icon="isPass ? 'ri:eye-line' : 'ri:eye-close-line'"
				/>
				<input
					:type="isPass ? 'text' : 'password'"
					placeholder="password"
					autocomplete="new-password"
					name="new-password"
					id="new-password"
					v-model="credentials.password"
					minlength="6"
					maxlength="10"
					required
				/>
			</label>
			<ConfirmButton
				:hoverColor="color"
				:state="!credentials.email || !credentials.password"
				:type="'submit'"
			>
				<iconify-icon
					width="20"
					icon="ri:login-box-line"
				/>
				{{ response }}
			</ConfirmButton>
		</form>
	</div>
</template>

<style scoped>
* {
	outline: 1px solid rgba(255, 0, 0, 0);
}

.content {
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	border-radius: 0.3rem;

	text-align: center;
	color: #fff;
	align-items: center;
}

form {
	align-items: center;
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
	font-weight: 600;
	max-width: 100%;
	width: 15rem;
	margin: auto;
}

label {
	display: grid;
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto;
	max-width: 100%;
	margin: auto;
}

.label {
	grid-column: 1;
	grid-row: 1;
	place-self: center start;
	user-select: none;
}

.ico {
	grid-column: 1;
	grid-row: 1;
	place-self: center end;
}

input {
	grid-column: 1;
	grid-row: 2;
	user-select: none;

	border-radius: 0.2rem;
	padding: 0.5rem;
	margin: 0.5rem 0.1rem;

	max-width: 100%;

	background: none;
	border: none;

	transition: all 150ms linear;

	font-size: 1rem;
	background-color: #2a2a2a;
	font-weight: 600;
	color: #fff;
}
</style>
