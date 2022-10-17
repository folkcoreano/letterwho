<script setup>
import {useUser} from "@/stores/user";
import {per} from "@/stores/percentage";
import {Icon} from "@iconify/vue";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import ProgressBar from "@/components/functions/ProgressBar.vue";

const props = defineProps({
	data: Object,
});

const data = ref(props.data);

const {logged, lang, id} = useUser();

const {
	params: {story},
} = useRoute();

const stories = ref([]);

const size = ref();
const total = ref(data.value.length);

const load = ref(false);

async function getData() {
	const {getFirestore, getDoc, doc} = await import("firebase/firestore");
	const db = getFirestore();
	const query = doc(db, "users", id, "diary", story);
	getDoc(query).then(res => {
		// console.table(res.data());
		stories.value = res.data().stories;
		size.value = stories.value.length;
		load.value = true;
	});
}

async function markWatched(storyid, state) {
	const {getFirestore, updateDoc, arrayUnion, arrayRemove, doc, increment} = await import(
		"firebase/firestore"
	);
	const db = getFirestore();
	const query = doc(db, "users", id, "diary", story);

	if (state) {
		updateDoc(query, {
			status: increment(-1),
			stories: arrayRemove(storyid),
		}).then(() => {
			console.log("removed");
			getData();
		});
	} else {
		updateDoc(query, {
			status: increment(1),
			stories: arrayUnion(storyid),
		}).then(() => {
			console.log("added");
			getData();
		});
	}
}

function checkWatch(map, story) {
	if (map) {
		return map.some(e => e === story);
	} else {
		return false;
	}
}
per;
onMounted(() => {
	getData();
});
</script>

<template>
	<div class="storiesBox">
		<div class="top">
			<span> {{ size }}/{{ total }} </span>
			<ProgressBar
				class="prog"
				v-if="load"
				:total="total"
				:value="size"
				:complete="size === total ? 'var(--green)' : 'var(--red)'"
			/>
			<span>
				{{ per(size, total) }}
			</span>
		</div>
		<table>
			<tr>
				<th>STORY</th>
				<th>TITLE</th>
				<th>RUNTIME</th>
				<th>AIRDATE</th>
				<th>STATUS</th>
			</tr>
			<tr
				v-for="({title, runtime, airdate, story}, i) in data"
				:key="i"
			>
				<td>{{ story }}</td>
				<td>{{ title }}</td>
				<td>{{ runtime }}</td>
				<td>{{ airdate }}</td>
				<td v-if="load">
					<Icon
						@click="markWatched(story, checkWatch(stories, story))"
						class="check"
						:color="checkWatch(stories, story) ? 'var(--green)' : ''"
						:icon="'ri:add-box-' + (checkWatch(stories, story) ? 'fill' : 'line')"
					/>
				</td>
			</tr>
		</table>
	</div>
</template>

<style scoped>
* {
	outline: 0px dotted red;
}

.top {
	display: flex;
	gap: 1rem;
	align-items: center;
	padding: 0.35rem;
}

.check {
	font-size: 2rem;
	cursor: pointer;
}

.prog {
	width: 100%;
	height: 1rem;
}

.storiesBox {
	overflow: auto;
	display: flex;
	flex-flow: column;
	gap: 0.5rem;
}

td {
	padding: 0.15rem;
}

th {
	border-bottom: 0.01rem solid #555;
	text-align: center;
	padding: 0.55rem 0;
}
</style>
