<template>
  <section class="flex-1 ml-80">
    <div class="flex items-center justify-between mb-10 p-5">
      <h1 class="text-2xl font-bold text-green-900">
        Produits
      </h1>
      <div class="flex space-x-2">
        <router-link
          to="/admin/categories/gestion"
          class="mr-2 text-black rounded-lg text-sm px-5 py-2 bg-white border border-gray-300 transition-colors duration-300 hover:bg-gray-500 hover:text-white text-center mb-2"
        >
          Gestion Catégories
        </router-link>

        <router-link
          to="/admin/produits/gestion"
          class="mr-2 text-black rounded-lg text-sm px-5 py-2 bg-white border border-gray-300 transition-colors duration-300 hover:bg-gray-500 hover:text-white text-center mb-2"
        >
          Gestion Produits
        </router-link>
      </div>
    </div>
    <div class="p-5">
      <div class="flex flex-row">
        <div class="w-1/2 flex flex-col">
          <DonutChart
            v-if="priceChartOptions && priceChartSeries"
            :options="priceChartOptions"
            :series="priceChartSeries"
          />
        </div>
        <div class="w-1/2 flex flex-col-xl">
          <DonutChart
            v-if="donutChartOptions && donutChartSeries"
            :options="donutChartOptions"
            :series="donutChartSeries"
          />
        </div>
      </div>
    </div>
    <div class="mb-4 mt-10">
        <StatisticsBlock :stats="statisticsData" />
      </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AreaChart from '../AreaChart.vue';
import DonutChart from '../DonutChart.vue';
import StatisticsBlock from '../StatisticsBlock.vue';
import { useUserStore } from '@/stores/user';

interface Statistic {
  value: string;
  text: string;
  color: string;
}

interface DistributionData {
  count: number;
  _id: string;
}

interface PriceDistributionData {
  count: number;
  range: string;
}

interface ChartOptions {
  chart: {
    id: string;
  };
  labels: string[];
  title: {
    text: string;
    align: string;
  };
}

export default defineComponent({
  name: 'Produits',
  components: {
    AreaChart,
    DonutChart,
    StatisticsBlock
  },
  data() {
    return {
      statisticsData: [
        { value: '-', text: 'Ventes', color: 'text-blue-600' },
        { value: '-', text: 'Catégories', color: 'text-green-600' },
        { value: '-', text: 'Produits', color: 'text-red-600' }
      ] as Statistic[],
      donutChartOptions: null as ChartOptions | null,
      donutChartSeries: null as number[] | null,
      priceChartOptions: null as ChartOptions | null,
      priceChartSeries: null as number[] | null
    };
  },
  async mounted() {
    await this.fetchTotalSales();
    await this.fetchCategoryCount();
    await this.fetchProductCount();
    await this.fetchProductDistribution();
    await this.fetchPriceDistribution();
  },
  methods: {
    async fetchTotalSales() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/total-sales`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`
          }
        });
        const data = await response.json();
        this.statisticsData[0].value = data.totalSales.toString();
      } catch (error) {
        console.error('Error fetching total sales:', error);
        this.statisticsData[0].value = '-';
      }
    },
    async fetchCategoryCount() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/count`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`
          }
        });
        const data = await response.json();
        this.statisticsData[1].value = data.count.toString();
      } catch (error) {
        console.error('Error fetching category count:', error);
        this.statisticsData[1].value = '-';
      }
    },
    async fetchProductCount() {
      try {
        const userStore = useUserStore();
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/count`, {
          headers: {
            Authorization: `Bearer ${userStore.accessToken}`
          }
        });
        const data = await response.json();
        this.statisticsData[2].value = data.count.toString();
      } catch (error) {
        console.error('Error fetching product count:', error);
        this.statisticsData[2].value = '-';
      }
    },
    async fetchProductDistribution() {
      try {
        const userStore = useUserStore();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/distribution-by-category`,
          {
            headers: {
              Authorization: `Bearer ${userStore.accessToken}`
            }
          }
        );
        const data: DistributionData[] = await response.json();
        this.donutChartSeries = data.map((item: DistributionData) => item.count);
        this.donutChartOptions = {
          chart: {
            id: 'vuechart-example-donut'
          },
          labels: data.map((item: DistributionData) => item._id),
          title: {
            text: 'Répartition des produits par catégorie',
            align: 'left'
          }
        };
      } catch (error) {
        console.error('Error fetching product distribution:', error);
      }
    },
    async fetchPriceDistribution() {
      try {
        const userStore = useUserStore();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/price-distribution`,
          {
            headers: {
              Authorization: `Bearer ${userStore.accessToken}`
            }
          }
        );
        const data: PriceDistributionData[] = await response.json();
        this.priceChartSeries = data.map((item: PriceDistributionData) => item.count);
        this.priceChartOptions = {
          chart: {
            id: 'price-distribution-donut'
          },
          labels: data.map((item: PriceDistributionData) => item.range),
          title: {
            text: 'Répartition des produits par tranches de prix',
            align: 'left'
          }
        };
      } catch (error) {
        console.error('Error fetching price distribution:', error);
      }
    }
  }
});
</script>

<style lang="scss" scoped></style>
