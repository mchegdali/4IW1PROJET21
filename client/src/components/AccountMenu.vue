<script setup lang="ts">
import { Package2, ChevronRight, Undo2, CreditCard, Home, SquareUser } from 'lucide-vue-next'
</script>

<template>
  <div class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between">
    <div class="flex gap-4">
      <p class="text-slate-500"><Package2 /></p>
      <p>Mes commandes</p>
    </div>
    <span><ChevronRight /></span>
  </div>

  <div class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between">
    <div class="flex gap-4">
      <p class="text-slate-500"><Undo2 /></p>
      <p>Mes retours</p>
    </div>
    <span><ChevronRight /></span>
  </div>

  <div class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between">
    <div class="flex gap-4">
      <p class="text-slate-500"><SquareUser /></p>
      <p>Mes informations</p>
    </div>
    <span><ChevronRight /></span>
  </div>

  <div class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between">
    <div class="flex gap-4">
      <p class="text-slate-500"><Home /></p>
      <p>Carnet d’adresses</p>
    </div>
    <span><ChevronRight /></span>
  </div>

  <div class="w-full bg-white flex border-b border-gray-200 p-4 pl-10 justify-between">
    <div class="flex gap-4">
      <p class="text-slate-500"><CreditCard /></p>
      <p>Modes de paiement</p>
    </div>
    <span><ChevronRight /></span>
  </div>
</template>
