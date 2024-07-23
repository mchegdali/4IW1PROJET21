<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50">
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="closeDialog"
      ></div>
      <div class="bg-white p-6 rounded-lg shadow-lg z-10 max-w-lg w-full mx-4">
        <div class="mb-4">
          <h3 class="text-2xl font-semibold text-gray-800">{{ title }}</h3>
        </div>
        <div class="dialog-content grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="nom" class="text-right font-medium text-gray-700">Nom Complet</label>
            <input
              id="nom"
              v-model="localClient.fullname"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
              :readonly="!isEditMode"
              :class="!isEditMode ? 'readonly-input' : ''"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="email" class="text-right font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="localClient.email"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
              :readonly="!isEditMode"
              :class="!isEditMode ? 'readonly-input' : ''"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="ville" class="text-right font-medium text-gray-700">Ville</label>
            <input
              id="ville"
              v-model="localClient.city"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
              :readonly="!isEditMode"
              :class="!isEditMode ? 'readonly-input' : ''"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="role" class="text-right font-medium text-gray-700">Role</label>
            <input
              id="role"
              v-model="localClient.role"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
              :readonly="!isEditMode"
              :class="!isEditMode ? 'readonly-input' : ''"
            />
          </div>
          <div v-for="(address, index) in localClient.addresses" :key="index">
            <Adresse :address="address" :is-edit-mode="isEditMode" @delete-address="handleDeleteAddress" />
          </div>
          <div v-if="isEditMode" class="flex justify-end mt-4">
            <button @click="addAddress" class="bg-blue-500 text-white px-4 py-2 rounded">
              Ajouter une adresse
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button
            v-if="isEditMode"
            @click="saveChanges"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150"
          >
            Enregistrer
          </button>
          <button
            @click="closeDialog"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import type { PropType } from 'vue';
import { useUserStore } from '@/stores/user';
import Adresse from './Adresse.vue';

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

interface Client {
  id: string;
  fullname: string;
  email: string;
  city: string;
  role: string;
  addresses: Address[];
}

export default defineComponent({
  name: 'DialogUtilisateur',
  components: { Adresse },
  props: {
    client: {
      type: Object as PropType<Client>,
      required: true
    },
    modelValue: {
      type: Boolean,
      required: true
    },
    isEditMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      isOpen: this.modelValue,
      localClient: { ...this.client },
      addressesToDelete: [] as string[]
    };
  },
  watch: {
    modelValue(newVal) {
      this.isOpen = newVal;
    },
    isOpen(newVal) {
      this.$emit('update:modelValue', newVal);
    },
    client(newVal) {
      this.localClient = { ...newVal };
    }
  },
  computed: {
    title() {
      return this.isEditMode ? "Modifier l'utilisateur" : "Détails de l'utilisateur";
    }
  },
  methods: {
    closeDialog() {
      this.isOpen = false;
    },
    async saveChanges() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;
      try {
        // Suppression des adresses
        for (const addressId of this.addressesToDelete) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${this.localClient.id}/addresses/${addressId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
          });
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${this.localClient.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(this.localClient)
        });
        if (response.ok) {
          this.$emit('save', this.localClient);
          this.closeDialog();
        } else {
          console.error('Failed to update client');
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
    addAddress() {
      this.localClient.addresses.push({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        region: '',
        zipCode: '',
        country: '',
        phone: ''
      });
    },
    handleDeleteAddress(address: Address) {
      if (address.id) {
        this.addressesToDelete.push(address.id);
      }
      const index = this.localClient.addresses.indexOf(address);
      if (index !== -1) {
        this.localClient.addresses.splice(index, 1);
      }
    }
  }
});
</script>

<style scoped>
.readonly-input {
  pointer-events: none;
  caret-color: transparent;
}
.dialog-content {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 1rem;
}
</style>