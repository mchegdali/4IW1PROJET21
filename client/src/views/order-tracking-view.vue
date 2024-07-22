<script setup lang="ts">
import OrderTracking from '@/components/order-tracking.vue';
import { MoveLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align px-4 mt-2">
      <div class="block lg:hidden" @click="goBack">
        <MoveLeft />
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Suivi de commande</h1>
    </div>
    <div class="sm:mx-[25%]">
      <OrderTracking />
    </div>
  </main>
</template>
