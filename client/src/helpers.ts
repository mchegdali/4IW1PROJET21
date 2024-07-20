import { useUserStore } from '@/stores/user';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Source: https://github.com/cornflourblue/vue-3-pinia-jwt-refresh-tokens/blob/master/src/helpers/fetch-wrapper.js
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  patch: request('PATCH'),
  delete: request('DELETE')
};

function authHeader(url: RequestInfo | URL) {
  // return auth header with jwt if user is logged in and request is to the api url
  const { accessToken } = useUserStore();
  const isLoggedIn = !!accessToken;
  const isApiUrl =
    (typeof url === 'string' && url.startsWith(import.meta.env.VITE_API_BASE_URL)) ||
    (url instanceof Request && url.url.startsWith(import.meta.env.VITE_API_BASE_URL)) ||
    (url instanceof URL && url.href.startsWith(import.meta.env.VITE_API_BASE_URL));

  const headers = new Headers();
  if (isLoggedIn && isApiUrl) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

function handleResponse(response: Response) {
  return response.json().then((data) => {
    if (!response.ok) {
      const { user, logout } = useUserStore();
      if ([401, 403].includes(response.status) && user) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function request(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
  return (url: RequestInfo | URL, body: any) => {
    const headers = authHeader(url);

    if (body) {
      headers.set('Content-Type', 'application/json');
    }

    const requestOptions = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    };
    return fetch(url, requestOptions).then(handleResponse);
  };
}
