<script setup lang="ts">
import openSources from '@/assets/open-sources.json';
</script>

<template>
  <main class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Licences open-source</h1>
    <div v-for="pkg in openSources" :key="pkg.name" class="mb-6 p-4 bg-white shadow rounded-lg">
      <h2 class="text-xl font-semibold mb-2 text-gray-700">
        {{ pkg.name }}
        <span class="text-sm font-normal text-gray-500">(version {{ pkg.version }})</span>
      </h2>
      <p class="mb-1"><span class="font-medium text-gray-600">Licence :</span> {{ pkg.license }}</p>
      <p class="mb-1">
        <span class="font-medium text-gray-600">Lien npm :</span>
        <a :href="pkg.npmLink" target="_blank" class="text-blue-600 hover:underline">{{
          pkg.npmLink
        }}</a>
      </p>
      <p>
        <span class="font-medium text-gray-600">Lien du dépôt :</span>
        <a
          v-if="pkg.repositoryLink !== 'Non disponible'"
          :href="pkg.repositoryLink"
          target="_blank"
          class="text-blue-600 hover:underline"
          >{{ pkg.repositoryLink }}</a
        >
        <span v-else class="text-gray-500">{{ pkg.repositoryLink }}</span>
      </p>
    </div>
  </main>
</template>
