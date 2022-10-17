import {ref} from "vue";
import {defineStore} from "pinia";

export const useDialog = defineStore("dialog", () => {
	const isReview = ref(false);
	const isReviewMobile = ref(false);

	return {isReview, isReviewMobile};
});
