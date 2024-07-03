<script setup lang="ts">
import { MoveLeft } from 'lucide-vue-next';
</script>

<template>
  <div class="flex items-center w-full relative align">
    <div class="block lg:hidden">
      <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
    </div>

    <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Carnet d’adresses</h1>
  </div>

  <div class="mt-10 flex flex-col gap-10">
    <RouterLink :to="{ name: 'add-adresse' }" class="w-full bg-tea-600 rounded-lg text-white p-2 text-center">Ajouter une nouvelle adresse</RouterLink>
  

    <div class="rounded shadow-md p-2 flex justify-between">
      <div>
        <p>Jean Dupont</p>
        <p>52 rue Antoine</p>
        <p>Paris</p>
        <p>Ile de France</p>
        <p>77016</p>
        <p>France</p>
        <p>07 45 62 41 23</p>
      </div>

      <RouterLink :to="{ name: 'edit-adresse' }" class="">Modifier</RouterLink>
  
    </div>
  </div>
</template>
