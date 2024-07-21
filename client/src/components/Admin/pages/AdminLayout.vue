<template>
  <div>
    <div class="flex">
      <Menu />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menu from '../Menu.vue';

export default defineComponent({
  name: 'AdminLayout',
  components: {
    Menu
  }
});
</script>

<style scoped>
/* Ajoutez vos styles ici */
</style>
