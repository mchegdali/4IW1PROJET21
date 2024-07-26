<script setup lang="ts">
import Navbar from '@/components/navbar.vue';
import GdprBanner from '@/components/gdpr-banner.vue';
import AppFooter from '@/components/app-footer.vue';
</script>

<template>
  <div class="min-h-svh flex flex-col lg:h-auto">
    <Navbar class="sticky top-0 z-10" />
    <RouterView />
    <AppFooter />
  </div>
  <GdprBanner />
</template>
