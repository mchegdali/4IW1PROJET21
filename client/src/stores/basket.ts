import type { Product } from '@/api/products.api';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

const defaultProducts: Product[] = [];

export const useBasketStore = defineStore('basket', {
  state: () => ({
    products: localStorage.getItem('basket')
      ? (JSON.parse(localStorage.getItem('basket') as string) as Product[])
      : defaultProducts
  }),
  getters: {
    totalPrice(state) {
      return (
        Math.round(
          state.products.reduce((acc, product) => {
            const price = parseFloat(product.price);
            return acc + price;
          }, 0) * 100
        ) / 100
      );
    },
    view(state) {
      const productsLen = state.products.length;
      const products: Product[] = [];

      for (let i = 0; i < productsLen; i++) {
        if (!products.find((p) => p.id === state.products[i].id)) {
          products.push(state.products[i]);
        }
      }

      return products.toSorted((a, b) => a.name.localeCompare(b.name));
    },
    nbItems(state) {
      return state.products.length;
    }
  },
  actions: {
    addProduct(product: Product, count: number) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;

      for (let i = 0; i < count; i++) {
        this.products.push(product);
      }
      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    setProducts(products: Product[]) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;
      this.products = structuredClone(products);
      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    setProductCount(product: Product, count: number) {
      const userStore = useUserStore();
      if (!userStore.isAuthenticated) return;
      const filteredProducts = this.products.filter((p) => p.id !== product.id);
      const newProducts = Array(count).fill(product);
      this.products = [...filteredProducts, ...newProducts];
      localStorage.setItem('basket', JSON.stringify(this.products));
    }
  }
});
