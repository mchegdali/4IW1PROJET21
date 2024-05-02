<script setup lang="ts">
import { type Product } from '@/api/products.api';
import { ref, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
const { product, isExtensible } = withDefaults(
  defineProps<{ product: Product; isExtensible: boolean }>(),
  { isExtensible: true }
);

const isExtended = ref(false);
const buttonLabel = computed(() => (isExtended.value ? 'Réduire' : 'Lire plus'));
function toggleExtended() {
  isExtended.value = !isExtended.value;
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <p :class="`text-sm font-semibold ${!isExtended && 'line-clamp-3'}`">
      {{ product.description }}
    </p>
    <Button
      v-if="isExtensible"
      variant="link"
      class="font-extrabold bg-none hover:decoration-transparent"
      @click="toggleExtended"
    >
      {{ buttonLabel }}
    </Button>
  </div>
</template>
