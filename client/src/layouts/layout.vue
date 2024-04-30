<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import Appbar from '@/components/appbar.vue';
</script>

<template>
  <div class="layout-grid">
    <Navbar class="row-start-1 row-span-1" />
    <main class="row-start-2 row-span-1 pt-2 px-4 overflow-y-scroll overflow-x-clip">
      <RouterView />
    </main>
    <Appbar class="row-start-3 row-span-1" />
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-rows: 56px calc(100svh - 56px - 48px) 48px;
  height: 100svh;
  overflow: clip;
}
</style>
