<script setup>
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import ReviewsStyle from "../styles/ReviewsStyle.vue";

const {push} = useRouter();

onErrorCaptured(() => {
	push({name: "home"});
});
</script>

<template>
	<div>
		<Suspense>
			<template #default>
				<div>
					<ReviewsStyle />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
