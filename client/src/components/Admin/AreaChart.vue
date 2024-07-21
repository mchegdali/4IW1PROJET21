<script lang="ts" setup>
import { ref } from 'vue';

const options = ref({
  chart: {
    id: 'vuechart-area-example'
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
  }
});

const series = ref<Array<{ name: string; data: number[] }>>([
  {
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  }
]);
</script>

<template>
  <div class="w-full">
    <apexchart width="100%" type="area" :options="options" :series="series"></apexchart>
  </div>
</template>

<style scoped></style>
