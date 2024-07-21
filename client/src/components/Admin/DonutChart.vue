<script lang="ts">
import { defineComponent } from 'vue';
import ApexCharts from 'vue3-apexcharts';

export default defineComponent({
  name: 'DonutChart',
  components: {
    apexchart: ApexCharts,
  },
  props: {
    options: Object,
    series: Array,
  },
});
</script>

<template>
  <div class="w-full h-full">
    <apexchart class="flex items-center w-full h-full" width="100%" type="donut" :options="options" :series="series"></apexchart>
  </div>
</template>

<style scoped></style>
