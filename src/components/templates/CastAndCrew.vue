<script setup>
import {char} from "@/stores/images";

const props = defineProps({
	data: Object,
});

const doctor = props.data.filter(e => e.type === "DOCTOR");

const companion = props.data.filter(e => e.type === "COMPANION");

const character = props.data.filter(e => e.type === "CHARACTER");

const featuring = props.data.filter(e => e.type === "FEATURING");

const enemy = props.data.filter(e => e.type === "ENEMY");

const crew = props.data.filter(e => e.type === "CREW");
</script>

<template>
	<div>
		<div class="charsList">
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
		<br />
		<div class="crewList">
			<div
				:key="i"
				v-for="({crew_id, character_id}, i) in doctor"
				class="crewItem"
			>
				<RouterLink
					class="crewName"
					:to="{name: 'person', params: {id: crew_id.crew_id}}"
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
				v-for="({crew_id, character_id}, i) in companion"
				class="crewItem"
			>
				<RouterLink
					class="crewName"
					:to="{name: 'person', params: {id: crew_id.crew_id}}"
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
				v-for="({crew_id, character_id}, i) in character"
				class="crewItem"
			>
				<RouterLink
					class="crewName"
					:to="{name: 'person', params: {id: crew_id.crew_id}}"
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
				v-for="({crew_id, character_id}, i) in featuring"
				class="crewItem"
			>
				<RouterLink
					class="crewName"
					:to="{name: 'person', params: {id: crew_id.crew_id}}"
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
				v-for="({crew_id, character_id}, i) in enemy"
				class="crewItem"
			>
				<RouterLink
					class="crewName"
					:to="{name: 'person', params: {id: crew_id.crew_id}}"
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
				v-for="({crew_id, role}, i) in crew"
				class="crewItem"
			>
				<RouterLink
					class="crewName"
					:to="{name: 'person', params: {id: crew_id.crew_id}}"
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
.charItem {
	display: flex;
	flex-flow: column;
	align-items: center;
	max-width: 5rem;
	gap: 0.5rem;
	text-align: center;
}

.charIcon {
	max-width: 4rem;
	border-radius: 50%;
}
.charsList {
	display: flex;
	gap: 1rem;
	overflow: auto;
	padding: 1rem 0;
}

.crewList {
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
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
