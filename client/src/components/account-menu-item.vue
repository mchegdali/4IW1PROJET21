<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import type { RouteLocationRaw } from 'vue-router';

defineProps<{
    text: string;
    to: RouteLocationRaw;
}>();
</script>

<template>
    <RouterLink :to="to"
        class="w-full bg-white flex border-b border-tea-50 p-4 pl-10 justify-between lg:hover:bg-tea-50">
        <div class="flex gap-4 text-tea-500">
            <slot name="icon" />
            <p class="text-foreground">{{ text }}</p>
        </div>
        <span>
            <ChevronRight class="" />
        </span>
    </RouterLink>
</template>
