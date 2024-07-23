<template>
  <section class="flex-1 ml-80">
    <div class="container mx-auto mb-16 mt-12">
      <div class="flex justify-between items-center w-full bg-gray-100 p-3 border-t border-l border-r border-gray-300">
        <h2 class="text-xl font-bold">Gestion des catégories</h2>
        <div class="flex items-center space-x-2">
          <button
            @click="openCreateDialog"
            class="text-black bg-gradient-to-r from-blue-300 to-blue-400 hover:bg-gradient-to-l hover:from-blue-400 hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-200 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Créer une catégorie
          </button>
        </div>
      </div>
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-100">
          <tr class="h-16">
            <th class="py-2 px-4 w-1/6">ID</th>
            <th class="py-2 px-4 w-1/6">Nom</th>
            <th class="py-2 px-4 w-1/6">Description</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" class="border-t hover:bg-gray-50">
            <td class="py-2 px-4 text-center w-1/6">{{ category._id }}</td>
            <td class="py-2 px-4 text-center w-1/6">{{ category.name }}</td>
            <td class="py-2 px-4 text-center w-1/6">{{ category.name }}</td>
            <td class="py-2 px-4 text-center w-1/6">
              <button
                class="text-white bg-gradient-to-br from-blue-500 to-cyan-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                @click="openEditDialog(category)"
              >
                Éditer
              </button>
              <button
                class="text-gray-900 bg-gradient-to-r from-red-400 via-red-300 to-orange-300 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                @click="deleteCategory(category.id)"
              >
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <DialogCategory
        v-if="isDialogOpen"
        :category="selectedCategory"
        v-model:modelValue="isDialogOpen"
        :isEditMode="isEditMode"
        @save="handleSave"
      />
    </div>
  </section>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import DialogCategory from '../DialogCategory.vue';

export default defineComponent({
  components: {
    DialogCategory
  },
  data() {
    return {
      categories: [],
      isDialogOpen: false,
      selectedCategory: null,
      isEditMode: false
    };
  },
  async mounted() {
    await this.fetchCategories();
  },
  methods: {
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.categories = data;
      } catch (error) {
        console.error('Error fetching categories:', error);
        this.categories = [];
      }
    },
    openEditDialog(category) {
      this.selectedCategory = category;
      this.isEditMode = true;
      this.isDialogOpen = true;
    },
    openCreateDialog() {
      this.selectedCategory = {
        name: '',
        description: '',
      };
      this.isEditMode = false;
      this.isDialogOpen = true;
    },
    async handleSave(updatedCategory) {
      await this.fetchCategories();  // On rafraichit la page entiere apres avoir soumis l'édit de category
      this.isDialogOpen = false;
    },
    async deleteCategory(categoryId) {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
  }
});
</script>

<style scoped>
</style>