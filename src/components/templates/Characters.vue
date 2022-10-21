<script setup>
import {char} from "@/stores/images";
import {RouterLink} from "vue-router";

const props = defineProps({
	data: Object,
});

const doctor = props.data.filter(e => e.role === "Doctor");
const companion = props.data.filter(e => e.role === "Companion");
const character = props.data.filter(e => e.role === "Character");
const featuring = props.data.filter(e => e.role === "Featuring");
const enemy = props.data.filter(e => e.role === "Enemy");

const joined = [...doctor, ...companion, ...character, ...featuring, ...enemy];

function checkRole(role) {
	if (role === "Doctor") {
		return "var(--yellow)";
	}
	if (role === "Companion") {
		return "var(--green)";
	}
	if (role === "Character") {
		return "var(--blue)";
	}
	if (role === "Featuring") {
		return "var(--purple)";
	}
	if (role === "Enemy") {
		return "var(--red)";
	}
}
</script>

<template>
	<div class="main">
		<div class="charsList">
			<RouterLink
				:to="{name: 'character', params: {id: character_id.character_id}}"
				v-for="({character_id, role}, i) in joined"
				:key="i"
				class="charItem"
			>
				<img
					:style="`border: 3px solid ${checkRole(role)}`"
					class="charIcon"
					:src="char(`p/${character_id.character_id}`, '50')"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
.main {
	padding: 0.25rem 0;
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}

.charIcon {
	max-width: 3.55rem;
	border-radius: 50%;
}

.charsList {
	display: flex;
	overflow: auto;
	gap: 0.55rem;
	padding: 0.25rem 0;
	font-size: 0.85rem;
}
.charItem {
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: space-between;
	width: 4.55rem;
	gap: 0.5rem;
}

.charItem span {
	text-overflow: ellipsis;
	text-align: center;
	max-height: 2rem;
	overflow: hidden;
	max-width: 4.85rem;
}
</style>
