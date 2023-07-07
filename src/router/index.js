import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";

const routes = [
	{
		path: "/:locale?",
		name: "Layout",
		component: Layout,
		children: [
			{
				path: "",
				name: "home",
				meta: {
					label: "首頁",
				},
				component: () => import("../views/Home.vue"),
			},
			{
				path: "/codemirror",
				name: "homeCodemirror",
				meta: {
					label: "首頁2",
				},
				component: () => import("../views/HomeCodemirror.vue"),
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
