<template>
    <section class="flex-1 ml-80">
        <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Produits</h1>

        <div class="p-5">
            <div class="flex flex-row space-x-4">
                <div class="w-3/5 bg-white rounded-xl p-2">
                    <AreaChart />
                </div>
                <div class="w-2/5 bg-white rounded-xl">
                    <DonutChart />
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
import AreaChart from '../AreaChart.vue';
import DonutChart from '../DonutChart.vue';
import BarChart from '../BarChart.vue';
import StatisticsBlock from '../StatisticsBlock.vue';

interface Statistic {
    value: string;
    text: string;
    color: string;
}

export default defineComponent({
    name: 'Produits',
    components: {
        AreaChart,
        DonutChart,
        BarChart,
        StatisticsBlock,
    },
    data() {
        return {
        statisticsData: [
            { value: '10', text: 'Ventes', color: 'text-blue-600' },
            { value: '20', text: 'Clients', color: 'text-green-600' },
            { value: '', text: 'Produits', color: 'text-red-600' }
        ] as Statistic[],
        };
    },
    methods: {
        async fetchProductCount() {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/count`);
                const data = await response.json();
                this.statisticsData[2].value = data.count.toString();
            } catch (error) {
                console.error('Error fetching product count:', error);
                this.statisticsData[2].value = "-"; 
            }
        },
    },
    mounted() {
        this.fetchProductCount();
    },
});
</script>
  
<style lang="scss" scoped>
</style>
  