import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import useAuthFetch from '@/composables/use-auth-fetch';
import dayjs from 'dayjs';
import { useBasketStore } from './basket';
import config from '@/config';
import router from '@/router';

type UserAlerts = {
  newProductAlert: boolean;
  restockAlert: boolean;
  priceChangeAlert: boolean;
  newsletterAlert: boolean;
};

type UserData = {
  fullname: string;
  email: string;
};

type UserIdentity = {
  role: 'user' | 'admin' | 'accountant';
  id: string;
};

type User = UserData & UserIdentity & UserAlerts;

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    user: localStorage.getItem('user')
      ? (JSON.parse(localStorage.getItem('user') as string) as User)
      : null,
    refreshAccessTokenTimeout: null as number | null
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
      return dayjs.unix(decodedAccessToken.exp).isAfter(dayjs());
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

      this.startRefreshTokenTimer();

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user
      };
    },
    async update(user: Partial<UserData>) {
      const response = await fetch(`${config.apiBaseUrl}/users/${this.user?.id!}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();

      //@ts-ignore
      this.user = {
        ...this.user,
        fullname: data.fullname,
        email: data.email
      };
    },
    async updateAlertPreferences(user: Partial<UserAlerts>) {
      const response = await fetch(`${config.apiBaseUrl}/users/${this.user?.id}/alerts`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();

      //@ts-ignore
      this.user = {
        ...this.user,
        ...data
      };
    },
    async refreshAccessToken() {
      const { data } = useAuthFetch('/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken
        })
      } as RequestInit).text();

      if (!data.value) {
        router.push({ name: 'login' });
        this.stopRefreshTokenTimer();
        return;
      }

      this.accessToken = data.value;
      localStorage.setItem('accessToken', data.value);

      this.startRefreshTokenTimer();
    },
    startRefreshTokenTimer() {
      const decodedAccessToken = jwtDecode(this.accessToken!);

      if (decodedAccessToken.exp) {
        const expires = dayjs.unix(decodedAccessToken.exp);

        const timeout = expires.subtract(1, 'minute').diff(dayjs());
        this.refreshAccessTokenTimeout = setTimeout(this.refreshAccessToken, timeout);
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
    },
    stopRefreshTokenTimer() {
      clearTimeout(this.refreshAccessTokenTimeout!);
    }
  }
});
