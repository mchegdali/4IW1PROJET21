<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import Appbar from '@/components/appbar.vue';
</script>

<template>
    <div class="h-svh layout-grid">
        <Navbar class="row-start-1 row-span-1" />
        <main class="row-start-2 row-span-1">
            <RouterView />
        </main>
        <Appbar class="row-start-3 row-span-1" />
    </div>
</template>

<style scoped>
.layout-grid {
    display: grid;
    grid-template-rows: min-content 1fr min-content;
}
</style>