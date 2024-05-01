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
          name: 'cart',
          path: '/cart',
          component: () => import('../views/cart-view.vue')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('../views/login-view.vue')
    }
  ]
});

export default router;
