<script setup lang="ts">
import { Package2, Home, SquareUser, MailCheck } from 'lucide-vue-next';
import AccountMenuItem from './account-menu-item.vue'
</script>

<template>
  <section class="w-full max-w-screen-sm lg:border lg:border-tea-50 lg:rounded lg:shadow-sm ">
    <AccountMenuItem text="Vos informations" :to="{ name: 'my-informations' }">
      <template #icon>
        <SquareUser />
      </template>
    </AccountMenuItem>
    <AccountMenuItem text="Vos commandes" :to="{ name: 'orders' }">
      <template #icon>
        <Package2 />
      </template>
    </AccountMenuItem>
    <AccountMenuItem text="Carnet d'adresses" :to="{ name: 'addresses' }">
      <template #icon>
        <Home />
      </template>
    </AccountMenuItem>
    <AccountMenuItem text="Gérer vos alertes" :to="{ name: 'manage-alerts' }">
      <template #icon>
        <MailCheck />
      </template>
    </AccountMenuItem>
  </section>
</template>
