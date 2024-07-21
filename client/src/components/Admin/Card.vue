<template>
  <router-link :to="{ name: page }" class="group">
    <div
      class="p-10 rounded-lg mb-8 pl-4 bg-white group-hover:bg-green-100 transition-colors duration-200"
    >
      <div class="flex items-center justify-center space-x-4 py-4">
        <div>
          <img :src="image" alt="" class="object-contain h-10 rounded-full" />
        </div>
        <div>
          <h2 class="font-bold group-hover:text-green-500">{{ title }}</h2>
        </div>
      </div>
      <div class="h-16 flex flex-col p-2 rounded-lg">
        <div class="flex space-x-4 pb-2">
          <div class="text-center">
            {{ text }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Card',
  props: {
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    page: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped></style>
