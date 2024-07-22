<template>
  <section class="flex-1 ml-80">
  <div class="container mx-auto mb-16 mt-12">
    <div class="flex justify-between items-center w-full bg-gray-100 p-3 border-t border-l border-r border-gray-300">
      <h2 class="text-xl font-bold">Gestion des produits</h2>
      <div class="flex items-center space-x-2">
        <button class="text-black bg-gradient-to-r from-blue-300 to-blue-400 hover:bg-gradient-to-l hover:from-blue-400 hover:to-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-200 font-semibold rounded-lg text-sm px-5 py-2.5 text-center">Créer un produit</button>
      </div>
    </div>
    <table class="min-w-full bg-white border border-gray-300">
      <thead class="bg-gray-100">
        <tr class="h-16">
          <th class="py-2 px-4 w-1/6">ID</th>
          <th class="py-2 px-4 w-1/6">Nom</th>
          <th class="py-2 px-4 w-1/6">Catégorie</th>
          <th class="py-2 px-4 w-1/6">Prix</th>
          <th class="py-2 px-4 w-1/6">Image</th>
          <th class="py-2 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="border-t hover:bg-gray-50">
          <td class="py-2 px-4 text-center w-1/6">{{ product.id }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ product.name }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ product.category.name }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ product.price }} €</td>
          <td class="py-2 px-4 text-center w-1/6">
            <img :src="product.image" alt="Image du produit" class="w-16 h-16 object-cover mx-auto">
          </td>
          <td class="py-2 px-4 text-center w-1/6">
            <button
              class="text-white bg-gradient-to-br from-blue-500 to-cyan-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              @click="openEditDialog(product)"
            >
              Éditer
            </button>
            <button
              class="text-gray-900 bg-gradient-to-r from-red-400 via-red-300 to-orange-300 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              @click="deleteProduct(product.id)"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex items-center justify-center">
      <button
        @click="previousPage"
        :disabled="page === 1"
        class="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50"
      >
        Précédent
      </button>
      <span class="px-4 py-2">{{ page }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50"
      >
        Suivant
      </button>
    </div>

    <DialogProduct
      v-if="selectedProduct"
      :product="selectedProduct"
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
import DialogProduct from '../DialogProduit.vue';

export default defineComponent({
  components: {
    DialogProduct
  },
  data() {
    return {
      products: [],
      page: 1,
      totalPages: 1,
      isDialogOpen: false,
      selectedProduct: null,
      isEditMode: false
    };
  },
  async mounted() {
    await this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products?page=${this.page}`, {
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
        this.products = data.data;
        this.totalPages = data.metadata.totalPages;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.products = [];
      }
    },
    openEditDialog(product) {
      this.selectedProduct = product;
      this.isEditMode = true;
      this.isDialogOpen = true;
    },
    handleSave(updatedProduct) {
      const index = this.products.findIndex(product => product.id === updatedProduct.id);
      if (index !== -1) {
        this.products.splice(index, 1, updatedProduct);
      }
      this.isDialogOpen = false;
    },
    async deleteProduct(productId) {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        });
        this.fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    },
    previousPage() {
      if (this.page > 1) {
        this.page--;
        this.fetchProducts();
      }
    },
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++;
        this.fetchProducts();
      }
    }
  },
});
</script>

<style scoped>
</style>
