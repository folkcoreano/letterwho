<script setup>
import LoginPage from "@/components/functions/LoginPage.vue";
import {useUser} from "@/stores/user";
import RegisterPage from "@/components/functions/RegisterPage.vue";
import {ref, shallowRef} from "vue";

import SignOUT from "@/components/functions/SignOUT.vue";

const {lang, logged} = useUser();

const user = useUser();

const tab = ref(0);
const activeTab = shallowRef(LoginPage);

function changeTab(n) {
	tab.value = n;
	if (n === 0) {
		activeTab.value = LoginPage;
	}
	if (n === 1) {
		activeTab.value = RegisterPage;
	}
}
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
					@click="changeTab(0)"
				>
					{{ lang ? "Entrar" : "Login" }}
				</span>
				<span
					:class="tab == 1 ? 'tab active' : 'tab'"
					@click="changeTab(1)"
				>
					{{ lang ? "Criar conta" : "Create an account" }}
				</span>
			</div>
			<keep-alive>
				<component
					:user="user"
					:is="activeTab"
				></component>
			</keep-alive>
		</div>
	</div>
</template>

<style scoped>
/* * {
	outline: 1px dotted rgba(255, 20, 145, 0);
} */
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
