<script setup>
import ReviewList from "@/components/templates/ReviewList.vue";
import setTitle from "@/stores/title";
import {onErrorCaptured} from "vue";

setTitle("Home");

onErrorCaptured(() => {
	location.reload();
});
</script>

<template>
	<div>
		<Suspense>
			<template #default>
				<div>
					<ReviewList />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
