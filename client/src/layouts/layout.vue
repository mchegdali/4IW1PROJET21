<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import Appbar from '@/components/appbar.vue';
</script>

<template>
  <div
    class="grid grid-rows-[min-content_1fr_min-content] h-svh md:h-auto overflow-clip md:grid-rows-[min-content_1fr]">
    <Navbar class="row-start-1 row-span-1" />
    <main class="row-start-2 row-span-1 pt-2 px-4 overflow-y-auto overflow-x-clip">
      <RouterView />
    </main>
    <Appbar class="row-start-3 row-span-1 md:hidden" />
  </div>
</template>
