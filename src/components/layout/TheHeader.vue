<script setup lang="ts">
import UserHead from "../user/UserHead.vue";
import {useUser} from "@/stores/user";
import {useRoute} from "vue-router";

const {lang, logged} = useUser();

const route = useRoute();

function handleRoute(rota: string) {
	return route.path.includes(rota);
}
</script>

<template>
	<header>
		<RouterLink
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
			<UserHead v-if="logged" />
			<RouterLink
				:class="handleRoute('audios') ? 'navLink active' : 'navLink'"
				to="/audios"
				v-text="lang === 'pt-br' ? 'ÁUDIOS' : 'AUDIOS'"
			/>
			<RouterLink
				:class="handleRoute('books') ? 'navLink active' : 'navLink'"
				to="/books"
				v-text="lang === 'pt-br' ? 'LIVROS' : 'BOOKS'"
			/>
			<RouterLink
				:class="handleRoute('comics') ? 'navLink active' : 'navLink'"
				to="/comics"
				v-text="lang === 'pt-br' ? 'QUADRINHOS' : 'COMICS'"
			/>
			<RouterLink
				:class="handleRoute('tv') ? 'navLink active' : 'navLink'"
				to="/tv"
				v-text="'TV'"
			/>
		</div>
	</header>
</template>

<style scoped>
* {
	outline: 0px dotted deeppink;
}

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
}
.navLink:hover {
	translate: 0 0.1rem;
	transition: all 150ms linear;
	color: #fff;
	text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.8);
}
.active {
	border-bottom: 3px solid #eee;
	transition: all 150ms linear;
	color: #eee;
	translate: 0 -0.1rem;
}

header {
	display: flex;
	justify-content: space-between;
	padding: 0.65rem;

	overflow: auto;
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
