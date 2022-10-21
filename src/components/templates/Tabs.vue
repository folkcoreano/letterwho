<script setup>
import {ref, shallowRef} from "vue";
import {useRoute} from "vue-router";
import {useUser} from "@/stores/user";
import Crew from "@/components/templates/Crew.vue";
import Parts from "@/components/templates/Parts.vue";
import Quotes from "@/components/templates/Quotes.vue";
import Characters from "@/components/templates/Characters.vue";

const props = defineProps({
	crew: Object,
	characters: Object,
	quotes: Object,
	parts: Object,
	code: String,
});

const {
	params: {type},
} = useRoute();

const {lang} = useUser();

const activeTab = shallowRef(Characters);

const data = ref(props.characters);
const number = ref(0);

function selectTab(n) {
	number.value = n;
	if (n === 0) {
		activeTab.value = Characters;
		data.value = props.characters;
	}
	if (n === 1) {
		activeTab.value = Parts;
		data.value = props.parts;
	}
	if (n === 2) {
		activeTab.value = Crew;
		data.value = props.crew;
	}
	if (n === 3) {
		activeTab.value = Quotes;
		data.value = props.quotes;
	}
}
</script>

<template>
	<div class="main">
		<div class="tabs">
			<div
				@click="selectTab(0)"
				:class="number === 0 ? 'tab active' : 'tab'"
			>
				{{ lang === "pt-br" ? "Personagens" : "Characters" }}
			</div>
			<div
				v-if="parts"
				@click="selectTab(1)"
				:class="number === 1 ? 'tab active' : 'tab'"
			>
				{{ lang === "pt-br" ? "Episódios" : "Episodes" }}
			</div>
			<div
				@click="selectTab(2)"
				:class="number === 2 ? 'tab active' : 'tab'"
			>
				{{
					lang === "pt-br"
						? type === "books" || type === "comics"
							? "Equipe"
							: "Elenco e Equipe"
						: type === "books" || type === "comics"
						? "Crew"
						: "Cast & Crew"
				}}
			</div>
			<div
				@click="selectTab(3)"
				:class="number === 3 ? 'tab active' : 'tab'"
			>
				{{ lang === "pt-br" ? "Citações" : "Quotes" }}
			</div>
		</div>
		<div class="content">
			<keep-alive>
				<component
					:characters="characters"
					:data="data"
					:code="code"
					:is="activeTab"
				></component>
			</keep-alive>
		</div>
	</div>
</template>

<style scoped>
.tabs {
	display: flex;
	gap: 0.55rem;
	overflow: auto;
	white-space: nowrap;
}

.tab {
	flex: 1;
	text-align: center;
	cursor: pointer;
	padding: 0.25rem;
	font-weight: bold;
	border-bottom: 2px solid #333;
	color: #aaa;
	transition: all 150ms linear;
}
.active {
	border-bottom: 2px solid var(--yellow);
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	color: #eee;
}

.tab:hover {
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	border-bottom: 2px solid var(--yellow);
	color: #ddd;
}

.main {
	padding: 0.25rem 0;
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
@media (min-width: 35rem) {
	.tab {
		flex: unset;
		text-align: unset;
	}
}
</style>
