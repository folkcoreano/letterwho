<script setup>
import setTitle from "@/stores/title";
setTitle("Home");
</script>

<template>
	<div>
		<br />
		<RouterLink :to="{name: 'profile'}">Profile</RouterLink>
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
