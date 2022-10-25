import {ref} from "vue";
import {useStorage} from "@vueuse/core";
import {defineStore} from "pinia";

// export const useUser = defineStore("userN", () => {
// 	const logged = ref(useStorage("logged", false));
// 	const lang = ref(useStorage("lang", ""));
// 	const id = ref(useStorage("id", ""));
// 	const name = ref("");
// 	const email = ref("");
// 	const picture = ref("");
// 	const created = ref("");

// 	return {created, email, id, picture, name, lang, logged};
// });

export const useUser = defineStore("newUserStore", {
	state: () => ({
		data: {
			logged: false,
			language: "en",
			id: "",
			name: "",
			email: "",
			picture: "",
			created: "",
		},
	}),
	getters: {
		lang: state => state.data.language,
		logged: state => state.data.logged,
		id: state => state.data.id,
		name: state => state.data.name,
		email: state => state.data.email,
		picture: state => state.data.picture,
		created: state => state.data.created,
	},
});
