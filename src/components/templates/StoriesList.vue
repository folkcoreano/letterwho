<script setup>
const props = defineProps({
	data: Object,
});
</script>

<template>
	<div>
		<pre>{{ data }}</pre>
	</div>
</template>
