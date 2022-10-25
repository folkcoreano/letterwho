<script setup lang="ts">
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";

const {picture, name, logged} = useUser();
</script>

<template>
	<div class="user">
		<div v-if="logged">{{ name }}</div>
		<div v-else>Login</div>
		<img
			v-if="logged"
			class="head"
			:src="folder(picture, '100')"
			:alt="name"
		/>
		<img
			v-else
			class="head"
			:src="folder('E', '100')"
			:alt="'Login'"
		/>
	</div>
</template>

<style scoped>
.head {
	max-width: 2.15rem;
	border-radius: 50%;
	cursor: pointer;
}

.user {
	display: flex;
	flex-flow: row;
	gap: 0.45rem;
	align-items: center;
}
</style>
