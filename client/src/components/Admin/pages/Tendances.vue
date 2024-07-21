<template>
  <section class="flex-1 ml-80">
    <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Tendances et prévisions</h1>

    <p>
      todo: radio graph pour affichage du taux de croissance des ventes par rapport à une période
      précédente (mensuelle, trimestrielle, annuelle).
    </p>

    <div class="p-5">
      <div class="flex flex-row space-x-4">
        <!-- colonne de gauche -->
        <div class="w-2/3 bg-white rounded-xl p-2">
          <BarChart />
        </div>

        <!-- colonne de droite -->
        <div class="w-1/3 bg-white rounded-xl flex flex-col space-y-4 p-2">
          <div>
            <RadialChart />
          </div>
          <div class="flex-grow flex items-center justify-center w-full h-full">
            <StatisticsBlock :stats="statisticsData" class="w-full border-2" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BarChart from '../BarChart.vue';
import RadialChart from '../RadialChart.vue';
import StatisticsBlock from '../StatisticsBlock.vue';

interface Statistic {
  value: string;
  text: string;
  color: string;
}

export default defineComponent({
  name: 'Tendances',
  components: {
    BarChart,
    RadialChart,
    StatisticsBlock
  },
  data() {
    return {
      statisticsData: [
        { value: '10', text: 'Ventes', color: 'text-blue-600' },
        { value: '20', text: 'Clients', color: 'text-green-600' },
        { value: '30', text: 'Produits', color: 'text-red-600' }
      ] as Statistic[]
    };
  }
});
</script>

<style lang="scss" scoped></style>
