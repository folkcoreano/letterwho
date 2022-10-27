<script setup>
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import UserStyle from "../user/UserStyle.vue";

const route = useRoute();
const router = useRouter();

router.afterEach((to, from) => {
	if (from.params.id != router.currentRoute.value.params.id) {
		updateComponent();
	}
});

const componentKey = ref(0);

function updateComponent() {
	componentKey.value += 1;
}
</script>

<template>
	<UserStyle
		:key="componentKey"
		:id="route.params.id"
	/>
</template>
