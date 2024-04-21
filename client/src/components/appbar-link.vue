<script setup lang="ts">
import { RouterLink } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
    <RouterLink :to="{ name: 'home' }" class="p-2">
        <Button variant="link" size="icon">
            <slot name="icon"></slot>
        </Button>
    </RouterLink>
</template>