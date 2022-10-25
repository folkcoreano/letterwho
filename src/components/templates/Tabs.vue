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

const data = ref(props.characters);

const tab = shallowRef(Characters);
</script>

<template>
	<div class="main">
		<div class="tabs">
			<div
				@click="(data = characters), (tab = Characters)"
				:style="tab === Characters ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
			>
				{{ lang === "pt-br" ? "Personagens" : "Characters" }}
			</div>
			<div
				v-if="parts"
				@click="(data = parts), (tab = Parts)"
				:style="tab === Parts ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
			>
				{{ lang === "pt-br" ? "Episódios" : "Episodes" }}
			</div>
			<div
				@click="(data = crew), (tab = Crew)"
				:style="tab === Crew ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
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
				@click="(data = quotes), (tab = Quotes)"
				:style="tab === Quotes ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
			>
				{{ lang === "pt-br" ? "Citações" : "Quotes" }}
			</div>
		</div>
		<div class="content">
			<transition
				name="route"
				mode="out-in"
			>
				<keep-alive>
					<component
						:characters="characters"
						:data="data"
						:code="code"
						:is="tab"
					></component>
				</keep-alive>
			</transition>
		</div>
	</div>
</template>

<style scoped>
.tabs {
	display: flex;
	overflow: auto;
	border-bottom: 2px solid #444;
	padding: 0.15rem;
}

.tabs::-webkit-scrollbar {
	height: 0px;
}

.tab {
	padding: 0.45rem;
	cursor: pointer;
	flex: 1;
	text-align: center;
	transition: all 150ms linear;
	border-bottom: 2px solid transparent;
	translate: 0 2px;
	white-space: nowrap;
}

.tab:hover {
	transition: all 150ms linear;
	border-bottom: 2px solid #666;
}

.main {
	padding: 0.25rem 0;
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
@media (min-width: 35rem) {
	.tabs {
		overflow: unset;
		padding: 0;
		width: fit-content;
	}

	.tab {
		flex: unset;
		text-align: unset;
	}
}
</style>
