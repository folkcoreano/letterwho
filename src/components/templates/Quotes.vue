<script setup>
import {useUser} from "@/stores/user";

const props = defineProps({
	data: Object,
});

const {lang} = useUser();
</script>

<template>
	<div class="quotes">
		<div
			class="quote"
			v-for="({en, pt, character_id}, i) in data"
			:key="i"
		>
			<q>
				{{ lang === "pt-br" ? pt : en }}
			</q>
			<i> {{ character_id ? character_id.name : "" }}</i>
		</div>
	</div>
</template>

<style scoped>
.quote i {
	color: #ccc;
}

.quote q {
	font-weight: bold;
}

.quote {
	display: flex;
	flex-flow: column;
	align-items: flex-start;
	gap: 0.15rem;
}

.quotes {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
</style>
