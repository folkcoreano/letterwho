<script setup>
import {useUser} from "@/stores/user";
import supabase from "@/supabase";
import {ref, shallowRef, watchEffect} from "vue";
import {useRoute} from "vue-router";
import Comments from "./Comments.vue";
import AddComment from "./AddComment.vue";
import Likes from "./Likes.vue";
import {useCommentEdit} from "@/stores/comments";

const props = defineProps({
	comments_size: Number,
	likes_size: Number,
	comments_id: Number,
	likes_id: Number,
});

const user = useUser();
const useComm = useCommentEdit();

const comments = ref([]);
const likes = ref([]);

const data = ref([]);

const tab = shallowRef(Comments);

const {
	params: {story},
} = useRoute();

if (props.comments_size > 0) {
	getComments();
}

async function getComments() {
	if (comments.value.length < 1) {
		const commentsData = await supabase
			.from("comments")
			.select(
				`comment,
			created,
			updated,
			id,
			user_id(id,name,user,picture,diary_id(liked,rating,watched,saved,rewatch,review))
			`
			)
			.order("created", {ascending: false})
			.order("id", {ascending: true, foreignTable: "user_id.diary_id"})
			.filter("user_id.diary_id.story_id", "eq", story)
			.match({review_id: props.comments_id});

		for (const comm of commentsData.data) {
			const status = comm.user_id.diary_id.find(e => !e.rewatch && !e.review);

			comments.value.push({
				...comm,
				liked: status.liked,
				watched: status.watched,
				rating: status.rating,
				saved: status.saved,
			});
		}
	}

	data.value = comments.value;

	tab.value = Comments;
}

async function getLikes() {
	if (likes.value.length < 1) {
		const likesData = await supabase
			.from("likes")
			.select("user_id(id,name,user,picture,diary_id(liked,rating,watched,saved,rewatch,review))")
			.filter("user_id.diary_id.story_id", "eq", story)
			.match({review_id: props.likes_id});

		for (const comm of likesData.data) {
			const status = comm.user_id.diary_id.find(e => !e.rewatch && !e.review);

			if (comm.user_id.diary_id.some(e => !e.rewatch && !e.review)) {
				likes.value.push({
					...comm,
					liked: status.liked,
					watched: status.watched,
					rating: status.rating,
					saved: status.saved,
				});
			} else {
				likes.value.push({
					...comm,
					liked: false,
					watched: false,
					rating: 0,
					saved: false,
				});
			}
		}
	}

	data.value = likes.value;
	tab.value = Likes;
}

watchEffect(() => {
	if (useComm.isEditing === true) {
		tab.value = AddComment;
	}
});
</script>

<template>
	<div class="commentsBlock">
		<div class="commentsHeader">
			<div class="tabs">
				<div
					style="flex: 0"
					tabindex="0"
					:class="tab === AddComment ? 'tab activeTab' : 'tab'"
					@click="tab = AddComment"
				>
					<iconify-icon icon="ri:add-box-fill" />
				</div>
				<div
					tabindex="0"
					@click="getComments"
					:class="tab === Comments ? 'tab activeTab' : 'tab'"
				>
					{{
						comments_size > 1
							? `${comments_size} ${user.lang === "pt-br" ? "COMENT??RIOS" : "COMMENTS"} `
							: `${comments_size} ${user.lang === "pt-br" ? "COMENT??RIO" : "COMMENT"} `
					}}
				</div>
				<div
					tabindex="0"
					@click="getLikes"
					:class="tab === Likes ? 'tab activeTab' : 'tab'"
				>
					{{
						likes_size > 1
							? `${likes_size} ${user.lang === "pt-br" ? "CURTIDAS" : "LIKES"} `
							: `${likes_size} ${user.lang === "pt-br" ? "CURTIDA" : "LIKE"} `
					}}
				</div>
			</div>
		</div>
		<div>
			<Transition
				name="comp"
				mode="out-in"
			>
				<Component
					:id="comments_id"
					:data="data"
					:is="tab"
				/>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.commentsBlock {
	display: flex;
	flex-flow: column;
	gap: 0.75rem;
}
@media (min-width: 35rem) {
	.tabs {
		width: auto;
	}
	.tab {
		text-align: center;
		flex: 1;
	}
}
</style>
