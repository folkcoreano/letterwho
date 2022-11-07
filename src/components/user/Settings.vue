<script setup>
import {useUser} from "@/stores/user";
import {shallowRef} from "vue";
import GeneralSettings from "./settings/GeneralSettings.vue";
import PrivacySettings from "./settings/PrivacySettings.vue";
import UserSettings from "./settings/UserSettings.vue";

const user = useUser();

const tab = shallowRef(UserSettings);
</script>

<template>
	<div class="settings">
		<div class="tabs">
			<div
				@click="tab = UserSettings"
				:style="tab === UserSettings ? 'border-bottom: 2px solid var(--yellow);' : ''"
				class="tab"
			>
				{{ user.lang === "pt-br" ? "Usuário" : "User" }}
			</div>
			<div
				v-if="false"
				@click="tab = PrivacySettings"
				:style="tab === PrivacySettings ? 'border-bottom: 2px solid var(--yellow);' : ''"
				class="tab"
			>
				{{ user.lang === "pt-br" ? "Privacidade" : "Privacy" }}
			</div>
			<div
				@click="tab = GeneralSettings"
				:style="tab === GeneralSettings ? 'border-bottom: 2px solid var(--yellow);' : ''"
				class="tab"
			>
				{{ user.lang === "pt-br" ? "Geral" : "General" }}
			</div>
		</div>
		<div class="content">
			<Transition
				name="comp"
				mode="out-in"
			>
				<!-- <KeepAlive> -->
				<Component :is="tab" />
				<!-- </KeepAlive> -->
			</Transition>
		</div>
	</div>
</template>

<style scoped>
@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}

	.tab {
		text-align: center;
	}
}
</style>
