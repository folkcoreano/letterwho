import {useStorage} from "@vueuse/core";
import {defineStore} from "pinia";
import {ref} from "vue";

export const useUser = defineStore("user", () => {
	const logged = ref(useStorage("logged", false));
	const lang = ref(useStorage("lang", ""));
	const id = ref(useStorage("id", ""));
	const name = ref("");
	const email = ref("");
	const picture = ref("");
	const created = ref("");

	return {created, email, id, picture, name, lang, logged};
});
