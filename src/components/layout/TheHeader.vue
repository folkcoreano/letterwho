<script setup lang="ts">
import {ref} from "vue";
import {useUser} from "@/stores/user";
import UserHead from "../user/UserHead.vue";
import {RouterLink, useRoute} from "vue-router";

const user = useUser();
const route = useRoute();

function handleRoute(rota: string) {
	return route.path.includes(rota);
}

const isPC = ref(window.matchMedia("(min-width: 35rem)").matches);

window.matchMedia("(min-width: 35rem)").onchange = e => {
	isPC.value = e.matches;
};
</script>

<template>
	<header>
		<div class="logoBlock">
			<RouterLink
				class="logoArea"
				:to="{name: 'home'}"
			>
				<img
					class="logo"
					src="https://ik.imagekit.io/letterwho/logo.svg"
					alt="LetterWHO - Logo"
				/>
			</RouterLink>
			<RouterLink
				v-if="!isPC"
				class="u"
				:to="
					user.logged && user.user ? {name: 'user', params: {id: user.user}} : {name: 'register'}
				"
			>
				<UserHead />
			</RouterLink>
		</div>
		<div class="navArea">
			<RouterLink
				class="u"
				:to="
					user.logged && user.user ? {name: 'user', params: {id: user.user}} : {name: 'register'}
				"
			>
				<UserHead />
			</RouterLink>
			<RouterLink
				:class="handleRoute('audios') ? 'navLink active' : 'navLink'"
				:to="{name: 'audios'}"
				v-text="user.lang === 'pt-br' ? 'ÁUDIOS' : 'AUDIOS'"
			/>
			<RouterLink
				:class="handleRoute('books') ? 'navLink active' : 'navLink'"
				:to="{name: 'books'}"
				v-text="user.lang === 'pt-br' ? 'LIVROS' : 'BOOKS'"
			/>
			<RouterLink
				:class="handleRoute('comics') ? 'navLink active' : 'navLink'"
				:to="{name: 'comics'}"
				v-text="user.lang === 'pt-br' ? 'QUADRINHOS' : 'COMICS'"
			/>
			<RouterLink
				:class="handleRoute('tv') ? 'navLink active' : 'navLink'"
				:to="{name: 'tv'}"
				v-text="'TV'"
			/>
		</div>
	</header>
</template>

<style scoped>
/* * {
	outline: 1px dotted deeppink;
} */
.logoBlock {
	display: flex;
	justify-content: space-between;
}
header {
	padding: 0.45rem 0.65rem;
	background-color: #0f0f0f;
}
.u {
	display: flex;
}
.navArea {
	flex: 1;
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
.logoArea {
	display: flex;
	flex: 0;
}
.logo {
	max-height: 2.35rem;
}
@media (min-width: 35rem) {
	.navArea {
		display: flex;
		justify-self: flex-end;
	}
	header {
		display: grid;
		grid-template-columns: auto 1fr;
	}
}
</style>
