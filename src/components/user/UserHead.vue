<script setup lang="ts">
import {url} from "@/stores/images";
import {useUser} from "@/stores/user";

const {picture, name} = useUser();
</script>

<template>
	<div>
		<img
			class="head"
			:src="url(picture, '100')"
			:alt="name"
		/>
	</div>
</template>

<style scoped>
.head {
	max-width: 2.15rem;
	border-radius: 50%;
	cursor: pointer;
}
</style>
