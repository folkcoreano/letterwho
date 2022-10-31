<script setup>
import CharacterStyle from "@/components/styles/CharacterStyle.vue";
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";

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
					<CharacterStyle />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
