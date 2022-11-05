import {ref} from "vue";
import {defineStore} from "pinia";

export const useReview = defineStore("review", () => {
	const storyHasData = ref(false);
	const setWatch = ref(false);
	const setRewatch = ref(false);
	const setRate = ref(false);
	const setRating = ref(0);
	const setLove = ref(false);

	return {setWatch, setRewatch, setLove, setRate, setRating, storyHasData};
});
