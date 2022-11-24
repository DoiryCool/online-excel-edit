import { createRouter, createWebHashHistory } from "vue-router";

import Login from "../components/Login.vue";
import Register from "../components/Register.vue";
import Homepage from "../components/Homepage.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Login,
    },
    {
      path: "/Login",
      component: Login,
    },
    {
      path: "/Register",
      component: Register,
    },
    {
      path: "/Homepage",
      component: Homepage,
    },
  ],
});
export default router;
