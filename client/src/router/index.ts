import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import HomeView from '../views/home-view.vue';
import Layout from '../layouts/layout.vue';
import adminRoutes from './admin';
import config from '@/config';

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
          name: 'basket-confirmation',
          path: '/basket/confirmation',
          component: () => import('../views/basket-confirmation-view.vue')
        },
        {
          name: 'payment-confirmation',
          path: '/payment/confirmation',
          component: () => import('../views/payment-confirmation-view.vue')
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
          name: 'edit-account',
          path: '/edit-account',
          component: () => import('../views/edit-account-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'manage-alerts',
          path: 'manage-alerts',
          component: () => import('../views/manage-alerts-view.vue'),
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
          name: 'register-confirmation',
          path: '/register-confirmation',
          component: () => import('../views/register-confirmation-view.vue')
        },
        {
          name: 'forgot-password-confirmation',
          path: '/forgot-password-confirmation',
          component: () => import('../views/forgot-password-confirmation-view.vue')
        },
        {
          name: 'forgot-password',
          path: '/forgot-password',
          component: () => import('../views/forgot-password-view.vue')
        },
        {
          name: 'reset-password',
          path: '/reset-password',
          component: () => import('../views/reset-password-view.vue'),
          beforeEnter: (to, from, next) => {
            if (!to.query.token) {
              return next({ name: 'home', replace: true });
            }
            return next();
          }
        },
        {
          name: 'reset-password-confirmation',
          path: '/reset-password-confirmation',
          component: () => import('../views/reset-password-confirmation-view.vue')
        },
        {
          name: 'account-verified',
          path: '/confirm',
          component: () => import('../views/account-verified-view.vue'),
          beforeEnter: (to, from, next) => {
            if (!to.query.token) {
              return next({ name: 'home', replace: true });
            }
            fetch(`${config.apiBaseUrl}/auth/confirm`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                token: to.query.token
              })
            }).then((response) => {
              if (response.status === 401) {
                return next({ name: 'login' });
              }

              if (response.status === 204) {
                return next();
              }
            });
          }
        },
        {
          name: 'orders',
          path: '/orders',
          component: () => import('../views/order-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'order',
          path: '/orders/:id',
          component: () => import('../views/order-details-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'tracking',
          path: '/tracking/:id',
          component: () => import('../views/order-tracking-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'conditions',
          path: '/conditions',
          component: () => import('../views/conditions-sale-use-view.vue')
        },
        {
          name: 'confidentiality-declaration',
          path: '/confidentiality-declaration',
          component: () => import('../views/confidentiality-declaration-view.vue')
        },
        {
          name: 'cookie-policy',
          path: '/cookie-policy',
          component: () => import('../views/cookie-policy-view.vue')
        },
        {
          name: 'my-informations',
          path: '/my-informations',
          component: () => import('../views/my-informations-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'addresses',
          path: '/addresses',
          component: () => import('../views/address/address-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'add-addresse',
          path: '/add-addresse',
          component: () => import('../views/address/add-address-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'edit-addresse',
          path: '/edit-addresse/:id',
          component: () => import('../views/address/edit-address-view.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('../views/error/NotFoundView.vue')
        }
      ]
    },
    ...adminRoutes // Ajout des routes admin
  ]
});

router.beforeEach(async (to) => {
  const userStore = useUserStore();
  const authRequired = to.meta?.requiresAuth === true;

  if (authRequired && !userStore.isAuthenticated) {
    return {
      name: 'login',
      query: {
        returnUrl: to.path
      }
    };
  }

  
});

export default router;
