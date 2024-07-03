import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '../components/pages/Home.vue';
import VentesPage from '../components/pages/Ventes.vue';
import UtilisateursPage from '../components/pages/Utilisateurs.vue';
import ProduitsPage from '../components/pages/Produits.vue';
import FinancesPage from '../components/pages/Finances.vue';
import ClientsPage from '../components/pages/Clients.vue';
import TendancesPage from '../components/pages/Tendances.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        alias: '/home',
        name: 'Home',
        component: HomePage,
        meta: { needLoggedIn: false },
    },
    {
        path: '/Ventes',
        name: 'Ventes',
        component: VentesPage,
        meta: { needLoggedIn: false },
    },
    {
        path: '/Utilisateurs',
        name: 'Utilisateurs',
        component: UtilisateursPage,
        meta: { needLoggedIn: false },
    },
    {
        path: '/Produits',
        name: 'Produits',
        component: ProduitsPage,
        meta: { needLoggedIn: false },
    },
    {
        path: '/Finances',
        name: 'Finances',
        component: FinancesPage,
        meta: { needLoggedIn: false },
    },
    {
        path: '/Clients',
        name: 'Clients',
        component: ClientsPage,
        meta: { needLoggedIn: false },
    },
    {
        path: '/Tendances',
        name: 'Tendances',
        component: TendancesPage,
        meta: { needLoggedIn: false },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
