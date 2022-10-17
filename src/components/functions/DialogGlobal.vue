<script setup>
const props = defineProps({
	open: Boolean,
	selfclose: Boolean,
});
</script>

<template>
	<Transition name="dialog">
		<div
			v-if="open"
			class="wrap"
		>
			<dialog
				ref="target"
				:open="open"
			>
				<iconify-icon
					v-if="!selfclose"
					width="30"
					icon="ri:close-circle-fill"
					class="close"
					@click="$emit('close')"
				/>
				<div class="slot">
					<slot />
				</div>
			</dialog>
		</div>
	</Transition>
</template>

<style scoped>
/* * {
  outline: 1px solid rgba(255, 0, 0, 0.5);
} */

.wrap {
	position: fixed;
	z-index: 25;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
}

dialog {
	border: none;
	margin: auto;
	position: fixed;
	max-width: 100%;

	color: #eee;

	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto;
	background-color: unset;
	border-radius: 0.3rem;
}

.close {
	grid-column: 1;
	grid-row: 1;
	place-self: start end;

	position: absolute;

	cursor: pointer;
	color: #5a5a5a;
	transition: all 100ms linear;
}

.close:hover {
	color: var(--red);
	transition: all 100ms linear;
	transform: scale(1.07);
}

.slot {
	max-width: 100%;
	grid-column: 1;
	grid-row: 1;
}

.dialog-enter-active,
.dialog-leave-active {
	transition: all 100ms linear;
}

.dialog-enter-from,
.dialog-leave-to {
	opacity: 0;
}
</style>
