import { type RouteRecordRaw } from 'vue-router';

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: () => import('../components/Admin/pages/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('../components/Admin/pages/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'ventes',
        name: 'AdminVentes',
        component: () => import('../components/Admin/pages/Ventes.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'utilisateurs',
        name: 'AdminUtilisateurs',
        component: () => import('../components/Admin/pages/Utilisateurs.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'produits',
        name: 'AdminProduits',
        component: () => import('../components/Admin/pages/Produits.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'produits/gestion',
        name: 'AdminGestionProduits',
        component: () => import('../components/Admin/pages/GestionProduits.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/gestion',
        name: 'AdminGestionCategories',
        component: () => import('../components/Admin/pages/GestionCategories.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'Commandes',
        name: 'AdminCommandes',
        component: () => import('../components/Admin/pages/Commandes.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
];

export default adminRoutes;
