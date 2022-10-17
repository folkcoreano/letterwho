<script setup>
import LoginPage from "@/components/functions/LoginPage.vue";
import {useUser} from "@/stores/user";
import RegisterPage from "@/components/functions/RegisterPage.vue";
import {ref} from "vue";

import SignOUT from "@/components/functions/SignOUT.vue";

const {lang, logged} = useUser();

const user = useUser();

const tab = ref(0);
</script>

<template>
	<div>
		<SignOUT v-if="logged" />
		<div
			class="register"
			v-if="!logged"
		>
			<div class="choices">
				<span
					:class="tab == 0 ? 'tab active' : 'tab'"
					tabindex="0"
					@click="tab = 0"
				>
					{{ lang ? "Entrar" : "Login" }}
				</span>
				<span
					:class="tab == 1 ? 'tab active' : 'tab'"
					tabindex="0"
					@click="tab = 1"
				>
					{{ lang ? "Criar conta" : "Create an account" }}
				</span>
			</div>
			<LoginPage
				v-if="tab == 0"
				:user="user"
			/>
			<RegisterPage v-if="tab == 1" />
		</div>
	</div>
</template>

<style scoped>
* {
	outline: 1px dotted rgba(255, 20, 145, 0);
}

.choices {
	display: flex;
	gap: 1rem;
}

.register {
	display: flex;
	flex-flow: column;
	gap: 1rem;
	max-width: 35rem;
	margin: auto;
}

.tab {
	flex: 1;
	font-weight: bold;
	padding: 0.5rem;
	cursor: pointer;
	border: 0.001rem solid #333;
	border-radius: 0.3rem;
	text-align: center;
	background-color: #111;
	color: #aaa;
	transition: all 150ms linear;
	display: flex;
	align-items: center;
	justify-content: center;
}

.active {
	transition: all 150ms linear;
	color: #eee;
	background-color: #2f2f2f;
	border: 0.001rem solid #444;
}
</style>
