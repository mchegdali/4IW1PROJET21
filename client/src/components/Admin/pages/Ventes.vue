<template>
  <section class="flex-1 ml-80">
    <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Ventes</h1>

    <div class="p-5">
      <div class="flex flex-row space-x-4">
        <!-- Colonne de gauche -->
        <div class="w-1/3 flex flex-col p-10">
          <div class="mb-4">
            <StatisticsBlock :stats="statisticsData" />
          </div>
          <div class="bg-white rounded-xl p-2 flex-grow">
            <DonutChart :options="donutChartOptions" :series="donutChartSeries" />
          </div>
        </div>

        <!-- Colonne de droite -->
        <div class="w-2/3 flex flex-col p-10">
          <AreaChart :options="areaChartOptions" :series="areaChartSeries" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatisticsBlock from '../StatisticsBlock.vue';
import DonutChart from '../DonutChart.vue';
import { useUserStore } from '@/stores/user';
import AreaChart from '../AreaChart.vue';

interface Statistic {
  value: string;
  text: string;
  color: string;
}

interface Product {
  _id: string;
  name: string;
  totalSold: number;
  price: { $numberDecimal: string } | null;
  percentage: string;
}

export default defineComponent({
  name: 'Ventes',
  components: {
    StatisticsBlock,
    DonutChart,
    AreaChart,
  },
  data() {
    return {
      statisticsData: [
        { value: '-', text: 'Ventes', color: 'text-blue-600' },
        { value: '-', text: 'Clients', color: 'text-green-600' },
        { value: '-', text: 'Produits', color: 'text-red-600' }
      ] as Statistic[],
      donutChartOptions: {
        chart: {
          id: 'vuechart-donut-ventes'
        },
        labels: [],
        title: {
          text: 'Les produits les plus vendus',
          align: 'left'
        },
      } as { chart: { id: string }; labels: string[]; title: { text: string; align: string } },
      donutChartSeries: [] as number[],
      areaChartOptions: {
        chart: {
          id: 'vuechart-area-example',
        },
        xaxis: {
          categories: [] as string[], // Les mois seront insérés ici
        },
        title: {
          text: 'Nombre de commandes par mois',
          align: 'center'
        },
      },
      areaChartSeries: [
        {
          name: 'Nombre de commandes',
          data: [] as number[],
        },
      ],
    };
  },
  async mounted() {
    await this.fetchTotalSales();
    await this.fetchDistinctCustomerCount();
    await this.fetchTotalProducts();
    await this.fetchTopProducts();
    await this.fetchMonthlyOrderCount();
  },
  methods: {
    async fetchTotalSales() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/total-sales`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        });
        const data = await response.json();
        this.statisticsData[0].value = data.totalSales.toString();
      } catch (error) {
        console.error('Error fetching total sales:', error);
        this.statisticsData[0].value = '-';
      }
    },
    async fetchDistinctCustomerCount() {
      try {
        const userStore = useUserStore();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orders/distinct-customers`,
          {
            headers: {
              Authorization: `Bearer ${userStore.accessToken}`,
            },
          }
        );
        const data = await response.json();
        this.statisticsData[1].value = data.distinctCustomerCount.toString();
      } catch (error) {
        console.error('Error fetching distinct customer count:', error);
        this.statisticsData[1].value = '-';
      }
    },
    async fetchTotalProducts() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/count`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        });
        const data = await response.json();
        this.statisticsData[2].value = data.count.toString();
      } catch (error) {
        console.error('Error fetching total products:', error);
        this.statisticsData[2].value = '-';
      }
    },
    async fetchTopProducts() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/top-products`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        });
        const data = await response.json();
        this.donutChartOptions.labels = data.map((item: Product) => item.name);
        this.donutChartSeries = data.map((item: Product) => item.totalSold);
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    },
    async fetchMonthlyOrderCount() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/monthly-count`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userStore.accessToken}`,
          },
        });
        const data = await response.json();
        this.areaChartOptions.xaxis.categories = data.months;
        this.areaChartSeries[0].data = data.counts;
      } catch (error) {
        console.error('Error fetching monthly order count:', error);
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
