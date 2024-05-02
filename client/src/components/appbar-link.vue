<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';

const { to } = defineProps<{ to: RouteLocationRaw }>()
</script>

<template>
  <Button as-child size="icon" variant="ghost" class="text-slate-800">
    <RouterLink :to="to" class="p-2 bg-transparent">
      <slot name="icon"></slot>
    </RouterLink>
  </Button>
</template>
