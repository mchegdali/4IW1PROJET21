import { type RouteRecordRaw } from 'vue-router';

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: () => import('../components/Admin/pages/AdminLayout.vue'),
    meta: { requiresAuth: true },
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
        path: 'finances',
        name: 'AdminFinances',
        component: () => import('../components/Admin/pages/Finances.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'clients',
        name: 'AdminClients',
        component: () => import('../components/Admin/pages/Clients.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'tendances',
        name: 'AdminTendances',
        component: () => import('../components/Admin/pages/Tendances.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
];

export default adminRoutes;
