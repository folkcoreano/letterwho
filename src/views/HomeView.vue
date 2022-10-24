<script setup>
import setTitle from "@/stores/title";
import {useUser} from "@/stores/user";
const {id, logged} = useUser();
setTitle("Home");
</script>

<template>
	<div>
		<br />
		<RouterLink
			v-if="logged"
			:to="{name: 'user', params: {id}}"
			>User</RouterLink
		>
		<br />
		<RouterLink
			v-if="false"
			:to="{name: 'profile'}"
			>Profile</RouterLink
		>
		<br />
		<RouterLink :to="{name: 'register'}">Login</RouterLink>
		<br />
		<RouterLink :to="{name: 'persons'}">Pessoas</RouterLink>
		<br />
		<RouterLink :to="{name: 'characters'}">Personagens</RouterLink>
		<br />
		<RouterLink :to="{name: 'quotes'}">Citações</RouterLink>
		<br />
		<RouterLink :to="{name: 'stories'}">Histórias</RouterLink>
	</div>
</template>
