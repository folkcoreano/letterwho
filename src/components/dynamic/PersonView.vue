<script setup>
import {onErrorCaptured} from "vue";
import {useRouter} from "vue-router";
import PersonStyle from "../templates/PersonStyle.vue";

const {push} = useRouter();

onErrorCaptured(e => {
	console.log(e);
	push({name: "home"});
});
</script>

<template>
	<div>
		<Suspense>
			<template #default>
				<div>
					<PersonStyle />
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
