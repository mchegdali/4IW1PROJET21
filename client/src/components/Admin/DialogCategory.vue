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
            <label for="name" class="text-right font-medium text-gray-700">Nom</label>
            <input
              id="name"
              v-model="localCategory.name"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            />
            <div v-if="errors.name" class="col-span-4 text-red-600">{{ errors.name }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="description" class="text-right font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="localCategory.description"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            ></textarea>
            <div v-if="errors.description" class="col-span-4 text-red-600">{{ errors.description }}</div>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="validateAndSave"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-150"
          >
            {{ isEditMode ? 'Enregistrer' : 'Créer' }}
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
import { defineComponent, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import { useUserStore } from '@/stores/user';

interface Category {
  id?: string;
  name: string;
  description: string;
}

export default defineComponent({
  name: 'DialogCategory',
  props: {
    category: {
      type: Object as PropType<Category>,
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
      localCategory: { ...this.category },
      errors: {} as Record<string, string>
    };
  },
  watch: {
    modelValue(newVal) {
      this.isOpen = newVal;
    },
    isOpen(newVal) {
      this.$emit('update:modelValue', newVal);
    },
  },
  computed: {
    title() {
      return this.isEditMode ? "Modifier la catégorie" : "Créer une catégorie";
    }
  },
  methods: {
    closeDialog() {
      this.isOpen = false;
    },
    validateAndSave() {
      this.errors = {};
      
      if (!this.localCategory.name || this.localCategory.name.length < 2) {
        this.errors.name = 'Le nom doit contenir au moins 2 caractères';
      }
      if (!this.localCategory.description || this.localCategory.description.length < 2) {
        this.errors.description = 'La description doit contenir au moins 2 caractères';
      }

      if (Object.keys(this.errors).length === 0) {
        this.saveChanges();
      }
    },
    async saveChanges() {
  const userStore = useUserStore();
  await userStore.refreshAccessToken();
  const accessToken = userStore.accessToken;
  const url = this.isEditMode 
    ? `${import.meta.env.VITE_API_BASE_URL}/categories/${this.localCategory._id}`
    : `${import.meta.env.VITE_API_BASE_URL}/categories`;
  const method = this.isEditMode ? 'PATCH' : 'POST';
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        name: this.localCategory.name,
        description: this.localCategory.description
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      this.handleErrors(errorData);
      return;
    }

    const result = await response.json();
    this.$emit('save', result); // Émettre l'événement 'save' avec le produit mis à jour
    this.closeDialog();
  } catch (error) {
    console.error(`Error saving changes:`, error);
  }
},
    handleErrors(errorData) {
      this.errors = {};
      for (const key in errorData) {
        if (Object.prototype.hasOwnProperty.call(errorData, key)) {
          this.errors[key] = errorData[key];
        }
      }
    }
  },
});
</script>

<style scoped>
.readonly-input {
  pointer-events: none;
  caret-color: transparent;
}
</style>