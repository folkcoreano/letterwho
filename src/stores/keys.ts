import {ref} from "vue";
import {defineStore} from "pinia";

export const useUpdateKey = defineStore("updatekey", () => {
	const reviewKey = ref(0);
	return {reviewKey};
});
