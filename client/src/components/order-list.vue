<script setup lang="ts">
import { computed, ref } from 'vue';

const items = ref<Array<any>>([]);

fetch("http://localhost:3000/products")
  .then((response) => response.json())
  .then((data) => {
    items.value = data;
  });

console.log(items);

const displayedItems = computed(() => {
  return items.value.slice(0, 3);
});

const extraItemsCount = computed(() => {
  return items.value.length > 3 ? items.value.length - 3 : 0;
});
</script>

<template>  
  <div class="rounded-lg p-5 shadow-lg flex flex-col gap-4">
    <h1 class="font-bold">Commande du 31 Janv. 2024</h1>
    <div class="flex justify-between w-full">
      <div v-for="(item, index) in displayedItems" :key="item.id" class="relative w-24 h-24">
        <img class="min-w-24 h-full bg-slate-400" :src="item.image" alt="" />
        <div v-if="index === 2 && extraItemsCount > 0" class="extra-items-count w-full h-full flex justify-center items-center font-bold text-2xl top-0 right-0 text-white absolute bg-black bg-opacity-55">
          +{{ extraItemsCount }}
        </div>
      </div>
    </div>
    <div class="border-b border-t border-gray-200 py-2">
      <a href="">Suivre le colis</a>
    </div>
    <div>
      <p>N° de commande: 785216169</p>
      <p>Date d'éxpedition: 29 janv. 2024</p>
    </div>
  </div>
</template>