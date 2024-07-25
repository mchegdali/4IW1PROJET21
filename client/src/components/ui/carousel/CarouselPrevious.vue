<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { useCarousel } from './useCarousel';
import type { WithClassAsProps } from './interface';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const props = defineProps<WithClassAsProps>();

const { orientation, canScrollPrev, scrollPrev } = useCarousel();
</script>

<template>
  <Button
    :disabled="!canScrollPrev"
    :class="
      cn(
        'touch-manipulation absolute border border-background h-8 w-8 rounded-full p-0 bg-background hover:bg-primary hover:text-primary-foreground hover:border-transparent',
        orientation === 'horizontal'
          ? 'left-2 top-1/2 -translate-y-1/2'
          : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
        !canScrollPrev && 'hidden',
        props.class
      )
    "
    variant="outline"
    @click="scrollPrev"
  >
    <slot>
      <ArrowLeft class="h-4 w-4 text-current" />
    </slot>
  </Button>
</template>
