import {createApp} from "vue";
import App from "@/App.vue";
import {createPinia} from "pinia";
import "@/assets/main.css";
import router from "@/router";
import {autoAnimatePlugin} from "@formkit/auto-animate/vue";

import CategoryView from "@/components/dynamic/CategoryView.vue";
import LoadingState from "@/components/layout/LoadingState.vue";
import MainState from "@/components/layout/MainState.vue";
import TheFooter from "@/components/layout/TheFooter.vue";
import TheHeader from "@/components/layout/TheHeader.vue";
import ConfirmButton from "@/components/buttons/ConfirmButton.vue";
import DialogGlobal from "@/components/functions/DialogGlobal.vue";

const app = createApp(App);

app
	.component("CategoryView", CategoryView)
	.component("LoadingState", LoadingState)
	.component("MainState", MainState)
	.component("TheHeader", TheHeader)
	.component("DialogGlobal", DialogGlobal)
	.component("ConfirmButton", ConfirmButton)
	.component("TheFooter", TheFooter);

app.use(autoAnimatePlugin);
app.use(createPinia());
app.use(router);

app.mount("#app");
