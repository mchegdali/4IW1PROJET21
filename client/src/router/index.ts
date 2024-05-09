import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home-view.vue';
import Layout from '../layouts/layout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          name: 'home',
          path: '',
          component: HomeView
        },
        {
          name: 'products',
          path: '/products',
          component: () => import('../views/products-view.vue')
        },
        {
          name: 'product',
          path: '/products/:id',
          component: () => import('../views/product-view.vue')
        },
        {
          name: 'basket',
          path: '/basket',
          component: () => import('../views/basket-view.vue')
        },
        {
          name: 'account',
          path: '/account',
          component: () => import('../views/account-view.vue')
        },
        {
          name: 'login',
          path: '/login',
          component: () => import('../views/login-view.vue')
        },
        {
          name: 'register',
          path: '/register',
          component: () => import('../views/register-view.vue')
        },
        {
          name: 'no-connected',
          path: '/no-connected',
          component: () => import('../views/no-connected-view.vue')
        }
      ]
    },
  ]
});

export default router;
