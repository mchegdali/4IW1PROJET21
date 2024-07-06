import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
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
          component: () => import('../views/account-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'livraison',
          path: '/livraison',
          component: () => import('../views/livraison-view.vue')
        },
        {
          name: 'livraison',
          path: '/livraison',
          component: () => import('../views/livraison-view.vue')
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
          name: 'orders',
          path: '/orders',
          component: () => import('../views/order-view.vue')
        },
        {
          name: 'order',
          path: '/orders/:id',
          component: () => import('../views/order-details-view.vue')
        },
        {
          name: 'tracking',
          path: '/tracking/:id',
          component: () => import('../views/order-tracking-view.vue')
        }
      ]
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (!to.meta?.requiresAuth) {
    return next();
  }

  if (!userStore.isAuthenticated) {
    const isSuccess = await userStore.getRefreshToken();
    if (isSuccess) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router;
