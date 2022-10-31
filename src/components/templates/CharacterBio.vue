<script setup>
import {folder} from "@/stores/images";
import {useRoute} from "vue-router";

const {
	name,
	params: {id},
} = useRoute();

const props = defineProps({
	data: Object,
});
</script>

<template>
	<div class="character">
		<div>
			<img
				class="image"
				:src="folder('p/' + id, '500')"
				alt=""
			/>
		</div>
		<div
			v-if="name !== 'person'"
			class="quotes"
		>
			<div
				class="quote"
				:key="id"
				v-for="({id, pt, en, story_id: {title, url, type, range_id}}, i) in data"
			>
				<q>{{ pt }}</q>
				<br />
				<q>{{ en }}</q>
				<br />
				<router-link
					class="auth"
					:to="{name: 'story', params: {type: type, range: range_id, story: url}}"
					>{{ title }}</router-link
				>
			</div>
		</div>
	</div>
</template>

<style scoped>
.character {
	padding: 1rem 0;
}
.image {
	max-width: 100%;
}
.quotes {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}

.quote {
	color: #eee;
	font-weight: bold;
}
.auth {
	color: #aaa;
	font-weight: normal;
}
</style>
