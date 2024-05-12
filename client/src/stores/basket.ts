import type { Product } from '@/api/products.api';
import { defineStore } from 'pinia';
import basketData from '@/api/basket.json';

export const useBasketStore = defineStore('basket', {
  state: () => ({ products: basketData.products as Product[] }),
  getters: {
    totalPrice(state) {
      return state.products.reduce((acc, product) => acc + product.price, 0);
    },
    view(state) {
      const productsLen = state.products.length;
      const products: Product[] = [];

      for (let i = 0; i < productsLen; i++) {
        if (!products.find((p) => p.id === state.products[i].id)) {
          products.push(state.products[i]);
        }
      }

      return products;
    }
  },
  actions: {
    addProduct(product: Product, count = 1) {
      for (let i = 0; i < count; i++) {
        this.products.push(product);
      }
    },
    removeProduct(product: Product) {
      //@ts-ignore
      const lastIndex = this.products.findLastIndex((p) => p.id === product.id);
      console.log('removeProduct -> lastIndex', lastIndex);

      if (lastIndex !== -1) {
        this.products.splice(lastIndex, 1);
      }
    }
  }
});
