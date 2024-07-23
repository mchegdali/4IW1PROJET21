<template>
  <div class="address-item border p-4 mb-4 rounded">
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="firstName" class="text-right font-medium text-gray-700">Prénom</label>
      <input
        id="firstName"
        v-model="address.firstName"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.firstName" class="col-span-4 text-red-600">{{ errors.firstName }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="lastName" class="text-right font-medium text-gray-700">Nom</label>
      <input
        id="lastName"
        v-model="address.lastName"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.lastName" class="col-span-4 text-red-600">{{ errors.lastName }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="street" class="text-right font-medium text-gray-700">Rue</label>
      <input
        id="street"
        v-model="address.street"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.street" class="col-span-4 text-red-600">{{ errors.street }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="city" class="text-right font-medium text-gray-700">Ville</label>
      <input
        id="city"
        v-model="address.city"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.city" class="col-span-4 text-red-600">{{ errors.city }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="region" class="text-right font-medium text-gray-700">Région</label>
      <input
        id="region"
        v-model="address.region"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.region" class="col-span-4 text-red-600">{{ errors.region }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="zipCode" class="text-right font-medium text-gray-700">Code Postal</label>
      <input
        id="zipCode"
        v-model="address.zipCode"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.zipCode" class="col-span-4 text-red-600">{{ errors.zipCode }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="country" class="text-right font-medium text-gray-700">Pays</label>
      <input
        id="country"
        v-model="address.country"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.country" class="col-span-4 text-red-600">{{ errors.country }}</div>
    </div>
    <div class="grid grid-cols-4 items-center gap-4 mb-4">
      <label for="phone" class="text-right font-medium text-gray-700">Téléphone</label>
      <input
        id="phone"
        v-model="address.phone"
        class="col-span-3 p-2 border border-gray-300 rounded-md"
        :disabled="!isEditMode"
      />
      <div v-if="errors && errors.phone" class="col-span-4 text-red-600">{{ errors.phone }}</div>
    </div>
    <div class="flex justify-end">
      <button 
        @click="deleteAddress" 
        class="bg-red-500 text-white px-4 py-2 rounded"
        v-if="isEditMode"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  phone: string;
}

export default defineComponent({
  name: 'Adresse',
  props: {
    address: {
      type: Object as PropType<Address>,
      required: true
    },
    isEditMode: {
      type: Boolean,
      required: true
    },
    errors: {
      type: Object as PropType<Record<string, string>>,
      required: false,
      default: () => ({})
    }
  },
  methods: {
    deleteAddress() {
      this.$emit('delete-address', this.address);
    }
  }
});
</script>

<style scoped>
.address-item {
  background-color: #f9f9f9;
}
</style>
