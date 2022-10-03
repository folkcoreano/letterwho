import {useStorage} from "@vueuse/core";
import {defineStore} from "pinia";

interface User {
	name: string;
	lang: string;
	picture: string;
	created: string;
}

interface Data {
	data?: object;
	email?: string | null;
}

export const useUser = defineStore({
	id: "user",
	state: () => ({
		logged: useStorage("logged", false),
		id: useStorage("uid", ""),
		info: useStorage("info", <User>{}),
		data: useStorage("user", <Data>{}),
	}),
	getters: {
		email: state => state.data.email,
		lang: state => state.info.lang,
		name: state => state.info.name,
		picture: state => state.info.picture,
		created: state => state.info.created,
	},
});
