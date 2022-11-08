<script setup>
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import ReviewStyle from "../styles/review/ReviewStyle.vue";

const {push} = useRouter();

onErrorCaptured(e => {
	console.log(e);
	// push({name: "home"});
});
</script>

<template>
	<div>
		<Suspense>
			<template #default>
				<div>
					<ReviewStyle />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
