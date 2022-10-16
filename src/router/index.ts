import {createRouter, createWebHistory} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import {getAuth} from "firebase/auth";

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
			path: "/characters/:id",
			name: "character",
			component: () => import("@/components/dynamic/CharacterView.vue"),
		},
		{
			path: "/characters",
			name: "characters",
			component: () => import("@/views/CharactersView.vue"),
		},
		{
			path: "/persons/:id",
			name: "person",
			component: () => import("@/components/dynamic/PersonView.vue"),
		},
		{
			path: "/persons",
			name: "persons",
			component: () => import("@/views/PersonsView.vue"),
		},
		{
			path: "/quotes",
			name: "quotes",
			component: () => import("@/views/QuotesView.vue"),
		},
		{
			path: "/stories",
			name: "stories",
			component: () => import("@/views/StoriesView.vue"),
		},
		{
			path: "/search",
			name: "search",
			component: () => import("@/views/SearchView.vue"),
		},
		{
			path: "/user/:id",
			name: "user",
			component: () => import("@/components/dynamic/UserView.vue"),
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
