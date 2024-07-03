<script lang="ts" setup>
import { ref } from 'vue';

const options = ref({
    chart: {
        id: 'vuechart-example-donut'
    },
    labels: ['1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998']
});

const series = ref<number[]>([30, 40, 45, 50, 49, 60, 70, 91]);
</script>

<template>
    <div class="w-full h-full">
        <apexchart class="flex items-center w-full h-full" width="100%" type="donut" :options="options" :series="series"></apexchart>
    </div>
</template>

<style scoped>
</style>
