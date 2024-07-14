<template>
    <section class="flex-1 ml-80">
    <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Ventes</h1>

    <div class="p-5">
        <div class="flex flex-row space-x-4">
        <!-- Colonne de gauche -->
        <div class="w-1/3 flex flex-col">
            <div class="mb-4">
                <StatisticsBlock :stats="statisticsData" />
            </div>
            <div class="bg-white rounded-xl p-2 flex-grow">
                <DonutChart />
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
import BarChart from '../BarChart.vue';
import StatisticsBlock from '../StatisticsBlock.vue';
import DonutChart from '../DonutChart.vue';

interface Statistic {
    value: string;
    text: string;
    color: string;
}

export default defineComponent({
    name: 'Ventes',
    components: {
        BarChart,
        StatisticsBlock,
        DonutChart,
    },
    data() {
        return {
        statisticsData: [
            { value: '10', text: 'Ventes', color: 'text-blue-600' },
            { value: '20', text: 'Clients', color: 'text-green-600' },
            { value: '30', text: 'Produits', color: 'text-red-600' },
        ] as Statistic[],
        };
    },
});
</script>
  
<style lang="scss" scoped>
</style>
  