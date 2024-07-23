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
            <label for="fullname" class="text-right font-medium text-gray-700">Nom Complet</label>
            <input
              id="fullname"
              v-model="localClient.fullname"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode || isReadOnly"
              :readonly="!isEditMode || isReadOnly"
              :class="(!isEditMode || isReadOnly) ? 'readonly-input' : ''"
            />
            <div v-if="errors.fullname" class="col-span-4 text-red-600">{{ errors.fullname }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="email" class="text-right font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="localClient.email"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode || isReadOnly"
              :readonly="!isEditMode || isReadOnly"
              :class="(!isEditMode || isReadOnly) ? 'readonly-input' : ''"
            />
            <div v-if="errors.email" class="col-span-4 text-red-600">{{ errors.email }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="role" class="text-right font-medium text-gray-700">Role</label>
            <input
              id="role"
              v-model="localClient.role"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode || isReadOnly"
              :readonly="!isEditMode || isReadOnly"
              :class="(!isEditMode || isReadOnly) ? 'readonly-input' : ''"
            />
            <div v-if="errors.role" class="col-span-4 text-red-600">{{ errors.role }}</div>
          </div>
          <div v-for="(address, index) in localClient.addresses" :key="address.id || index">
            <Adresse
              :address="address"
              :is-edit-mode="isEditMode && !isReadOnly"
              @delete-address="handleDeleteAddress(index, address)"
              @update:address="updateAddress(index, $event)"
              :errors="addressErrors[index]"
            />
          </div>
          <div v-if="isEditMode && !isReadOnly" class="flex justify-end mt-4">
            <button @click="addAddress" class="bg-blue-500 text-white px-4 py-2 rounded">
              Ajouter une adresse
            </button>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button
            v-if="isEditMode && !isReadOnly"
            @click="validateAndSave"
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
import { defineComponent, reactive, watch } from 'vue';
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
  status?: string;
}

interface Client {
  id: string;
  fullname: string;
  email: string;
  role: string;
  addresses: Address[];
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
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
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'save', 'refresh'],
  data() {
    return {
      isOpen: this.modelValue,
      localClient: deepClone(this.client),
      addressesToDelete: [] as string[],
      errors: {} as Record<string, string>,
      addressErrors: [] as Record<string, string>[]
    };
  },
  watch: {
    modelValue(newVal) {
      this.isOpen = newVal;
    },
    isOpen(newVal) {
      if (newVal !== this.modelValue) {
        this.$emit('update:modelValue', newVal);
      }
    },
    client(newVal) {
      this.localClient = deepClone(newVal);
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
    validateUser() {
      this.errors = {};

      if (!this.localClient.fullname || this.localClient.fullname.length < 2) {
        this.errors.fullname = 'Le nom doit contenir au moins 2 caractères';
      }
      if (!this.localClient.email || !/\S+@\S+\.\S+/.test(this.localClient.email)) {
        this.errors.email = 'Adresse email invalide';
      }
      if (!this.localClient.role) {
        this.errors.role = 'Le rôle est requis';
      }

      return Object.keys(this.errors).length === 0;
    },
    validateAddresses() {
      this.addressErrors = this.localClient.addresses.map(address => {
        const errors: Record<string, string> = {};
        if (!address.firstName || address.firstName.length < 2) {
          errors.firstName = 'Prénom invalide';
        }
        if (!address.lastName || address.lastName.length < 2) {
          errors.lastName = 'Nom de famille invalide';
        }
        if (!address.street || address.street.length < 2) {
          errors.street = 'Adresse invalide';
        }
        if (!address.city || address.city.length < 2) {
          errors.city = 'Ville invalide';
        }
        if (!address.region || address.region.length < 2) {
          errors.region = 'Région invalide';
        }
        if (!address.zipCode || !/^\d{5}$/.test(address.zipCode)) {
          errors.zipCode = 'Code postal invalide';
        }
        if (!address.country || address.country.length < 2) {
          errors.country = 'Pays invalide';
        }
        if (!address.phone || !/^\d{10}$/.test(address.phone)) {
          errors.phone = 'Numéro de téléphone invalide';
        }
        return errors;
      });

      return this.addressErrors.every(errors => Object.keys(errors).length === 0);
    },
    async validateAndSave() {
      const isUserValid = this.validateUser();
      const areAddressesValid = this.validateAddresses();

      if (isUserValid && areAddressesValid) {
        await this.saveChanges();
      }
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

        // Création des nouvelles adresses
        for (const address of this.localClient.addresses) {
          if (address.status === 'create') {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${this.localClient.id}/addresses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify(address)
            });
          } else if (address.status === 'update') {
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${this.localClient.id}/addresses/${address.id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
              },
              body: JSON.stringify(address)
            });
          }
        }

        // Mise à jour des informations de l'utilisateur
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
          this.addressesToDelete = [];
          this.$emit('refresh');
          this.closeDialog();
        } else {
          console.error('Failed to update client');
        }
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
    addAddress() {
      const newAddress: Address = {
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        region: '',
        zipCode: '',
        country: '',
        phone: '',
        status: 'create'
      };
      this.localClient.addresses.push(newAddress);
      this.addressErrors.push({});
    },
    handleDeleteAddress(index: number, address: Address) {
      if (address.id) {
        this.addressesToDelete.push(address.id);
      }
      this.localClient.addresses.splice(index, 1);
      this.addressErrors.splice(index, 1);
    },
    updateAddress(index: number, updatedAddress: Address) {
      if (updatedAddress.id) {
        updatedAddress.status = 'update';
      }
      this.localClient.addresses.splice(index, 1, updatedAddress);
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