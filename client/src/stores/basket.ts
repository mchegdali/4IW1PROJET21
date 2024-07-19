import type { Product } from '@/api/products.api';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

const defaultProducts: Product[] = [];

async function addProductToBasket(
  userId: string,
  accessToken: string,
  product: Product,
  count: number
) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/basket`, {
    method: 'POST',
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

async function removeProductFromBasket(
  userId: string,
  accessToken: string,
  product: Product,
  count: number
) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/basket`, {
    method: 'DELETE',
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
    async addProduct(product: Product, count = 1) {
      if (count <= 0) {
        return;
      }
      const userStore = useUserStore();

      if (userStore.isAuthenticated) {
        const response = await addProductToBasket(
          userStore.user?.id!,
          userStore.accessToken!,
          product,
          count
        );
        if (response.status === 401) {
          const isRefreshed = await userStore.getRefreshToken();
          if (isRefreshed) {
            await addProductToBasket(userStore.user?.id!, userStore.accessToken!, product, count);
          }
        }
      }

      for (let i = 0; i < count; i++) {
        this.products.push(product);
      }

      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    setProducts(products: Product[]) {
      this.products = structuredClone(products);
      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    async setProductCount(product: Product, count: number) {
      if (this.products.length === count) {
        return;
      }
      const userStore = useUserStore();

      if (userStore.isAuthenticated) {
        const response = await addProductToBasket(
          userStore.user?.id!,
          userStore.accessToken!,
          product,
          count
        );
        if (response.status === 401) {
          const isRefreshed = await userStore.getRefreshToken();
          if (isRefreshed) {
            await addProductToBasket(userStore.user?.id!, userStore.accessToken!, product, count);
          }
        }
      }

      const productIndex = this.products.findIndex((p) => p._id === product._id);
      if (productIndex === -1) {
        this.addProduct(product, count);
      } else {
        const previousProducts = this.products.slice(0, productIndex);
        const nextProducts = this.products
          .slice(productIndex + 1)
          .filter((p) => p.id !== product.id);
        const newProducts = Array(count).fill(product);
        this.products = [...previousProducts, ...newProducts, ...nextProducts];

        localStorage.setItem('basket', JSON.stringify(this.products));
      }
    },
    removeProduct(product: Product, count = 1) {
      for (let i = 0; i < count; i++) {
        const lastIndex = this.products.findLastIndex((p) => p._id === product._id);

        if (lastIndex !== -1) {
          this.products = this.products.toSpliced(lastIndex, 1);
        }
      }

      localStorage.setItem('basket', JSON.stringify(this.products));
    },
    removeAllProducts(product: Product) {
      this.products = this.products.filter((p) => p.id !== product.id);

      localStorage.setItem('basket', JSON.stringify(this.products));
    }
  }
});
