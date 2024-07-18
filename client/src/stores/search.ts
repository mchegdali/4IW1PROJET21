import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    text: ''
  }),
  getters: {
    isSearching(state) {
      return state.text.length > 0;
    }
  },
  actions: {
    setQuery(query: string) {
      this.text = query;
    },
    resetQuery() {
      this.text = '';
    }
  }
});
