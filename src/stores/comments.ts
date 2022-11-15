import {ref} from "vue";
import {defineStore} from "pinia";

export const useCommentEdit = defineStore("commentedit", () => {
	const commentID = ref(0);
	const commentText = ref("");
	const isEditing = ref(false);

	return {commentID, commentText, isEditing};
});
