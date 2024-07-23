<script setup lang="ts">
import { ShoppingBasket } from 'lucide-vue-next';
import Badge from '../ui/badge/Badge.vue';

import { ref } from 'vue';

const nbItems = defineModel<number>('nbItems', { required: true });
const { size } = withDefaults(defineProps<{ size?: 'small' | 'default' }>(), { size: 'default' });

const basketClass = ref(size === 'small' ? 'size-6' : 'size-8');
const badgeClass = ref(
  size === 'small' ? 'absolute -top-1 -right-1 size-4' : 'absolute -top-2 -right-2 size-5 bg-tea-400'
);
</script>

<template>
  <div class="relative">
    <ShoppingBasket class="size-8 text-inherit" :class="basketClass" />
    <Badge variant="circle" :class="badgeClass" v-if="nbItems > 0">
      {{ nbItems <= 9 ? nbItems : '9+' }} </Badge>
  </div>
</template>
