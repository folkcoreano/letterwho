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
		<div
			class="logoArea"
			style="font-weight: bold"
		>
			LETTER<span style="font-style: italic; color: var(--yellow)">WHO</span>
		</div>
		<div class="sideArea">
			<div class="navIcons">
				<iconify-icon icon="akar-icons:search" />
				<iconify-icon icon="akar-icons:home" />
				<iconify-icon icon="akar-icons:computing" />
				<iconify-icon icon="akar-icons:person" />
				<iconify-icon icon="akar-icons:bell" />
			</div>
			<div class="profileArea"></div>
			<div class="addArea"></div>
		</div>
	</header>
</template>

<style scoped>
/* * {
	outline: 1px dotted deeppink;
} */

@media (min-width: 35rem) {
}
</style>
