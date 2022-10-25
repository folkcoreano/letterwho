<script setup>
import {useUser} from "@/stores/user";
import {ref, shallowRef} from "vue";
import Activity from "../user/Activity.vue";
import Reviews from "../user/Reviews.vue";

const {lang} = useUser();

const props = defineProps({
	diary: Object,
	reviews: Object,
	context: String,
});

const data = ref();

const tab = shallowRef();

if (props.diary) {
	data.value = props.diary;
	tab.value = Activity;
}

if (props.reviews) {
	data.value = props.reviews;
	tab.value = Reviews;
}
</script>

<template>
	<div class="act">
		<div class="tabs">
			<div
				v-if="reviews"
				@click="(data = reviews), (tab = Reviews)"
				class="tab"
				:style="tab === Reviews ? 'border-bottom: 2px solid var(--yellow)' : ''"
			>
				{{ "Suas reviews" }}
			</div>

			<div
				v-if="diary"
				@click="(data = diary), (tab = Activity)"
				:style="tab === Activity ? 'border-bottom: 2px solid var(--yellow)' : ''"
				class="tab"
			>
				{{ lang === "pt-br" ? "Sua atividade" : "Your activity" }}
			</div>
			<RouterLink
				:to="{name: 'reviews'}"
				class="tab"
			>
				{{ lang === "pt-br" ? "Ver todas as reviews" : "See all reviews" }}
			</RouterLink>
		</div>

		<div class="content">
			<transition
				name="route"
				mode="out-in"
			>
				<keep-alive>
					<component
						:data="data"
						:context="'story'"
						:is="tab"
					/>
				</keep-alive>
			</transition>
		</div>
	</div>
</template>

<style scoped>
.tabs {
	display: flex;
	overflow: auto;
	border-bottom: 2px solid #444;
	padding: 0.15rem;
}

.tabs::-webkit-scrollbar {
	height: 0px;
}

.tab {
	padding: 0.55rem;
	cursor: pointer;
	flex: 1;
	text-align: center;
	transition: all 150ms linear;
	border-bottom: 2px solid transparent;
	translate: 0 2px;
	white-space: nowrap;
}

.tab:hover {
	transition: all 150ms linear;
	border-bottom: 2px solid #666;
}
@media (min-width: 35rem) {
	.tabs {
		overflow: unset;
		padding: 0;
		width: fit-content;
	}

	.tab {
		flex: unset;
		text-align: unset;
	}
}
</style>
