<script setup lang="ts">
import { Package2, ChevronRight, Undo2, Home, SquareUser, MailCheck } from 'lucide-vue-next';
</script>

<template>
  <section class="w-full max-w-screen-sm">
    <RouterLink
      :to="{ name: 'my-informations' }"
      class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between"
    >
      <div class="flex gap-4">
        <p class="text-slate-500"><SquareUser /></p>
        <p>Vos informations</p>
      </div>
      <span><ChevronRight /></span>
    </RouterLink>

    <RouterLink
      :to="{ name: 'orders' }"
      class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between"
    >
      <div class="flex gap-4">
        <p class="text-slate-500"><Package2 /></p>
        <p>Vos commandes</p>
      </div>
      <span><ChevronRight /></span>
    </RouterLink>

    <RouterLink
      :to="{ name: 'addresses' }"
      class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between"
    >
      <div class="flex gap-4">
        <p class="text-slate-500"><Home /></p>
        <p>Carnet d'adresses</p>
      </div>
      <span><ChevronRight /></span>
    </RouterLink>
    <RouterLink
      :to="{ name: 'manage-alerts' }"
      class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between"
    >
      <div class="flex gap-4">
        <p class="text-slate-500"><MailCheck /></p>
        <p>Gérer vos alertes</p>
      </div>
      <span><ChevronRight /></span>
    </RouterLink>
  </section>
</template>
