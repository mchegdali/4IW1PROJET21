<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <Button as-child>
    <RouterLink :to="{ name: 'home' }" class="p-2 bg-transparent">

      <slot name="icon"></slot>

    </RouterLink>
  </Button>
</template>
