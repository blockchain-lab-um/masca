import { useMetamaskStore } from '@/stores/metamask';
import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const mmStore = useMetamaskStore();
  if (to.name !== 'home' && to.name !== 'about') {
    if (!mmStore.snapInstalled) next({ name: 'home', replace: true });
    else next();
  } else next();
});

export default router;
