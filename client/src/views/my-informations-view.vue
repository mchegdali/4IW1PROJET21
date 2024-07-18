<script setup lang="ts">
import MyInformationForm from '@/components/my-information-form.vue';
import { MoveLeft } from 'lucide-vue-next';
</script>

<template>
  <div class="flex items-center w-full relative align">
    <div class="block lg:hidden">
      <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
    </div>

    <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Mes informations</h1>
  </div>

  <div class="mt-10">
    <MyInformationForm />
  </div>
</template>
