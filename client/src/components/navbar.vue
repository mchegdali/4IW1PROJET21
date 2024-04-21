<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import Input from './ui/input/Input.vue';

</script>

<template>
    <nav class="container p-2 bg-gradient-to-r from-tea-600 to-tea-400 flex justify-center">
        <div class="relative w-full max-w-sm items-center">
            <Input id="search" type="text" placeholder="Rechercher votre thé sur Fanthesie" class="pl-10" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="size-6 text-muted-foreground" />
            </span>
        </div>
    </nav>
</template>