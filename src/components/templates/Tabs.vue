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

const user = useUser();

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
				{{ user.lang === "pt-br" ? "Personagens" : "Characters" }}
			</div>
			<div
				v-if="parts"
				@click="(data = parts), (tab = Parts)"
				:style="tab === Parts ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
			>
				{{ user.lang === "pt-br" ? "Episódios" : "Episodes" }}
			</div>
			<div
				@click="(data = crew), (tab = Crew)"
				:style="tab === Crew ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
			>
				{{
					user.lang === "pt-br"
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
				{{ user.lang === "pt-br" ? "Citações" : "Quotes" }}
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
.main {
	padding: 0.25rem 0;
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}
</style>
