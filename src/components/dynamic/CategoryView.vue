<script setup>
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import RangesList from "../styles/RangesStyle.vue";

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
					<RangesList />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
