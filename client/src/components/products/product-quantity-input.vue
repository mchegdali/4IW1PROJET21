<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import { Plus, Minus } from 'lucide-vue-next';
// import { type Product } from '@/api/products.api';
import Input from '@/components/ui/input/Input.vue';

// TODO - Use for basket quantity management
// const props = defineProps<{ productId: Product['id'] }>();

const quantity = ref(0);

const isDecreaseDisabled = computed(() => quantity.value === 0);

function onDecrement() {
  if (quantity.value > 0) {
    quantity.value--;
  }
}

function onIncrement() {
  quantity.value++;
}

function onInput(event: InputEvent) {
  const target = event.target as HTMLInputElement;
  quantity.value = target.valueAsNumber;
}
</script>

<template>
  <div
    class="flex items-center justify-between w-fit rounded-lg overflow-clip border border-tea-300 bg-white *:border-0 *:rounded-none"
  >
    <Button
      class="rounded"
      type="button"
      variant="secondary"
      size="icon"
      @click="onDecrement"
      :disabled="isDecreaseDisabled"
    >
      <Minus width="16" height="16" />
    </Button>
    <Input
      class="text-lg font-semibold max-w-16 text-end focus-visible:ring-0 focus-visible:ring-offset-0"
      type="number"
      min="0"
      v-bind:model-value="quantity"
      @input="onInput"
    />
    <Button class="rounded" type="button" size="icon" @click="onIncrement">
      <Plus width="16" height="16" />
    </Button>
  </div>
</template>
