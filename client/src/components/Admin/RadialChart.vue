<template>
  <div class="w-full">
    <apexchart width="100%" type="radialBar" :options="options" :series="series"></apexchart>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const options = ref({
  chart: {
    id: 'vuechart-radialbar',
    type: 'radialBar'
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: '70%'
      },
      dataLabels: {
        name: {
          offsetY: -10,
          color: '#888',
          fontSize: '17px'
        },
        value: {
          color: '#111',
          fontSize: '36px',
          show: true
        }
      }
    }
  },
  labels: ['Objectif atteint']
});

const series = ref<number[]>([75]);
</script>

<style scoped></style>
