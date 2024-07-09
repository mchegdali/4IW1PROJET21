  <script setup lang="ts">
  import AccountMenu from '@/components/account-menu.vue';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore();
</script>

  <template>
    <h1 class="text-3xl font-bold m-2">Mon compte</h1>
    <div class="flex justify-center mt-10">
      <img class="bg-red-300 rounded-full w-32 h-32"
        src="https://media1.thrillophilia.com/filestore/ur4lt5i6yjilg39oe4at5j1syxmx_IMG20of20-%202.webp" alt="" />
    </div>

    <div class="flex flex-col text-center mt-10">
      <p>Bonjour,</p>
      <p class="font-bold text-2xl">{{ userStore.user?.fullname }}</p>
    </div>

    <div class="mt-10">
      <AccountMenu />
    </div>
  </template>
