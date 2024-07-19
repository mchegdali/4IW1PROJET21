<script setup lang="ts">
import AdresseForm from '@/components/adresse-form.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;
const addressId = route.params.id as string;

const initialAddressData = ref(null);

const loadAddress = async () => {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}/addresses/${addressId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const addressData = await response.json();
    initialAddressData.value = addressData;
  } catch (error) {
    if (import.meta.env.MODE === 'development') {
      console.error('Error loading address:', error);
    }
  }
};

const handleFormSubmission = () => {
  router.push({ name: 'adresses' });
};

onMounted(() => {
  loadAddress();
});
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align">
      <div class="block lg:hidden">
        <router-link :to="{ name: 'adresses' }"><MoveLeft /></router-link>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Modifier votre adresse</h1>
    </div>
    <AdresseForm
      v-if="initialAddressData"
      :isEditing="true"
      :initialAddressData="initialAddressData"
      @submitted="handleFormSubmission"
    />
  </main>
</template>
