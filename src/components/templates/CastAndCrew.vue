<script setup>
import {char} from "@/stores/images";
import {ref} from "vue";
import {useRoute} from "vue-router";

const props = defineProps({
	data: Object,
});

const {
	params: {type},
} = useRoute();

const doctor = props.data.filter(e => e.type === "DOCTOR");

const companion = props.data.filter(e => e.type === "COMPANION");

const character = props.data.filter(e => e.type === "CHARACTER");

const featuring = props.data.filter(e => e.type === "FEATURING");

const enemy = props.data.filter(e => e.type === "ENEMY");

const crew = props.data.filter(e => e.type === "CREW");

const tabs = ref(["Characters", "Cast & Crew"]);

if (type === "books") {
	tabs.value = ["Characters", "Crew"];
}

const actTab = ref("Characters");
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
			v-show="actTab === tabs[0]"
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
					:src="char('p/' + character_id.character_id, '500')"
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
					:src="char('p/' + character_id.character_id, '500')"
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
					:src="char('p/' + character_id.character_id, '500')"
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
					:src="char('p/' + character_id.character_id, '500')"
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
					:src="char('p/' + character_id.character_id, '500')"
					:alt="character_id.name"
				/>
				<span>
					{{ character_id.name }}
				</span>
			</RouterLink>
		</div>

		<div
			v-show="actTab === tabs[1]"
			class="crewList"
		>
			<div v-if="type != 'books' && type != 'comics'">
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
						class="crewRole"
						:to="{name: 'character', params: {id: character_id.character_id}}"
						v-text="character_id.name"
					/>
				</div>
			</div>

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
</template>

<style scoped>
* {
	outline: 0px dotted red;
}

.vids {
	min-width: 100%;
}

.tabs {
	display: flex;
	gap: 0.55rem;
}

.tab {
	cursor: pointer;
	padding: 0.15rem;
	font-weight: bold;
	border-bottom: 2px solid #333;
	color: #aaa;
	transition: all 150ms linear;
}

.active {
	border-bottom: 2px solid #eee;
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	color: #eee;
}

.tab:hover {
	translate: 0 -0.1rem;
	transition: all 150ms linear;
	border-bottom: 2px solid #ddd;
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
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
}
.charItem {
	display: flex;
	flex-flow: column;
	align-items: center;
	max-width: 5rem;
	gap: 0.5rem;
	text-align: center;
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
</style>
