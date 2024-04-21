import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Layout from '../layouts/layout.vue'

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
          component: () => import('../views/ProductsView.vue')
        },
        {
          name: 'product',
          path: '/products/:id',
          component: () => import('../views/ProductView.vue')
        }
      ]
    }
  ]
})

export default router
