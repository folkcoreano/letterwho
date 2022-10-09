<script setup>
import setTitle from "@/stores/title";

setTitle("Home");
</script>

<template>
	<div>
		Home!
		<br />
		<RouterLink :to="{name: 'persons'}">Pessoas</RouterLink>
		<br />
		<RouterLink :to="{name: 'characters'}">Personagens</RouterLink>
		<br />
		<RouterLink :to="{name: 'quotes'}">Citações</RouterLink>
		<br />
		<RouterLink :to="{name: 'search'}">Busca</RouterLink>
	</div>
</template>
