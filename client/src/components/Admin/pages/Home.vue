<template>
  <section class="flex-1 ml-80">
    <div class="flex items-center justify-between mb-12 p-5">
      <h1 class="text-2xl font-bold text-green-900">Dashboard Fanthésie</h1>
      <img src="/images/fanthesie2.png" alt="Image" class="rounded-md" />
    </div>

    <!-- Stats globales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 h-100 p-5">
      <!-- En faire des composants -->
      <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
        <div class="flex items-center justify-center py-4">
          <img
            src="https://picsum.photos/500/500"
            alt="Logo"
            class="object-contain h-20 rounded-full"
          />
        </div>

        <!-- Stats globales -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 h-100 p-5">
            <!-- En faire des composants -->
            <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
                <div class="flex items-center justify-center py-4">
                <img src="https://picsum.photos/500/500" alt="Logo" class="object-contain h-20 rounded-full">
                </div>
                <div class="text-center mt-4">
                <div class="text-2xl font-bold">1 238</div>
                <div class="text-2xl font-bold">1 238</div>
                <div class="text-sm text-gray-500 mt-2">Nombre d'utilisateurs totaux</div>
                </div>
            </div>

            <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
                <div class="flex items-center justify-center py-4">
                <img src="https://picsum.photos/500/500" alt="Logo" class="object-contain h-20 rounded-full">
                </div>
                <div class="text-center mt-4">
                <div class="text-2xl font-bold">15 258 €</div>
                <div class="text-2xl font-bold">15 258 €</div>
                <div class="text-sm text-gray-500 mt-2">Chiffre d'affaires total</div>
                </div>
            </div>

          <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
            <div class="flex items-center justify-center py-4">
              <img
                src="https://picsum.photos/500/500"
                alt="Logo"
                class="object-contain h-20 rounded-full"
              />
            </div>
            <div class="text-center mt-4">
              <div class="text-2xl font-bold" id="orderCount">{{ orderCount }}</div>
              <div class="text-sm text-gray-500 mt-2">Nombre de commandes total</div>
            </div>
          </div>

            <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
                <div class="flex items-center justify-center py-4">
                <img src="https://picsum.photos/500/500" alt="Logo" class="object-contain h-20 rounded-full">
                </div>
                <div class="text-center mt-4">
                <div class="text-2xl font-bold">75,5 €</div>
                <div class="text-sm text-gray-500 mt-2">Panier moyen</div>
                <div class="text-sm text-gray-500 mt-2">Panier moyen</div>
                </div>
            </div>
        </div>

        <div class="p-5">
            <div class="flex flex-row space-x-4">
                <div class="w-3/5 bg-white rounded-xl p-2">
                    <BarChart />
                </div>
                <div class="w-2/5 bg-white rounded-xl">
                    <DonutChart />
                    <DonutChart />
                </div>
            </div> 
        </div>
        
        <!-- Cards -->
        <div class="grid grid-cols-3 gap-4 mt-9 p-5">
            <Card v-for="(card, index) in cards" :key="index" :image="card.image" :title="card.title" :text="card.text" :page="card.page"/>
        </div>
    </section>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import Card from '../Card.vue';
  import BarChart from '../BarChart.vue';
  import DonutChart from '../DonutChart.vue';
  
  interface CardData {
    image: string;
    title: string;
    text: string;
    page: string;
  }
  
  export default defineComponent({
    name: 'HomePage',
    components: {
      Card,
      BarChart,
      DonutChart,
    },
    data() {
        return {
            userCount: "-",
            orderCount: "-",
            totalRevenue: "-",
            orderStatusSeries: null,
            donutChartOptions: null,
            cards: [
                {
                    image: 'https://picsum.photos/500/500',
                    title: 'Ventes',
                    text: 'Explorez les dernières tendances de vente et optimisez votre stratégie commerciale en temps réel. Cliquez ici pour consulter les statistiques de ventes !',
                    page: 'AdminVentes',
                },
                {
                    image: 'https://picsum.photos/500/500',
                    title: 'Utilisateurs',
                    text: 'Découvrez les nouvelles inscriptions et analysez le comportement de vos utilisateurs. Cliquez ici pour accéder aux statistiques des utilisateurs !',
                    page: 'AdminUtilisateurs',
                },
                {
                    image: 'https://picsum.photos/500/500',
                    title: 'Produits',
                    text: 'Suivez la performance de vos produits et identifiez les best-sellers. Cliquez ici pour consulter les statistiques détaillées de vos produits !',
                    page: 'AdminProduits',
                },
                {
                    image: 'https://picsum.photos/500/500',
                    title: 'Finances',
                    text: 'Obtenez un aperçu complet de vos finances et suivez vos revenus et dépenses. Cliquez ici pour consulter les statistiques financières détaillées !',
                    page: 'AdminFinances',
                },
                {
                    image: 'https://picsum.photos/500/500',
                    title: 'Clients',
                    text: 'Analysez les données de vos clients et améliorez votre relation client. Cliquez ici pour accéder aux statistiques détaillées de vos clients !',
                    page: 'AdminClients',
                },
                {
                    image: 'https://picsum.photos/500/500',
                    title: 'Tendances et Prévisions',
                    text: 'Utilisez des prévisions basées sur des données pour planifier votre stratégie future. Cliquez ici pour explorer les tendances et les prévisions détaillées !',
                    page: 'AdminTendances',
                },
            ] as CardData[],
        };
    },
    methods: {
        async fetchUserCount() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/count`);
                const data = await response.json();
                this.userCount = data.count;
            } catch (error) {
                console.error('Error fetching user count:', error);
                this.userCount = "-"; 
            }
        },
        async fetchOrderCount() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/count`);
                const data = await response.json();
                this.orderCount = data.count;
            } catch (error) {
                console.error('Error fetching order count:', error);
                this.orderCount = "-"; 
            }
        },
        async fetchTotalRevenue() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/revenue`);
                const data = await response.json();
                this.totalRevenue = data.totalRevenue.toFixed(2); // Limiter à 2 chiffres après la virgule
            } catch (error) {
                console.error('Error fetching total revenue:', error);
                this.totalRevenue = "-"; 
            }
        },
        async fetchOrderStatusDistribution() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/status-distribution`);
                const data = await response.json();
                this.orderStatusSeries = data.map(item => item.count);
                this.donutChartOptions = {
                    chart: {
                        id: 'order-status-distribution'
                    },
                    labels: data.map(item => item.label),
                    title: {
                        text: 'Répartition des commandes par statut',
                        align: 'left'
                    }
                };
            } catch (error) {
                console.error('Error fetching order status distribution:', error);
                this.orderStatusSeries = [];
                this.donutChartOptions = null;
            }
        },
    },
    mounted() {
        this.fetchUserCount();
        this.fetchOrderCount();
        this.fetchTotalRevenue();
        this.fetchOrderStatusDistribution();
    },
});
</script>

<style lang="scss"></style>
