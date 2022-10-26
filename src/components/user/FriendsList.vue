<script setup>
import {folder} from "@/stores/images";

const props = defineProps({
	data: Object,
});
</script>

<template>
	<div class="persons">
		<router-link
			:to="{name: 'user', params: {id}}"
			:key="i"
			v-for="({id, name, picture}, i) in data"
			class="person"
		>
			<div class="side">
				<img
					class="icon"
					:src="folder(picture, '100')"
					:alt="name"
				/>
			</div>
			<div class="side">{{ name }}</div>
		</router-link>
	</div>
</template>

<style scoped>
.persons {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}

.person {
	display: flex;
	align-items: center;
	gap: 0.35rem;
}

.icon {
	display: flex;
	border-radius: 50%;
	max-width: 3.5rem;
}
</style>
