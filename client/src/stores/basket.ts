import type { Product } from '@/api/products.api';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

const defaultProducts: Product[] = [];

async function setProductCountToBasket(
  userId: string,
  accessToken: string,
  product: Product,
  count: number
) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/basket`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      productId: product.id,
      quantity: count
    })
  });

  return response;
}

async function fetchBasket(userId: string, accessToken: string) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/basket`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
}

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
    async addProduct(product: Product, count: number) {
      for (let i = 0; i < count; i++) {
        this.products.push(product);
      }
      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    setProducts(products: Product[]) {
      this.products = structuredClone(products);
      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    setProductCount(product: Product, count: number) {
      const currentCount = this.products.filter((p) => p._id === product._id).length;

      if (currentCount === count) {
        return;
      }

      const productIndex = this.products.findIndex((p) => p._id === product._id);
      if (productIndex === -1) {
        for (let i = 0; i < count; i++) {
          this.products.push(product);
        }
      } else {
        const previousProducts = this.products.slice(0, productIndex);
        const nextProducts = this.products
          .slice(productIndex + 1)
          .filter((p) => p.id !== product.id);
        const newProducts = Array(count).fill(product);
        this.products = [...previousProducts, ...newProducts, ...nextProducts];
      }

      localStorage.setItem('basket', JSON.stringify(this.products));
    }
  }
});
