import config from '@/config';
import type { Product } from './products.api';

async function setProductCountToBasket(
  userId: string,
  accessToken: string,
  product: Product,
  count: number
) {
  const response = await fetch(`${config.apiBaseUrl}/users/${userId}/basket`, {
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
  const response = await fetch(`${config.apiBaseUrl}/users/${userId}/basket`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  return response;
}

async function addProductToBasket(
  userId: string,
  accessToken: string,
  product: Product,
  count: number
) {
  const response = await fetch(`${config.apiBaseUrl}/users/${userId}/basket`, {
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
export { setProductCountToBasket, fetchBasket, addProductToBasket };
