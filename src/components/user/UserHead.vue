<script setup lang="ts">
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";

const user = useUser();
</script>

<template>
	<div class="user">
		<div v-if="user.logged && user.name">{{ user.name }}</div>
		<div v-else>Login</div>
		<img
			v-if="user.logged && user.name && user.picture"
			class="head"
			:src="folder(user.picture, '100')"
			:alt="user.name"
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
