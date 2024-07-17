import type { Product } from '@/api/products.api';
import { defineStore } from 'pinia';

const defaultProducts: Product[] = [];

export const useBasketStore = defineStore('basket', {
  state: () => ({ products: defaultProducts }),
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
        if (!products.find((p) => p._id === state.products[i]._id)) {
          products.push(state.products[i]);
        }
      }

      return products;
    },
    nbItems(state) {
      return state.products.length;
    }
  },
  actions: {
    addProduct(product: Product, count = 1) {
      for (let i = 0; i < count; i++) {
        this.products.push(product);
      }
    },
    setProductNumber(product: Product, count: number) {
      if (count <= 0) {
        return;
      }

      if (count === 0) {
        this.products = this.products.filter((p) => p._id !== product._id);
      }

      const productCount = this.products.filter((p) => p._id === product._id);
      const diff = count - productCount.length;
      const absDiff = Math.abs(diff);
      for (let i = 0; i < absDiff; i++) {
        if (diff > 0) {
          this.products.push(product);
        } else {
          this.removeProduct(product);
        }
      }
    },
    removeProduct(product: Product) {
      const lastIndex = this.products.findLastIndex((p) => p._id === product._id);

      if (lastIndex !== -1) {
        this.products.splice(lastIndex, 1);
      }
    }
  }
});
