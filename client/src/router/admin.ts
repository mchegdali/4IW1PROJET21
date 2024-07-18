import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/Admin/pages/Home.vue';
import VentesPage from '../components/Admin/pages/Ventes.vue';
import AdminLayout from '../components/Admin/pages/AdminLayout.vue';
import UtilisateursPage from '../components/Admin/pages/Utilisateurs.vue';
import ProduitsPage from '../components/Admin/pages/Produits.vue';
import FinancesPage from '../components/Admin/pages/Finances.vue';
import ClientsPage from '../components/Admin/pages/Clients.vue';
import TendancesPage from '../components/Admin/pages/Tendances.vue';

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: HomePage,
        meta: { needLoggedIn: true },
      },
      {
        path: 'ventes',
        name: 'AdminVentes',
        component: VentesPage,
        meta: { needLoggedIn: true },
      },
      {
        path: 'utilisateurs',
        name: 'AdminUtilisateurs',
        component: UtilisateursPage,
        meta: { needLoggedIn: true },
      },
      {
        path: 'produits',
        name: 'AdminProduits',
        component: ProduitsPage,
        meta: { needLoggedIn: true },
      },
      {
        path: 'finances',
        name: 'AdminFinances',
        component: FinancesPage,
        meta: { needLoggedIn: true },
      },
      {
        path: 'clients',
        name: 'AdminClients',
        component: ClientsPage,
        meta: { needLoggedIn: true },
      },
      {
        path: 'tendances',
        name: 'AdminTendances',
        component: TendancesPage,
        meta: { needLoggedIn: true },
      }
    ]
  }
];

export default adminRoutes;
