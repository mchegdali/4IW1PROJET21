<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Plus, Minus } from 'lucide-vue-next';
import Input from '@/components/ui/input/Input.vue';

const { isDecreaseDisabled, value } = withDefaults(
  defineProps<{ isDecreaseDisabled: boolean; value: number }>(),
  {
    value: 0,
    isDecreaseDisabled: false
  }
);
const emit = defineEmits(['increment', 'decrement', 'input']);

function onInput(inputValue: string | number) {
  const value = parseInt(`${inputValue}`.replace(/\D/g, ''), 10);
  emit('input', value);
}

function onDecrement() {
  emit('decrement');
}

function onIncrement() {
  emit('increment');
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
      <slot name="minus">
        <Minus width="16" height="16" />
      </slot>
    </Button>
    <Input
      class="text-lg font-semibold max-w-16 text-end focus-visible:ring-0 focus-visible:ring-offset-0"
      type="text"
      pattern="\d+"
      @update:model-value="onInput"
      :model-value="value"
    />
    <Button class="rounded" type="button" size="icon" @click="onIncrement">
      <Plus width="16" height="16" />
    </Button>
  </div>
</template>
