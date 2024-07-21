<script lang="ts" setup>
import { ref } from 'vue';
import { defineProps } from 'vue';

const props = defineProps<{
  options: object;
  series: number[];
}>();
</script>

<template>
  <div class="w-full h-full">
    <apexchart
      class="flex items-center w-full h-full"
      width="100%"
      type="donut"
      :options="props.options"
      :series="props.series"
    ></apexchart>
  </div>
</template>

<style scoped></style>
