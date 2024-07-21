<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import Appbar from '@/components/appbar.vue';
</script>

<template>
  <div class="h-svh flex flex-col lg:h-auto">
    <Navbar class="sticky top-0 z-10 md:relative" />
    <RouterView />
    <Appbar class="sticky bottom-0 z-10 lg:relative lg:hidden" />
  </div>
</template>
