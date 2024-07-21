<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  options: any;
  series: Array<{ name: string; data: number[] }>;
}>();
</script>

<template>
  <div class="w-full h-full">
    <apexchart
      class="flex items-center w-full h-full"
      width="100%"
      type="line"
      :options="props.options"
      :series="props.series"
    ></apexchart>
  </div>
</template>

<style scoped></style>
