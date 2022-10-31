<script setup>
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import StoriesListType from "@/components/templates/StoriesListType.vue";

const {back} = useRouter();

onErrorCaptured(() => {
	back();
});
</script>

<template>
	<div>
		<Suspense>
			<template #default>
				<div>
					<StoriesListType />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
