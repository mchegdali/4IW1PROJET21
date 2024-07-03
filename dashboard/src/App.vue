<script lang="ts">
import Menu from './components/Menu.vue';

export default{
  name: 'App',
  components: {
    Menu,
  },
};
</script>

<template>
  <div>
    <div class="flex">
      <Menu/>
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>
