<template>
    <section class="flex-1 ml-80">
        <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Clients</h1>

        <p>todo: rajouter le radialbar/circular gauge pour afficher le % d'utilisateurs qui ont passés commandes</p>

        <div class="p-5">
            <div class="flex flex-row space-x-4">
                <!-- Colonne de gauche -->
                <div class="w-1/3 flex flex-col">
                    <div class="mb-4">
                        <StatisticsBlock :stats="statisticsData" />
                    </div>
                    <div class="bg-white rounded-xl p-2 flex-grow">
                        <LineChart />
                    </div>
                </div>

                <!-- Colonne de droite -->
                <div class="w-full md:w-2/3 bg-white rounded-xl p-2 md:h-auto overflow-auto">
                    <BarChart />
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mt-9 p-5">
                <StatCard v-for="stat in stats" :key="stat.id" :label="stat.label" :value="stat.value" />
            </div>
        </div>
    </section>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
import StatisticsBlock from '../StatisticsBlock.vue';
import LineChart from '../LineChart.vue';
import AreaChart from '../AreaChart.vue';
import StatCard from '../StatCard.vue';
import BarChart from '../BarChart.vue';

interface Statistic {
    value: string;
    text: string;
    color: string;
}

interface Stat {
    id: number;
    label: string;
    value: string;
  }
  
  interface RegistrationData {
    date: string;
    count: number;
  }
  
  interface LineChartOptions {
    chart: {
      id: string;
    };
    xaxis: {
      categories: string[];
    };
    title?: {
      text: string;
      align: string;
    };
  }
  
  export default defineComponent({
    name: 'Utilisateurs',
    components: {
        StatisticsBlock,
        LineChart,
        AreaChart,
        StatCard,
        BarChart,
    },
    data() {
      return {
        statisticsData: [
          { value: '10', text: 'Ventes', color: 'text-blue-600' },
          { value: '20', text: 'Clients', color: 'text-green-600' },
          { value: '30', text: 'Produits', color: 'text-red-600' },
        ] as Statistic[],
        stats: [
          { id: 1, label: 'Utilisateurs totaux', value: '' },
          { id: 2, label: 'Utilisateurs actifs', value: '567' },
          { id: 3, label: 'Nouvelles inscriptions', value: '89' },
          { id: 4, label: 'Visiteurs quotidiens', value: '1234' },
          { id: 5, label: 'Visiteurs mensuels', value: '12345' },
          { id: 6, label: 'Taux de rebond', value: '45%' },
        ] as Stat[],
        lineChartOptions: {
          chart: {
            id: 'vuechart-line-users',
          },
          xaxis: {
            categories: [] as string[],
          },
        } as LineChartOptions,
        lineChartSeries: [
          {
            name: 'Utilisateurs',
            data: [] as number[],
          },
        ],
      };
    },
    methods: {
      async fetchUserCount() {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/count`);
          const data = await response.json();
          this.stats[0].value = data.count.toString();
        } catch (error) {
          console.error('Error fetching user count:', error);
          this.stats[0].value = '-';
        }
      },
      async fetchUserRegistrations() {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/registrations`);
          const data: RegistrationData[] = await response.json();
  
          const dates = data.map((entry) => entry.date);
          const counts = data.map((entry) => entry.count);
  
          this.lineChartOptions = {
            chart: {
              id: 'vuechart-line-example',
            },
            xaxis: {
              categories: dates,
            },
            title: {
              text: 'Inscriptions par jour',
              align: 'left',
            },
          };
  
          this.lineChartSeries = [
            {
              name: 'Inscriptions',
              data: counts,
            },
          ];
        } catch (error) {
          console.error('Error fetching user registrations:', error);
        }
      },
    },
    mounted() {
      this.fetchUserCount();
      this.fetchUserRegistrations();
    },
  });
  </script>
  
<style lang="scss" scoped>
</style>
