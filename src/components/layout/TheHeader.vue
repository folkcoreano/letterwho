<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();
function handleRoute(rota: string) {
	return route.path.includes(rota);
}
</script>

<template>
	<header>
		<RouterLink
			tabindex="0"
			class="logoArea"
			to="/"
		>
			<img
				class="logo"
				src="https://ik.imagekit.io/letterwho/logo.svg"
				alt="LetterWHO - Logo"
			/>
		</RouterLink>
		<div class="navArea">
			<RouterLink
				tabindex="0"
				:class="handleRoute('audios') ? 'navLink active' : 'navLink'"
				to="/audios"
				>AUDIOS</RouterLink
			>
			<RouterLink
				:class="handleRoute('books') ? 'navLink active' : 'navLink'"
				to="/books"
				>BOOKS</RouterLink
			>
			<RouterLink
				:class="handleRoute('comics') ? 'navLink active' : 'navLink'"
				to="/comics"
				>COMICS</RouterLink
			>
			<RouterLink
				:class="handleRoute('tv') ? 'navLink active' : 'navLink'"
				to="/tv"
				>TV</RouterLink
			>
		</div>
	</header>
</template>

<style scoped>
/* * {
	outline: 1px dotted deeppink;
} */

.navArea {
	display: none;
	align-items: center;
	gap: 1rem;
	font-size: 1.055rem;
}

.navLink {
	padding: 0.3rem;
	font-weight: bold;
	transition: all 150ms linear;
	border-bottom: 3px solid transparent;
	color: #9f9f9f;
	translate: 0 0.1rem;
}
.navLink:hover {
	transition: all 150ms linear;
	color: #fff;
	text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.8);
}
.active {
	border-bottom: 3px solid #eee;
	transition: all 150ms linear;
	color: #eee;
	translate: 0 0;
}

header {
	display: flex;
	justify-content: space-between;
	padding: 0.5rem;
}

.logoArea {
	display: flex;
}
.logo {
	max-height: 2.35rem;
}

@media (min-width: 35rem) {
	.navArea {
		display: flex;
	}
}
</style>
