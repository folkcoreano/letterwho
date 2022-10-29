import {ref} from "vue";
import {useStorage} from "@vueuse/core";
import {defineStore} from "pinia";

export const useUser = defineStore("newUserStore", {
	state: () => ({
		data: {
			logged: false,
			language: "en",
			id: null,
			name: null,
			email: null,
			picture: null,
			created: null,
			user: null,
		},
	}),
	getters: {
		lang: state => state.data.language,
		logged: state => state.data.logged,
		id: state => state.data.id,
		name: state => state.data.name,
		user: state => state.data.user,
		email: state => state.data.email,
		picture: state => state.data.picture,
		created: state => state.data.created,
	},
});
