import {defineStore} from "pinia";
import {ref} from "vue";

export const useUser = defineStore("user", () => {
	const logged = ref(false);
	const lang = ref("");
	const id = ref("");
	const name = ref("");
	const email = ref("");
	const picture = ref("");
	const created = ref("");

	return {created, email, id, picture, name, lang, logged};
});
