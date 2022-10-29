<script setup>
import {useUser} from "@/stores/user";
import {ref} from "vue";
import FriendsList from "./FriendsList.vue";

const props = defineProps({
	data: Object,
});

const user = useUser();

const friends = ref([]);
const tab = ref();
const sorted = ref(false);

if (props.data.followers.length > 0) {
	friends.value = props.data.followers;
	tab.value = 2;
	sorted.value = true;
}

if (props.data.following.length > 0) {
	friends.value = props.data.following;
	tab.value = 1;
	sorted.value = true;
}

if (props.data.mutuals.length > 0) {
	friends.value = props.data.mutuals;
	tab.value = 0;
	sorted.value = true;
}
</script>

<template>
	<div class="friends">
		<div
			v-if="sorted"
			class="tabs"
		>
			<div
				v-if="data.mutuals.length > 0"
				@click="(tab = 0), (friends = data.mutuals)"
				class="tab"
				:style="tab === 0 ? 'border-bottom: 2px solid var(--yellow)' : ''"
			>
				Mutuals ({{ data.mutuals.length }})
			</div>
			<div
				v-if="data.following.length > 0"
				@click="(tab = 1), (friends = data.following)"
				class="tab"
				:style="tab === 1 ? 'border-bottom: 2px solid var(--yellow)' : ''"
			>
				{{ user.lang === "pt-br" ? "Seguindo" : "Following" }} ({{ data.following.length }})
			</div>
			<div
				v-if="data.followers.length > 0"
				@click="(tab = 2), (friends = data.followers)"
				class="tab"
				:style="tab === 2 ? 'border-bottom: 2px solid var(--yellow)' : ''"
			>
				{{ user.lang === "pt-br" ? "Seguidores" : "Followers" }} ({{ data.followers.length }})
			</div>
		</div>
		<div class="persons">
			<Transition
				name="route"
				mode="out-in"
			>
				<KeepAlive>
					<FriendsList
						:key="tab"
						:data="friends"
					/>
				</KeepAlive>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.friends {
	display: flex;
	flex-flow: column;
	gap: 1rem;
}
@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}

	.tab {
		text-align: center;
		flex: 0;
	}
}
</style>
