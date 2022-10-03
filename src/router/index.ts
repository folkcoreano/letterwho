import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import {getAuth} from "@firebase/auth";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/:pathMatch(.*)*",
			name: "404",
			component: () => import("@/views/NotFoundView.vue"),
		},
		{
			path: "/audios",
			name: "audios",
			component: () => import("@/views/AudiosView.vue"),
		},
		{
			path: "/books",
			name: "books",
			component: () => import("@/views/BooksView.vue"),
		},
		{
			path: "/comics",
			name: "comics",
			meta: {
				auth: false,
			},
			component: () => import("@/views/ComicsView.vue"),
		},
		{
			path: "/tv",
			name: "tv",
			component: () => import("@/views/TVView.vue"),
		},
		{
			path: "/:type/:range",
			name: "range",
			component: () => import("@/components/dynamic/RangeView.vue"),
		},
		{
			path: "/:type/:range/:story",
			name: "story",
			component: () => import("@/components/dynamic/StoryView.vue"),
		},
		{
			path: "/:type/:range/:story/reviews",
			name: "reviews",
			component: () => import("@/components/dynamic/ReviewsView.vue"),
		},
		{
			path: "/:type/:range/:story/reviews/:id",
			name: "review",
			component: () => import("@/components/dynamic/ReviewView.vue"),
		},
	],
	scrollBehavior() {
		return {top: 0};
	},
});

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.auth)) {
		if (getAuth().currentUser) {
			next();
		} else {
			next("/"); //login
		}
	} else {
		next();
	}
});

export default router;
