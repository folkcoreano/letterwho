<script setup lang="ts">
import {folder} from "@/stores/images";
import {useUser} from "@/stores/user";

const {picture, name, id} = useUser();
</script>

<template>
	<RouterLink
		class="user"
		:to="{name: 'user', params: {id}}"
	>
		<div>{{ name }}</div>
		<img
			class="head"
			:src="folder(picture, '100')"
			:alt="name"
		/>
	</RouterLink>
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
