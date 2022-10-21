<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const props = defineProps({
	user: Object,
});

const {push, back} = useRouter();

const {
	query: {from, id},
} = useRoute();

const email = ref();

const password = ref();

const isPass = ref(false);

const color = ref("var(--blue)");

const response = ref(props.user.lang ? "Deixa eu entrar!" : "Let me in!");

async function login() {
	const {getAuth, signInWithEmailAndPassword} = await import("firebase/auth");

	const auth = getAuth();

	response.value = props.user.lang ? "Trabalhando..." : "Working...";

	signInWithEmailAndPassword(auth, email.value, password.value)
		.then(() => {
			response.value = props.user.lang ? "Sucesso!" : "Success!";

			setTimeout(() => {
				if (from === "user") {
					push({name: "user", params: {id: id}});
				} else {
					back();
				}
			}, 500);
		})
		.catch(() => {
			response.value = props.user.lang ? "Erro!" : "Error!";
		})
		.finally(() => {});
}
</script>

<template>
	<div class="content">
		<form>
			<label for="email">
				<span class="label"> Email </span>
				<input
					type="email"
					placeholder="email@adress.com"
					autocomplete="current-email"
					name="current-email"
					id="current-email"
					v-model="email"
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
					autocomplete="current-password"
					name="current-password"
					id="current-password"
					v-model="password"
					minlength="6"
					maxlength="10"
				/>
			</label>
			<ConfirmButton
				:hoverColor="color"
				:state="!email || !password"
				@click.prevent="login"
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
