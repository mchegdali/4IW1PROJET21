<script setup lang="ts">
import { Search, ShoppingBasket } from 'lucide-vue-next';
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';

import logo from '@/assets/images/fanthesie.png';
</script>

<template>
  <nav class="px-4 py-2 bg-gradient-to-r from-tea-600 to-tea-400 w-svw">
    <div class="flex justify-center md:justify-around md:items-center gap-8 ">
      <RouterLink :to="{ name: 'home' }"><img :src="logo" alt="Fanthesie"
          class="hidden w-auto h-12 md:inline md:justify-self-start" /></RouterLink>
      <div class="relative w-full max-w-sm items-center md:max-w-lg lg:max-w-xl xl:max-w-4xl 2xl:max-w-5xl">
        <Input id="search" type="text" placeholder="Rechercher votre thé sur Fanthesie" class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
      <div class="hidden md:flex">
        <Button variant="link" as-child class="text-white">
          <RouterLink :to="{ name: 'login' }">
            Se connecter
          </RouterLink>
        </Button>
        <Button variant="link" as-child class="text-white">
          <RouterLink :to="{ name: 'basket' }" class="flex items-end">
            <ShoppingBasket class="size-8" />
            Panier
          </RouterLink>
        </Button>
      </div>
    </div>
  </nav>
</template>
