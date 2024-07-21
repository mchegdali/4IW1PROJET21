<script lang="ts" setup>
import { ref, defineProps } from 'vue';

interface BarChartOptions {
  chart: {
    id: string;
  };
  xaxis: {
    categories: string[];
  };
}

interface BarChartSeries {
  name: string;
  data: number[];
}

const props = defineProps<{ options: BarChartOptions; series: BarChartSeries[] }>();

const options = ref(props.options);
const series = ref(props.series);
</script>

<template>
  <div class="w-full">
    <apexchart width="100%" type="bar" :options="options" :series="series"></apexchart>
  </div>
</template>

<style scoped></style>
