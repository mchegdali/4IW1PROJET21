<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Plus, Minus } from 'lucide-vue-next';

const { isDecreaseDisabled, value } = defineProps<{ isDecreaseDisabled: boolean; value: number }>();

const emit = defineEmits(['increment', 'decrement']);


function onDecrement() {
  emit('decrement');
}

function onIncrement() {
  emit('increment');
}
</script>

<template>
  <div
    class="flex items-center justify-between w-fit rounded-lg overflow-clip border border-tea-300 bg-white *:border-0 *:rounded-none">
    <Button class="rounded" type="button" variant="secondary" size="icon" @click="onDecrement"
      :disabled="isDecreaseDisabled">
      <slot name="minus">
        <Minus width="16" height="16" />
      </slot>
    </Button>
    <span class="text-lg font-semibold w-16 px-1 text-end focus-visible:ring-0 focus-visible:ring-offset-0">{{ value
      }}</span>
    <Button class="rounded" type="button" size="icon" @click="onIncrement">
      <Plus width="16" height="16" />
    </Button>
  </div>
</template>
