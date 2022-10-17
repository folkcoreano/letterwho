<script setup>
defineProps({
	hoverColor: String,
	state: Boolean,
	type: String,
});
</script>

<template>
	<button
		:disabled="state"
		:type="type"
	>
		<slot />
	</button>
</template>

<style scoped>
button {
	border: none;
	cursor: pointer;
	transition: all 150ms linear;
	background-color: #333;
	font-weight: bold;
	border-radius: 0.2rem;
	padding: 0.5rem 0.8rem;
	user-select: none;
	font-size: 1rem;
	letter-spacing: 0.05rem;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.3rem;
}
button:hover {
	background-color: v-bind(hoverColor);
	transition: all 150ms linear;
	translate: 0 -0.1rem;
}
button:focus {
	background-color: v-bind(hoverColor);
	transition: all 150ms linear;
}
button:active {
	transform: scale(0.95);
	transition: all 150ms linear;
}
button:disabled {
	transition: all 150ms linear;
	background-color: #222;
	border-radius: 0;
	transform: scale(1);
	color: #aaa;
	cursor: not-allowed;
}
</style>
