import {createApp} from "vue";
import {createPinia} from "pinia";
import {initializeApp} from "firebase/app";
import App from "@/App.vue";
import router from "@/router";
import "@/assets/main.css";
import CategoryView from "@/components/dynamic/CategoryView.vue";
import LoadingState from "@/components/layout/LoadingState.vue";
import MainState from "@/components/layout/MainState.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import TheHeader from "@/components/layout/TheHeader.vue";
import {autoAnimatePlugin} from "@formkit/auto-animate/vue";
const app = createApp(App);

const firebase = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

initializeApp(firebase);

app
	.component("CategoryView", CategoryView)
	.component("LoadingState", LoadingState)
	.component("MainState", MainState)
	.component("TheHeader", TheHeader)
	.component("TheFooter", TheFooter);

app.use(autoAnimatePlugin);
app.use(createPinia());
app.use(router);

app.mount("#app");
