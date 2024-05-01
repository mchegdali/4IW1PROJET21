<script setup lang="ts">
import Button from '../ui/button/Button.vue';
const emit = defineEmits<{
  click: [count: number];
}>();

function onClick(count: number) {
  emit('click', count);
}
</script>

<template>
  <Button class="uppercase font-medium" @click="onClick">Ajouter au panier</Button>
</template>
