<script setup>
import ReviewList from "@/components/templates/ReviewList.vue";
import setTitle from "@/stores/title";
import {ref, onErrorCaptured} from "vue";

setTitle("Home");

onErrorCaptured(() => {
	location.reload();
});

const tab = ref("feed");
</script>

<template>
	<div>
		<!-- <Suspense>
			<template #default>
				<ReviewList
					context="last"
					v-if="tab === 'feed'"
				/>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense> -->
	</div>
</template>
