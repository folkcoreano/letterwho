<script setup lang="ts">
import {useUser} from "@/stores/user";
import {useRoute} from "vue-router";

const route = useRoute();

const user = useUser();

function handleRoute(rota: string) {
	return route.path.includes(rota);
}
</script>

<template>
	<section>
		<RouterLink
			:to="{name: 'home'}"
			class="footerLink"
			:class="route.name === 'home' ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:home-2-' + (route.name === 'home' ? 'fill' : 'line')"
			/>
			<div
				v-show="route.name === 'home'"
				class="title"
			>
				Home
			</div>
		</RouterLink>
		<RouterLink
			:to="{name: 'audios'}"
			:class="handleRoute('audios') ? 'footerLink active' : 'footerLink'"
			class="footerLink"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:headphone-' + (handleRoute('audios') ? 'fill' : 'line')"
			/>
			<div
				v-show="handleRoute('audios')"
				class="title"
			>
				{{ user.lang === "pt-br" ? "Áudios" : "Audios" }}
			</div>
		</RouterLink>
		<RouterLink
			:to="{name: 'books'}"
			class="footerLink"
			:class="handleRoute('books') ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:file-list-3-' + (handleRoute('books') ? 'fill' : 'line')"
			/>
			<div
				v-show="handleRoute('books')"
				class="title"
			>
				{{ user.lang === "pt-br" ? "Livros" : "Books" }}
			</div>
		</RouterLink>
		<RouterLink
			:to="{name: 'comics'}"
			:class="handleRoute('comics') ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:book-mark-' + (handleRoute('comics') ? 'fill' : 'line')"
			/>
			<div
				v-show="handleRoute('comics')"
				class="title"
			>
				{{ user.lang === "pt-br" ? "HQs" : "Comics" }}
			</div>
		</RouterLink>
		<RouterLink
			:to="{name: 'tv'}"
			:class="handleRoute('tv') ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:tv-' + (handleRoute('tv') ? 'fill' : 'line')"
			/>
			<div
				v-show="handleRoute('tv')"
				class="title"
			>
				TV
			</div>
		</RouterLink>
	</section>
</template>

<style scoped>
* {
	outline: 0px dotted red;
}
section {
	display: flex;
	gap: 0.25rem;
	justify-content: space-around;
	overflow: auto;
	background-color: #0f0f0f;
}
.title {
	font-size: 0.85rem;
	font-weight: bold;
}
.footerLink {
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
	padding: 0.35rem 0;
	flex: 1;
	cursor: pointer;
	transition: all 150ms ease;
	color: #888;
}
.footerLink:hover {
	translate: 0 -0.25rem;
	transition: all 150ms ease;
	color: var(--yellow);
}
.active {
	translate: 0 -0.25rem;
	transition: all 150ms ease;
	color: var(--yellow);
}
.footerIcon {
	font-size: 2.15rem;
}
</style>
