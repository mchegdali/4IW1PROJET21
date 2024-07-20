<script lang="ts" setup>
import { ref, defineProps, watch } from 'vue';

interface BarChartOptions {
  chart: {
    id: string;
  };
  xaxis: {
    categories: string[];
  };
  title: {
    text: string;
    align: string;
  };
}

interface BarChartSeries {
  name: string;
  data: number[];
}

const props = defineProps<{ options: BarChartOptions; series: BarChartSeries[] }>();

const options = ref(props.options);
const series = ref(props.series);

watch(() => props.options, (newOptions) => {
  options.value = newOptions;
}, { deep: true });

watch(() => props.series, (newSeries) => {
  series.value = newSeries;
}, { deep: true });
</script>

<template>
  <div class="w-full">
    <apexchart width="100%" type="bar" :options="options" :series="series"></apexchart>
  </div>
</template>

<style scoped></style>
