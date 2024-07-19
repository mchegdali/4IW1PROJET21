<script setup lang="ts">
import AdresseForm from '@/components/adresse-form.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MoveLeft } from 'lucide-vue-next';

const initialAddressData = ref({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  region: '',
  zipCode: '',
  country: '',
  phone: ''
});

const router = useRouter();

const handleFormSubmission = () => {
  router.push({ name: 'adresses' });
};
</script>

<template>
  <main class="grow">
    <div class="flex items-center w-full relative align px-4 mt-2">
      <div class="block lg:hidden">
        <router-link :to="{ name: 'adresses' }"><MoveLeft /></router-link>
      </div>
      <h1 class="font-bold text-lg text-center w-full sm:text-3xl">Ajouter une adresse</h1>
    </div>
    <AdresseForm
      :isEditing="false"
      :initialAddressData="initialAddressData"
      @submitted="handleFormSubmission"
    />
  </main>
</template>
