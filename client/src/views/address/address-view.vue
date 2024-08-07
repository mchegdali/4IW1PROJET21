<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilePenLine, MoveLeft, Trash } from 'lucide-vue-next';
import ConfirmModal from '../../components/modal/confirm-modal.vue';
import config from '@/config';

interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  phone: string;
}

const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;

const addresses = ref<Address[]>([]);
const showModal = ref(false);
const addressToDelete = ref<string | null>(null);
const customMessage = ref('Êtes-vous sûr de vouloir supprimer cette adresse ?');

const getAddresses = async () => {
  try {
    const response = await fetch(`${config.apiBaseUrl}/users/${userId}/addresses/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Fetched addresses:', data);
    addresses.value = data;
  } catch (error) {
    console.error('Erreur lors de la récupération des adresses:', error);
  }
};

const deleteAddress = (addressId: string) => {
  console.log('Address ID to delete:', addressId);
  showModal.value = true;
  addressToDelete.value = addressId;
};

const confirmDeletion = async () => {
  if (!addressToDelete.value) {
    console.error('No address ID provided for deletion');
    return;
  }

  console.log('Deleting address with ID:', addressToDelete.value);

  try {
    const response = await fetch(
      `${config.apiBaseUrl}/users/${userId}/addresses/${addressToDelete.value}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    addresses.value = addresses.value.filter((address) => address._id !== addressToDelete.value);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'adresse:", error);
  } finally {
    showModal.value = false;
  }
};

onMounted(() => {
  getAddresses();
});
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align mt-2">
      <div class="block lg:hidden">
        <RouterLink :to="{ name: 'account' }"><MoveLeft /></RouterLink>
      </div>

      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Carnet d’adresses</h1>
    </div>

    <div class="mt-4 flex justify-center">
      <RouterLink
        :to="{ name: 'add-addresse' }"
        class="bg-tea-600 rounded-lg text-white p-2 text-center"
        >Ajouter une nouvelle adresse</RouterLink
      >
    </div>

    <div
      v-for="address in addresses"
      :key="address._id"
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
          :to="{ name: 'edit-addresse', params: { id: address._id } }"
          class="text-tea-600 hover:text-tea-900"
        >
          <FilePenLine class="w-5 h-5" />
        </RouterLink>
        <button @click="deleteAddress(address._id)" class="text-red-500 hover:text-red-700">
          <Trash class="w-5 h-5" />
        </button>
      </div>
    </div>
  </main>

  <ConfirmModal
    v-if="showModal"
    :show="showModal"
    :message="customMessage"
    @close="showModal = false"
    @confirm="confirmDeletion"
  />
</template>
