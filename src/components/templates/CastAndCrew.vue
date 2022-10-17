<script setup>
import {ref} from "vue";
import {useRoute} from "vue-router";
import {char} from "@/stores/images";
import {useUser} from "@/stores/user";
import MultipleParts from "./MultipleParts.vue";

const props = defineProps({
	data: Object,
	quotes: Object,
	parts: Object,
});

const {
	params: {type},
} = useRoute();

const {lang} = useUser();

const doctor = props.data.filter(e => e.type === "DOCTOR");

const companion = props.data.filter(e => e.type === "COMPANION");

const character = props.data.filter(e => e.type === "CHARACTER");

const featuring = props.data.filter(e => e.type === "FEATURING");

const enemy = props.data.filter(e => e.type === "ENEMY");

const crew = props.data.filter(e => e.type === "CREW");

const tabs = ref([
	lang === "pt-br" ? "Personagens" : "Characters",
	lang === "pt-br"
		? type === "books" || type === "comics"
			? "Equipe"
			: "Elenco e Equipe"
		: type === "books" || type === "comics"
		? "Crew"
		: "Cast & Crew",
	lang === "pt-br" ? "Citações" : "Quotes",
]);

if (props.parts) {
	tabs.value.unshift(lang === "pt-br" ? "Episódios" : "Episodes");
}

const actTab = ref(tabs.value[0]);

const size = "100";
</script>

<template>
	<div class="main">
		<div class="tabs">
			<div
				v-for="tab in tabs"
				:key="tab"
				:class="tab === actTab ? 'tab active' : 'tab'"
				@click="actTab = tab"
			>
				{{ tab }}
			</div>
		</div>

		<div
			class="parts"
			v-show="actTab === 'Episódios' || actTab === 'Episodes'"
		>
			<MultipleParts :data="parts" />
		</div>

		<div
			v-show="actTab === 'Personagens' || actTab === 'Characters'"
			class="charsList"
		>
			<RouterLink
				:to="{name: 'character', params: {id: character_id.character_id}}"
				v-for="({character_id}, i) in doctor"
				:key="i"
				class="charItem"
			>
				<img
					style="border: 2px solid var(--yellow)"
					class="charIcon"
					:src="char('p/' + character_id.character_id, size)"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>

			<RouterLink
				:to="{name: 'character', params: {id: character_id.character_id}}"
				v-for="({character_id}, i) in companion"
				:key="i"
				class="charItem"
			>
				<img
					class="charIcon"
					style="border: 2px solid var(--green)"
					:src="char('p/' + character_id.character_id, size)"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>

			<RouterLink
				:to="{name: 'character', params: {id: character_id.character_id}}"
				v-for="({character_id}, i) in character"
				:key="i"
				class="charItem"
			>
				<img
					class="charIcon"
					style="border: 2px solid var(--purple)"
					:src="char('p/' + character_id.character_id, size)"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>

			<RouterLink
				:to="{name: 'character', params: {id: character_id.character_id}}"
				v-for="({character_id}, i) in featuring"
				:key="i"
				class="charItem"
			>
				<img
					class="charIcon"
					style="border: 2px solid var(--blue)"
					:src="char('p/' + character_id.character_id, size)"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>

			<RouterLink
				:to="{name: 'character', params: {id: character_id.character_id}}"
				v-for="({character_id}, i) in enemy"
				:key="i"
				class="charItem"
			>
				<img
					class="charIcon"
					style="border: 2px solid var(--red)"
					:src="char('p/' + character_id.character_id, size)"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>
		</div>

		<div
			v-show="
				actTab === 'Equipe' ||
				actTab === 'Crew' ||
				actTab === 'Elenco e Equipe' ||
				actTab === 'Cast & Crew'
			"
			class="crewList"
		>
			<template
				class="listgap"
				v-if="type != 'books' && type != 'comics'"
			>
				<div
					:key="i"
					v-for="({crew_id, character_id, role}, i) in doctor"
					class="crewItem"
				>
					<RouterLink
						class="crewName"
						:to="{name: 'person', params: {id: crew_id.crew_id}, query: {tab: role}}"
						v-text="crew_id.name + ': '"
					/>
					<RouterLink
						class="crewRole"
						:to="{name: 'character', params: {id: character_id.character_id}}"
						v-text="character_id.name"
					/>
				</div>

				<div
					:key="i"
					v-for="({crew_id, character_id, role}, i) in companion"
					class="crewItem"
				>
					<RouterLink
						class="crewName"
						:to="{name: 'person', params: {id: crew_id.crew_id}, query: {tab: role}}"
						v-text="crew_id.name + ': '"
					/>
					<RouterLink
						class="crewRole"
						:to="{name: 'character', params: {id: character_id.character_id}}"
						v-text="character_id.name"
					/>
				</div>

				<div
					:key="i"
					v-for="({crew_id, character_id, role}, i) in character"
					class="crewItem"
				>
					<RouterLink
						class="crewName"
						:to="{name: 'person', params: {id: crew_id.crew_id}, query: {tab: role}}"
						v-text="crew_id.name + ': '"
					/>
					<RouterLink
						class="crewRole"
						:to="{name: 'character', params: {id: character_id.character_id}}"
						v-text="character_id.name"
					/>
				</div>

				<div
					:key="i"
					v-for="({crew_id, character_id, role}, i) in featuring"
					class="crewItem"
				>
					<RouterLink
						class="crewName"
						:to="{name: 'person', params: {id: crew_id.crew_id}, query: {tab: role}}"
						v-text="crew_id.name + ': '"
					/>
					<RouterLink
						class="crewRole"
						:to="{name: 'character', params: {id: character_id.character_id}}"
						v-text="character_id.name"
					/>
				</div>
				<template v-if="enemy.crew_id">
					<div
						:key="i"
						v-for="({crew_id, character_id, role}, i) in enemy"
						class="crewItem"
					>
						<RouterLink
							class="crewName"
							:to="{name: 'person', params: {id: crew_id.crew_id}, query: {tab: role}}"
							v-text="crew_id.name + ': '"
						/>
						<RouterLink
							v-if="crew_id"
							class="crewRole"
							:to="{name: 'character', params: {id: character_id.character_id}}"
							v-text="character_id.name"
						/>
					</div>
				</template>
			</template>
			<div class="listgap">
				<div
					:key="i"
					v-for="({crew_id, role}, i) in crew"
					class="crewItem"
				>
					<RouterLink
						class="crewName"
						:to="{name: 'person', params: {id: crew_id.crew_id}, query: {tab: role}}"
						v-text="crew_id.name + ': '"
					/>
					<span
						class="crewRole"
						v-text="role"
					/>
				</div>
			</div>
		</div>

		<div
			class="quotes"
			v-show="actTab === 'Citações' || actTab === 'Quotes'"
		>
			<div
				class="quote"
				v-for="({en, pt, character_id}, i) in quotes"
				:key="i"
			>
				<q>
					{{ lang === "pt-br" ? pt : en }}
				</q>
				<i> {{ character_id ? character_id.name : "" }}</i>
			</div>
		</div>
	</div>
</template>

<style scoped>
* {
	outline: 0px dotted red;
}

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
	/* border-bottom: 2px solid #eee; */
	border-bottom: 2px solid var(--yellow);
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	color: #eee;
}

.tab:hover {
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	/* border-bottom: 2px solid #ddd; */
	border-bottom: 2px solid var(--yellow);
	color: #ddd;
}

.main {
	padding: 0.25rem 0;
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}

.charsList {
	display: flex;
	overflow: auto;
	gap: 0.55rem;
	padding: 0.25rem 0;
	font-size: 0.85rem;
}
.crewList {
	--space: 0.35rem;
	display: flex;
	flex-flow: column;
	gap: var(--space);
}

.listgap {
	display: flex;
	flex-flow: column;
	gap: var(--space);
}

.charItem {
	display: flex;
	flex-flow: column;
	align-items: center;
	justify-content: space-between;
	width: 4.55rem;
	gap: 0.5rem;
}

.charItem span {
	text-overflow: ellipsis;
	text-align: center;
	max-height: 2rem;
	overflow: hidden;
	max-width: 4.85rem;
}

.charIcon {
	max-width: 3.55rem;
	border-radius: 50%;
}

a {
	border-bottom: 1px solid transparent;
}

a:hover {
	border-bottom: 1px solid #888;
}

.crewName {
	font-weight: bold;
}
@media (min-width: 35rem) {
	.tab {
		flex: unset;
		text-align: unset;
	}
}
</style>
