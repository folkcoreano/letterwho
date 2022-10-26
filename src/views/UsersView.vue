<script setup lang="ts">
import {folder} from "@/stores/images";
import supabase from "@/supabase";
import {ref} from "vue";

const load = ref(false);
const data = ref();

supabase
	.from("users")
	.select()
	.then(res => {
		data.value = res.data;
		load.value = true;
	});
</script>
<template>
	<template v-if="load">
		<div>
			<RouterLink
				:to="{name: 'user', params: {id}}"
				class="item"
				:key="i"
				v-for="({id, name, picture}, i) in data"
			>
				<div class="side">
					<img
						class="ico"
						:src="folder(picture, '200')"
						:alt="name"
					/>
				</div>
				<div class="side">
					{{ name }}
				</div>
			</RouterLink>
		</div></template
	><template v-else><LoadingState /></template>
</template>

<style scoped>
.item {
	display: flex;
	gap: 0.45rem;
	align-items: center;
}

.ico {
	max-width: 4rem;
	border-radius: 50%;
}
</style>
