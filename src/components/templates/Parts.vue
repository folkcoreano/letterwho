<script setup>
import {folder} from "@/stores/images";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	data: Object,
});

const {
	params: {type, range},
} = useRoute();

const data = ref(props.data);
</script>

<template>
	<div class="parts">
		<div
			class="part"
			v-for="({story, title, released, length}, i) in data"
			:key="i"
		>
			<div class="partCoverBox">
				<img
					class="partCover"
					:src="folder(type + '/' + range + '/' + story, '50')"
					:alt="title"
				/>
			</div>
			<div class="partInfo">
				<div class="title">{{ i + 1 }}. {{ title }}</div>
				<div class="infos">
					<div class="info">
						<iconify-icon icon="ri:timer-2-line" />
						<span>
							{{ length }}
						</span>
					</div>
					<div class="info">
						<iconify-icon icon="ri:calendar-event-line" />
						<span>
							{{ new Date(released).toLocaleDateString() }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
* {
	outline: 0px dotted goldenrod;
}

.info {
	display: flex;
	align-items: center;
	gap: 0.15rem;
}

.parts {
	display: flex;
	flex-flow: column;
	gap: 0.35rem;
}

.partCoverBox {
	display: flex;
}

.partCover {
	max-width: 5rem;
	border-radius: 0.15rem;
}

.partInfo {
	flex: 1;
	display: flex;
	flex-flow: column;
	justify-content: space-evenly;
}

.title {
	font-weight: bold;
}

.infos {
	display: flex;
	gap: 1rem;
}

.part {
	display: flex;
	gap: 0.45rem;
	padding: 0.35rem;
}
</style>
