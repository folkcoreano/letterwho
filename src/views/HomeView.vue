<script setup>
import LastStories from "@/components/home/LastStories.vue";
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
		<Suspense>
			<template #default>
				<div class="asd">
					<div class="tabs">
						<div
							@click="tab = 'feed'"
							:class="tab === 'feed' ? 'tab activeTab' : 'tab'"
						>
							FEED
						</div>
						<div
							@click="tab = 'last'"
							:class="tab === 'last' ? 'tab activeTab' : 'tab'"
						>
							LAST ADDED
						</div>
					</div>
					<Transition
						name="comp"
						mode="in-out"
					>
						<div>
							<LastStories
								v-if="tab === 'last'"
								type="tv"
							/>
							<LastStories
								v-if="tab === 'last'"
								type="audios"
							/>
							<LastStories
								v-if="tab === 'last'"
								type="books"
							/>
							<LastStories
								v-if="tab === 'last'"
								type="comics"
							/>
							<ReviewList v-if="tab === 'feed'" /></div
					></Transition>
				</div>
			</template>
			<template #fallback>
				<LoadingState />
			</template>
		</Suspense>
	</div>
</template>
