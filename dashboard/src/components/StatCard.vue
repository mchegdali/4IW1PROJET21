<template>
    <div class="bg-white shadow-md rounded-lg p-4">
        <p class="text-lg font-semibold">{{ label }}</p>
        <p class="text-2xl font-bold">{{ value }}</p>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'InfoCard',
    props: {
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    }
});
</script>
  
<style scoped>
</style>
  