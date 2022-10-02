<script setup lang="ts">
import {useRoute} from "vue-router";

const route = useRoute();

function handleRoute(rota: string) {
	return route.path.includes(rota);
}
</script>

<template>
	<section>
		<RouterLink
			to="/"
			class="footerLink"
			:class="route.name === 'home' ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:home-2-' + (route.name === 'home' ? 'fill' : 'line')"
			/>
		</RouterLink>
		<RouterLink
			to="/audios"
			:class="handleRoute('audios') ? 'footerLink active' : 'footerLink'"
			class="footerLink"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:headphone-' + (handleRoute('audios') ? 'fill' : 'line')"
			/>
		</RouterLink>
		<RouterLink
			to="/books"
			class="footerLink"
			:class="handleRoute('books') ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:file-list-3-' + (handleRoute('books') ? 'fill' : 'line')"
			/>
		</RouterLink>
		<RouterLink
			to="/comics"
			:class="handleRoute('comics') ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:book-mark-' + (handleRoute('comics') ? 'fill' : 'line')"
			/>
		</RouterLink>
		<RouterLink
			to="/tv"
			:class="handleRoute('tv') ? 'footerLink active' : 'footerLink'"
		>
			<iconify-icon
				class="footerIcon"
				:icon="'ri:tv-' + (handleRoute('tv') ? 'fill' : 'line')"
			/>
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
}

.footerLink {
	display: flex;
	padding: 0.5rem;
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
