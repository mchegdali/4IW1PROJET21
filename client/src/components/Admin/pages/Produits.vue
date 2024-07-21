<template>
  <section class="flex-1 ml-80">
    <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Produits</h1>

    <div class="p-5">
      <div class="flex flex-row space-x-4">
        <div class="w-3/5 bg-white rounded-xl p-2">
          <AreaChart />
        </div>
        <div class="w-2/5 bg-white rounded-xl">
          <DonutChart
            v-if="donutChartOptions && donutChartSeries"
            :options="donutChartOptions"
            :series="donutChartSeries"
          />
        </div>
      </div>
    </div>

    <div class="p-5">
      <div class="flex flex-row space-x-4">
        <!-- Colonne de gauche -->
        <div class="w-1/3 flex flex-col">
          <div class="mb-4">
            <StatisticsBlock :stats="statisticsData" />
          </div>
          <div class="bg-white rounded-xl p-2 flex-grow">
            <DonutChart
              v-if="priceChartOptions && priceChartSeries"
              :options="priceChartOptions"
              :series="priceChartSeries"
            />
          </div>
        </div>
        <!-- Colonne de droite -->
        <div class="w-full md:w-2/3 bg-white rounded-xl p-2 md:h-auto overflow-auto">
          <BarChart />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AreaChart from '../AreaChart.vue';
import DonutChart from '../DonutChart.vue';
import BarChart from '../BarChart.vue';
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
    BarChart,
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
