<template>
  <section class="flex-1 ml-80">
    <div class="flex items-center justify-between mb-12 p-5">
      <h1 class="text-2xl font-bold text-green-900">Dashboard Fanthésie</h1>
      <img src="/images/fanthesie2.png" alt="Logo" class="rounded-md" />
    </div>

    <!-- Stats globales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 h-100 p-5">
      <!-- En faire des composants -->
      <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
        <div class="flex items-center justify-center py-4">
          <img
            src="/images/users.svg"
            alt="Logo"
            class="object-contain h-20"
          />
        </div>
        <div class="text-center mt-4">
          <div class="text-2xl font-bold" id="userCount">{{ userCount }}</div>
          <div class="text-sm text-gray-500 mt-2">Nombre d'utilisateurs totaux</div>
        </div>
      </div>

      <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
        <div class="flex items-center justify-center py-4">
          <img
            src="/images/revenue.svg"
            alt="Logo"
            class="object-contain h-20"
          />
        </div>
        <div class="text-center mt-4">
          <div class="text-2xl font-bold" id="totalRevenue">{{ totalRevenue }} €</div>
          <div class="text-sm text-gray-500 mt-2">Chiffre d'affaires total</div>
        </div>
      </div>

      <div class="p-4 rounded-lg mb-8 bg-white shadow-lg">
        <div class="flex items-center justify-center py-4">
          <img
            src="/images/plane.svg"
            alt="Logo"
            class="object-contain h-20"
          />
        </div>
        <div class="text-center mt-4">
          <div class="text-2xl font-bold" id="orderCount">{{ orderCount }}</div>
          <div class="text-sm text-gray-500 mt-2">Nombre de commandes total</div>
        </div>
      </div>
    </div>

    <div class="p-5">
      <div class="flex flex-row space-x-4">
        <div class="w-3/5 bg-white rounded-xl p-2">
          <BarChart :series="barChartSeries" :options="barChartOptions" />
        </div>
        <div class="w-2/5 bg-white rounded-xl">
          <DonutChart
            v-if="donutChartOptions && orderStatusSeries"
            :options="donutChartOptions"
            :series="orderStatusSeries"
          />
        </div>
      </div>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-4 gap-4 mt-9 p-5">
      <Card
        v-for="(card, index) in cards"
        :key="index"
        :title="card.title"
        :text="card.text"
        :page="card.page"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import Card from '../Card.vue';
import BarChart from '../BarChart.vue';
import DonutChart from '../DonutChart.vue';

interface CardData {
  title: string;
  text: string;
  page: string;
}

interface OrderStatus {
  count: number;
  label: string;
}

export default defineComponent({
  name: 'HomePage',
  components: {
    Card,
    BarChart,
    DonutChart
  },
  data() {
    return {
      userCount: '-',
      orderCount: '-',
      totalRevenue: '-',
      orderStatusSeries: null as number[] | null,
      donutChartOptions: null as {
        chart: { id: string };
        labels: string[];
        title: { text: string; align: string };
      } | null,
      barChartOptions: {
        chart: {
          id: 'user-registrations-last-12-months'
        },
        xaxis: {
          categories: [] as string[]
        },
        title: {
          text: "Évolution du nombre d'inscriptions sur les 7 derniers mois",
          align: 'center'
        }
      },
      barChartSeries: [
        {
          name: 'Inscriptions',
          data: [] as number[]
        }
      ],
      cards: [
        {
          title: 'Ventes',
          text: 'Découvez-en plus sur vos ventes',
          page: 'AdminVentes'
        },
        {
          title: 'Utilisateurs',
          text: 'Gérez les utilisateurs de votre site',
          page: 'AdminUtilisateurs'
        },
        {
          title: 'Produits',
          text: 'Parcourez vos produits',
          page: 'AdminProduits'
        },
        {
          title: 'Commandes',
          text: 'Analysez vos commandes',
          page: 'AdminProduits'
        }
      ] as CardData[]
    };
  },
  methods: {
    async fetchUserCount() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.userCount = data.count;
      } catch (error) {
        console.error('Error fetching user count:', error);
        this.userCount = '-';
      }
    },
    async fetchOrderCount() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.orderCount = data.count;
      } catch (error) {
        console.error('Error fetching order count:', error);
        this.orderCount = '-';
      }
    },
    async fetchTotalRevenue() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/revenue`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.totalRevenue = data.totalRevenue.toFixed(2); // Limiter à 2 chiffres après la virgule
      } catch (error) {
        console.error('Error fetching total revenue:', error);
        this.totalRevenue = '-';
      }
    },
    async fetchOrderStatusDistribution() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orders/status-distribution`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OrderStatus[] = await response.json();
        this.orderStatusSeries = data.map((item: OrderStatus) => item.count);
        this.donutChartOptions = {
          chart: {
            id: 'order-status-distribution'
          },
          labels: data.map((item: OrderStatus) => item.label),
          title: {
            text: 'Répartition des commandes par statut',
            align: 'center'
          }
        };
      } catch (error) {
        console.error('Error fetching order status distribution:', error);
        this.orderStatusSeries = [];
        this.donutChartOptions = null;
      }
    },
    async fetchUserRegistrationsLast12Months() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/registrations-last-12-months`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.barChartOptions.xaxis.categories = data.map((item: { date: string }) => item.date);
        this.barChartSeries[0].data = data.map((item: { count: number }) => item.count);
      } catch (error) {
        console.error('Error fetching user registrations last 12 months:', error);
      }
    }
  },
  mounted() {
    this.fetchUserCount();
    this.fetchOrderCount();
    this.fetchTotalRevenue();
    this.fetchOrderStatusDistribution();
    this.fetchUserRegistrationsLast12Months();
  }
});
</script>

<style lang="scss"></style>
