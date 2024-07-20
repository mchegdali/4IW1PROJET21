import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import useAuthFetch from '@/composables/use-auth-fetch';
import dayjs from 'dayjs';
import { useBasketStore } from './basket';
import config from '@/config';

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
      const decodedAccessToken = jwtDecode(state.accessToken);
      if (!decodedAccessToken.exp) {
        return false;
      }
      return decodedAccessToken.exp * 1000 > Date.now();
    }
  },
  actions: {
    async login(email: string, password: string) {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data: {
        accessToken: string;
        refreshToken: string;
        user: User;
      } = await response.json();

      if (!data.accessToken || !data.refreshToken || !data.user) {
        throw response;
      }

      this.accessToken = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.user = data.user;

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      };
    },
    async refreshAccessToken() {
      if (!this.refreshToken) {
        return;
      }

      const decodedRefreshToken = jwtDecode(this.refreshToken);
      if (!decodedRefreshToken.exp) {
        return;
      }

      const fiveMinutesBeforeExpiration = dayjs(decodedRefreshToken.exp * 1000).subtract(
        5,
        'minutes'
      );
      if (dayjs().isBefore(fiveMinutesBeforeExpiration)) {
        return;
      }

      const { data } = useAuthFetch('/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      } as RequestInit).text();

      if (!data.value) {
        return;
      }

      this.accessToken = data.value;
      localStorage.setItem('accessToken', data.value);

      return true;
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
      const basketStore = useBasketStore();
      basketStore.$reset();

      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;

      if (this.refreshAccessTokenTimeout) {
        clearTimeout(this.refreshAccessTokenTimeout);
      }
    }
  }
});
