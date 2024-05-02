import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home-view.vue'
import BasketView from '@/views/basket-view.vue'
import AccountView from '@/views/account-view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/basket',
      name: 'basket',
      component: BasketView
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView
    }
  ]
})

export default router
