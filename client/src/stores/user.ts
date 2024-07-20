import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import router from '@/router';

type User = {
  fullname: string;
  email: string;
  role: 'user' | 'admin' | 'accountant';
  id: string;
};

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: localStorage.getItem('user')
      ? (JSON.parse(localStorage.getItem('user') as string) as User)
      : null,
    refreshAccessTokenTimeout: null as number | null
  }),
  getters: {},
  actions: {
    async login(email: string, password: string) {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw response;
      }

      const body: {
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          fullname: string;
          email: string;
          role: 'user' | 'admin' | 'accountant';
        };
      } = await response.json();
      this.accessToken = body.accessToken;
      this.refreshToken = body.refreshToken;
      this.user = body.user;

      localStorage.setItem('accessToken', this.accessToken!);
      localStorage.setItem('refreshToken', this.refreshToken!);
      localStorage.setItem('user', JSON.stringify(this.user!));
      this.startRefreshTokenTimer();

      return body.user;
    },
    async refreshAccessToken() {
      if (!this.refreshToken) {
        router.push({ name: 'login' });
        return;
      }

      const decodedRefreshToken = jwtDecode(this.refreshToken);
      if (!decodedRefreshToken.exp) {
        router.push({ name: 'login' });
        return;
      }
      if (dayjs().isAfter(decodedRefreshToken.exp * 1000)) {
        router.push({ name: 'login' });
        return;
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
        router.push({ name: 'login' });
        return;
      }

      const accessToken = await response.text();
      this.accessToken = accessToken;
      localStorage.setItem('accessToken', accessToken);
    },
    startRefreshTokenTimer() {
      const decodedAccessToken = jwtDecode(this.accessToken!);

      if (decodedAccessToken.exp) {
        const accessTokenExpiration = dayjs(decodedAccessToken.exp * 1000);
        const oneMinuteBeforeExpiration = accessTokenExpiration.subtract(1, 'minute');
        const accessTokenTimeout = oneMinuteBeforeExpiration.diff(dayjs());
        this.refreshAccessTokenTimeout = setTimeout(this.refreshAccessToken, accessTokenTimeout);
      }
    },
    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      if (this.refreshAccessTokenTimeout) {
        clearTimeout(this.refreshAccessTokenTimeout);
      }
      router.push({ name: 'login' });
    }
  }
});
