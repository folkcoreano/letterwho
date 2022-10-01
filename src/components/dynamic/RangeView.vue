<script setup lang="ts">
import {useRoute} from "vue-router";

const {
	params: {type, range},
} = useRoute();
</script>

<template>
	<div>{{ type }}/{{ range }}</div>
</template>
