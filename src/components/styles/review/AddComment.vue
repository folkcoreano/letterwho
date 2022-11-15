<script setup>
import {useUpdateKey} from "@/stores/keys";
import {useUser} from "@/stores/user";
import {useCommentEdit} from "@/stores/comments";
import supabase from "@/supabase";
import {ref, watchEffect, onBeforeUnmount} from "vue";

const props = defineProps({
	id: Number,
});

const user = useUser();
const updateKey = useUpdateKey();
const useComm = useCommentEdit();

const comment = ref("");

watchEffect(() => {
	if (useComm.isEditing === true) {
		comment.value = useComm.commentText;
	}
});

async function postComment() {
	if (useComm.isEditing === true) {
		await supabase
			.from("comments")
			.update({
				comment: comment.value,
				updated: new Date().toISOString(),
			})
			.match({id: useComm.commentID});
		useComm.isEditing = false;
	} else {
		await supabase.from("comments").insert({
			user_id: user.id,
			review_id: props.id,
			comment: comment.value,
			created: new Date().toISOString(),
		});
	}
	updateKey.reviewKey += 1;
}

async function deleteComment() {
	await supabase.from("comments").delete().match({id: useComm.commentID});
	useComm.isEditing = false;
	updateKey.reviewKey += 1;
}

onBeforeUnmount(() => {
	useComm.isEditing = false;
	useComm.commentText = "";
	useComm.commentID = 0;
});
</script>
<template>
	<div class="add">
		<textarea
			tabindex="0"
			name="textEdit"
			id="textEdit"
			cols="30"
			rows="5"
			class="textEdit"
			v-model.trim="comment"
		/>
		<div class="buttons">
			<ConfirmButton
				v-if="useComm.isEditing"
				@click="deleteComment"
				:hoverColor="'var(--red)'"
			>
				<iconify-icon
					class="sendIcon"
					icon="ri:delete-bin-5-line"
				/>
			</ConfirmButton>
			<ConfirmButton
				@click="postComment"
				:state="comment === ''"
				tabindex="0"
			>
				<iconify-icon
					class="sendIcon"
					icon="ri:quill-pen-line"
				/>
				<span> Comentar </span>
			</ConfirmButton>
		</div>
	</div>
</template>
<style scoped>
.add {
	display: flex;
	flex-flow: column;
	gap: 0.55rem;
}

.buttons {
	display: flex;
	gap: 0.55rem;
	justify-content: flex-end;
}

.textEdit {
	max-width: 100%;
	border: transparent;
	border-radius: 0.25rem;
	padding: 0.5rem;
	font-size: 1rem;
	color: #eee;
	background-color: #292929;
}

.textEdit::-webkit-scrollbar {
	width: 0.35rem;
	cursor: pointer;
}
</style>
