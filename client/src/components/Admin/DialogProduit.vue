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
              v-model="localProduct.name"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            />
            <div v-if="errors.name" class="col-span-4 text-red-600">{{ errors.name }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="description" class="text-right font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="localProduct.description"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            ></textarea>
            <div v-if="errors.description" class="col-span-4 text-red-600">{{ errors.description }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="category" class="text-right font-medium text-gray-700">Catégorie</label>
            <select
              id="category"
              v-model="localProduct.category._id"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            >
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
            <div v-if="errors.category" class="col-span-4 text-red-600">{{ errors.category }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="price" class="text-right font-medium text-gray-700">Prix</label>
            <input
              id="price"
              v-model="localProduct.price"
              type="number"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            />
            <div v-if="errors.price" class="col-span-4 text-red-600">{{ errors.price }}</div>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <label for="image" class="text-right font-medium text-gray-700">Image</label>
            <input
              id="image"
              type="file"
              @change="handleImageUpload"
              class="col-span-3 p-2 border border-gray-300 rounded-md"
            />
            <div v-if="errors.image" class="col-span-4 text-red-600">{{ errors.image }}</div>
          </div>
        </div>
        <div class="flex justify-end mt-6">
          <button
            @click="saveChanges"
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
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  id?: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  image?: string;
}

export default defineComponent({
  name: 'DialogProduct',
  props: {
    product: {
      type: Object as PropType<Product>,
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
      localProduct: { ...this.product },
      categories: [] as Category[],
      imageFile: null as File | null,
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
    product(newVal) {
      this.localProduct = { ...newVal };
    }
  },
  computed: {
    title() {
      return this.isEditMode ? "Modifier le produit" : "Créer un produit";
    }
  },
  methods: {
    closeDialog() {
      this.isOpen = false;
    },
    async fetchCategories() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.categories = data;
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        this.imageFile = file;
      } else {
        this.imageFile = null;
      }
    },
    async saveChanges() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;
      const url = this.isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/products/${this.localProduct.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/products`;
      const method = this.isEditMode ? 'PATCH' : 'POST';
      try {
        const formData = new FormData();
        formData.append('name', this.localProduct.name);
        formData.append('description', this.localProduct.description);
        formData.append('categoryId', this.localProduct.category._id);
        formData.append('price', String(this.localProduct.price));
        if (this.imageFile) {
          formData.append('image', this.imageFile);
        }

        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          this.handleErrors(errorData);
          return;
        }

        const result = await response.json();
        this.$emit('save', result);
        this.closeDialog();
      } catch (error) {
        console.error(`Error saving changes:`, error);
      }
    },
    handleErrors(errorData) {
      this.errors = {};
      for (const key in errorData) {
        if (errorData.hasOwnProperty(key)) {
          this.errors[key] = errorData[key];
        }
      }
    }
  },
  mounted() {
    this.fetchCategories();
  }
});
</script>

<style scoped>
.readonly-input {
  pointer-events: none;
  caret-color: transparent;
}
</style>
