<script setup>
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import StoryStyle from "../styles/StorySetupStyle.vue";

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
					<StoryStyle />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
