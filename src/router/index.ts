// Composables
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useDynDNS } from "@/stores/dyndns";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        redirect: () => {
          return { name: "History" };
        },
      },
      {
        path: "dyndns",
        name: "Dyndns",
        component: () => import("@/views/dyndns/Show.vue"),
      },
      {
        path: "dyndns/setting",
        name: "DyndnsSetting",
        component: () => import("@/views/dyndns/Setting.vue"),
      },
      {
        path: "history",
        name: "History",
        component: () => import("@/views/History.vue"),
      },
    ],
  },
];

let history;

if (import.meta.env.DEV) {
  history = createWebHistory(process.env.BASE_URL);
} else {
  history = createWebHashHistory();
}

const router = createRouter({
  history,
  routes,
});

router.beforeEach(async (to) => {
  const store = useDynDNS();
  if (!store.created && to.name !== "DyndnsSetting") {
    return { name: "DyndnsSetting" };
  }
});

export default router;
