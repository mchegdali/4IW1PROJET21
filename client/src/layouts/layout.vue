<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import Appbar from '@/components/appbar.vue';
import GdprBanner from '@/components/gdpr-banner.vue';
import CategoriesMenuBar from '@/components/categories/categories-menu-bar.vue';
</script>

<template>
  <div class="h-svh flex flex-col lg:h-auto">
    <Navbar class="sticky top-0 z-10 md:relative" />
    <CategoriesMenuBar />
    <RouterView />
    <Appbar class="sticky bottom-0 z-10 lg:relative lg:hidden" />
  </div>
  <GdprBanner />
</template>
