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
		],
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
