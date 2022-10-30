<script setup lang="ts">
import {shallowRef} from "vue";
import {useUser} from "@/stores/user";
import LoginPage from "@/components/functions/LoginPage.vue";
import RegisterPage from "@/components/functions/RegisterPage.vue";

const user = useUser();
const tab = shallowRef(LoginPage);
</script>

<template>
	<div class="register">
		<div class="tabs">
			<div
				@click="tab = LoginPage"
				:style="tab === LoginPage ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'"
				class="tab"
			>
				{{ user.lang ? "Entrar" : "Login" }}
			</div>
			<div
				@click="tab = RegisterPage"
				:style="
					tab === RegisterPage ? 'border-bottom: 2px solid var(--yellow);flex: 1;' : 'flex: 1;'
				"
				class="tab"
			>
				{{ user.lang ? "Criar conta" : "Create an account" }}
			</div>
		</div>
		<div class="actab">
			<Transition
				name="comp"
				mode="out-in"
			>
				<KeepAlive>
					<Component :is="tab"> </Component>
				</KeepAlive>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.register {
	max-width: 35rem;
	margin: auto;
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}

	.tab {
		text-align: center;
	}
}
</style>
