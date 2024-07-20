<template>
    <div class="grid grid-cols-3 divide-x divide-gray-300 bg-white shadow-lg rounded-lg p-4">
        <div v-for="(stat, index) in stats" :key="index" class="flex flex-col items-center">
            <span :class="['text-3xl font-bold', stat.color]">{{ stat.value }}</span>
            <span class="text-gray-500 mt-2">{{ stat.text }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';

interface Stat {
    value: string;
    text: string;
    color: string;
}

export default defineComponent({
    name: 'StatisticsBlock',
    props: {
        stats: {
            type: Array as PropType<Stat[]>,
            required: true,
            default: () => ([
                { value: '01', text: 'Statistique 1', color: 'text-blue-600' },
                { value: '02', text: 'Statistique 2', color: 'text-green-600' },
                { value: '03', text: 'Statistique 3', color: 'text-red-600' }
            ])
        }
    }
});
</script>

<style scoped>
</style>
