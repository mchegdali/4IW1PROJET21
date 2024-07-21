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
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="nom" class="text-right font-medium text-gray-700">Nom</label>
            <input
              id="nom"
              v-model="localClient.nom"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="prenom" class="text-right font-medium text-gray-700">Prénom</label>
            <input
              id="prenom"
              v-model="localClient.prenom"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="email" class="text-right font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="localClient.email"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="ville" class="text-right font-medium text-gray-700">Ville</label>
            <input
              id="ville"
              v-model="localClient.ville"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
              :disabled="!isEditMode"
            />
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

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  ville: string;
}

export default defineComponent({
  name: 'DialogUtilisateur',
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
      localClient: { ...this.client }
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
    saveChanges() {
      this.$emit('save', this.localClient);
      this.closeDialog();
    }
  }
});
</script>

<style scoped></style>
