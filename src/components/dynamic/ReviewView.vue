<script setup>
import {useUpdateKey} from "@/stores/keys";
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import ReviewStyle from "../styles/review/ReviewStyle.vue";

const {push} = useRouter();
const updateKey = useUpdateKey();
onErrorCaptured(e => {
	console.log(e);
});
</script>

<template>
	<div>
		<Suspense>
			<template #default>
				<div>
					<Transition
						name="comp"
						mode="out-in"
					>
						<ReviewStyle :key="updateKey.reviewKey" />
					</Transition>
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
