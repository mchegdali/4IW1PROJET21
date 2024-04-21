<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
watch(() => route.params.id, (newId, oldId) => {
    console.log('newId', newId);
    console.log('oldId', oldId);
})
</script>

<template>
    <header class="flex flex-col gap-1">
        <h1 class="text-4xl font-extrabold">Titre de produit</h1>
        <p class="text-sm font-semibold">Catégorie de produit</p>
        <img src="https://via.placeholder.com/256" alt="product" height="256" width="256" class="self-center" />
    </header>
</template>