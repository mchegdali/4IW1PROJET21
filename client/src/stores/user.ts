import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

type User = {
  fullname: string;
  email: string;
  role: 'user' | 'admin' | 'accountant';
  id: string;
};

export const useUserStore = defineStore('user', {
  state: (): { accessToken: string | null; refreshToken: string | null; user: User | null } => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null
  }),
  getters: {
    isAuthenticated(state) {
      if (!state.accessToken) {
        return false;
      }
      const decodedAccessToken = jwtDecode(state.accessToken);
      if (!decodedAccessToken.exp) {
        return false;
      }
      return decodedAccessToken.exp * 1000 > Date.now();
    }
  },
  actions: {
    async getRefreshToken() {
      if (!this.refreshToken) {
        return false;
      }

      const decodedRefreshToken = jwtDecode(this.refreshToken);
      if (!decodedRefreshToken.exp) {
        return false;
      }
      if (Date.now() > decodedRefreshToken.exp * 1000) {
        return false;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      });

      if (!response.ok) {
        return false;
      }

      const accessToken = await response.text();
      this.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);

      return true;
    }
  }
});
