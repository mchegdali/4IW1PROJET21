import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    id: null as string | null,
  }),
  actions: {
    setOrderId(id: string) {
      this.id = id;
    },
  },
});