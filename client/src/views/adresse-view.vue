<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilePenLine, MoveLeft, Trash } from 'lucide-vue-next';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;

const addresses = ref([]);

const getAddresses = async () => {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}/addresses/`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    addresses.value = data;
  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error);
  }
};

const deleteAddress = async (addressId) => {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}/addresses/${addressId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    addresses.value = addresses.value.filter((address) => address._id !== addressId);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'adresse:", error);
  }
};

onMounted(() => {
  getAddresses();
});
</script>

<template>
  <div class="flex items-center w-full relative align">
    <div class="block lg:hidden">
      <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
    </div>

    <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Carnet d’adresses</h1>
  </div>

  <div class="mt-10 flex">
    <RouterLink
      :to="{ name: 'add-adresse' }"
      class="w-full bg-tea-600 rounded-lg text-white p-2 text-center"
      >Ajouter une nouvelle adresse</RouterLink
    >
  </div>
  <div
    v-for="address in addresses"
    :key="address.id"
    class="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center mt-5"
  >
    <div>
      <p class="font-semibold text-lg">{{ address.firstName }} {{ address.lastName }}</p>
      <p>{{ address.street }}</p>
      <p>{{ address.city }}</p>
      <p>{{ address.region }}</p>
      <p>{{ address.zipCode }}</p>
      <p>{{ address.country }}</p>
      <p>{{ address.phone }}</p>
    </div>

    <div class="flex space-x-4">
      <RouterLink
        :to="{ name: 'edit-adresse', params: { id: address.id } }"
        class="text-blue-500 hover:text-blue-700"
      >
        <FilePenLine class="w-5 h-5" />
      </RouterLink>
      <button @click="deleteAddress(address._id)" class="text-red-500 hover:text-red-700">
        <Trash class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
