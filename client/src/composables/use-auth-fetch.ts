import { createFetch } from '@vueuse/core';
import { useUserStore } from '@/stores/user';

const useAuthFetch = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  options: {
    async beforeFetch({ options }) {
      const accessToken = useUserStore().accessToken;
      if (!(options.headers instanceof Headers)) {
        options.headers = new Headers();
      }

      options.headers.set('Authorization', `Bearer ${accessToken}`);

      return { options };
    }
  }
});

export default useAuthFetch;
