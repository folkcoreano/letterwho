<script setup>
import {useUser} from "@/stores/user";
import {ref} from "vue";
import FriendsList from "./FriendsList.vue";

const props = defineProps({
	data: Object,
});

const user = useUser();

const friends = ref(props.data.following);
const tab = ref(0);
</script>

<template>
	<div class="friends">
		<div class="tabs">
			<div
				v-if="data.following.length > 0"
				@click="(tab = 0), (friends = data.following)"
				class="tab"
				:style="tab === 0 ? 'border-bottom: 2px solid var(--yellow);flex:0' : 'flex:0'"
			>
				{{ user.lang === "pt-br" ? "Seguindo" : "Following" }} ({{ data.following.length }})
			</div>
			<div
				v-if="data.followers.length > 0"
				@click="(tab = 1), (friends = data.followers)"
				class="tab"
				:style="tab === 1 ? 'border-bottom: 2px solid var(--yellow);flex:0' : 'flex:0'"
			>
				{{ user.lang === "pt-br" ? "Seguidores" : "Followers" }} ({{ data.followers.length }})
			</div>
		</div>
		<div class="persons">
			<FriendsList :data="friends" />
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
	}
}
</style>
