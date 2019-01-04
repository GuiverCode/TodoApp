import Vue from 'vue'
import VueRouter from 'vue-router'
import Sidenav from '../components/Sidenav.vue'
import Home from '../components/Home.vue'
import About from '../components/About.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter);


const routes = [
  { path: '/login', name: 'login', component: Login },
  {
    path: '/', component: Sidenav, meta: { requiresAuth: true },
    children: [
      { path: '', redirect: Home, meta: { requiresAuth: true }},
      { path: '/about', name: 'about', component: About, meta: { requiresAuth: true } },
      { path: '/home', name: 'home', component: Home, meta: { requiresAuth: true } }
    ]
  },
];

const router = new VueRouter({ routes, base: '/' });

/**
 * to: el objeto de ruta objetivo al que se está navegando.
 * from: la ruta actual desde la que se navega.
 * next: esta función debe invocarse para resolver la navegacion.
 *
 * https://router.vuejs.org/guide/advanced/navigation-guards.html#global-guards
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const authUser = window.localStorage.getItem('TodoToken');

    if (!authUser) {
      next({ name: 'login' })
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
