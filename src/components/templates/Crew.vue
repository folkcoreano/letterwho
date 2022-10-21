<script setup>
import {RouterLink} from "vue-router";

const props = defineProps({
	data: Object,
});

const crew = props.data.filter(e => e.type === "CREW");
const character = props.data.filter(e => e.type === "CHARACTER");

const joined = [...character, ...crew];
</script>

<template>
	<div class="main">
		<div class="crewList">
			<div
				:key="i"
				v-for="({person, role, tab}, i) in joined"
			>
				<RouterLink
					class="crewName"
					:to="{
						name: 'person',
						params: {id: person.url},
						query: {tab: !role.url ? role.name : tab},
					}"
				>
					{{ person.name }} </RouterLink
				>:
				<RouterLink
					class="crewRole"
					v-if="role.url"
					:to="{name: 'character', params: {id: role.url}}"
				>
					{{ role.name }}
				</RouterLink>
				<span
					v-if="!role.url"
					class="crewRole"
				>
					{{ role.name }}
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
.crewList {
	display: flex;
	flex-flow: column;
	gap: 0.35rem;
}
.crewName {
	font-weight: bold;
}
a {
	border-bottom: 1px solid transparent;
}
a:hover {
	border-bottom: 1px solid #888;
}
</style>
