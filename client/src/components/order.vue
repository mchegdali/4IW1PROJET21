<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';
import { Calendar, MapPin, Package2, Phone, Truck } from 'lucide-vue-next';
import config from '@/config';
import { useUserStore } from '@/stores/user';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

interface Shipping {
  fullname: string;
  street: string;
  zipCode: string;
  city: string;
  phone: string;
  deliveryChoiceId: string;
}

interface OrderItem {
  id: string;
  price: string;
  quantity?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  shippingDate: string;
  deliveryStatus?: boolean;
  shipping: Shipping;
  items: OrderItem[];
  paymentType: string;
  status: { label: string };
}

const route = useRoute();
const order = ref<Order | null>(null);
const products = ref<Product[]>([]);

const fetchProductDetails = async (productIds: string[]) => {
  try {
    const productPromises = productIds.map((id) =>
      fetch(`${config.apiBaseUrl}/products/${id}`, { headers: {
        Authorization: `Bearer ${userStore.accessToken}`
      }}).then((response) => response.json())
    );
    const productData = await Promise.all(productPromises);
    products.value = productData;
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

const getProductImage = (productId: string) => {
  const product = products.value.find((p) => p.id === productId);
  return product?.image || '';
};

const getProductTitle = (productId: string) => {
  const product = products.value.find((p) => p.id === productId);
  return product?.name || 'Unknown Product';
};

const computeOrderTotal = () => {
  return (
    order.value?.items
      .reduce((total, item) => total + parseFloat(item.price) * (item.quantity || 1), 0)
      .toFixed(2) || '0.00'
  );
};

const userStore = useUserStore();
userStore.accessToken;

onMounted(async () => {
  const orderId = route.params.id as string;
  try {
    const response = await fetch(`${config.apiBaseUrl}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch order');

    order.value = await response.json();

    if (order.value && order.value.items) {
      await fetchProductDetails(order.value.items.map((item) => item.id));
    } else {
      console.warn('Order or order items are not available');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
  }
});
</script>

<template>
  <div class="items-center flex justify-center flex-col px-4 mt-2">
    <div v-if="order" class="sm:w-2/3 sm:flex flex-row justify-center md:w-full">
      <!-- Order Details -->
      <div>
        <div class="p-2 flex flex-col gap-2 mt-2 sm:p-4">
          <div class="flex gap-4 text-sm items-center sm:text-lg">
            <Package2 />
            N° de commande: <span class="font-bold">{{ order.orderNumber }}</span>
          </div>
          <div class="flex gap-4 text-sm items-center sm:text-lg">
            <Calendar />
            <p>
              Date de commande:
              <span class="font-bold">
                {{
                  new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                }}
              </span>
            </p>
          </div>
        </div>

        <!-- Shipping Info -->
        <h6 class="font-bold text-sm p-2 text-gray-700 sm:text-lg sm:p-4">
          INFORMATION SUR LA LIVRAISON
        </h6>
        <div class="p-2 sm:p-4">
          <h1 class="text-xs font-bold text-gray-700 sm:text-sm">ADRESSE DE COLLECTE</h1>
          <div class="text-sm p-2 sm:text-sm border-b">
            <p class="flex gap-2"><MapPin class="w-4" />{{ order.shipping.street }}</p>
            <p>{{ order.shipping.zipCode }} {{ order.shipping.city }}</p>
          </div>
          <h1 class="text-xs font-bold text-gray-700 mt-2 sm:text-sm">VOS COORDONNÉES</h1>
          <div class="text-sm p-2 sm:text-sm">
            <p>{{ order.shipping.fullname }}</p>
            <p class="flex gap-2"><Phone class="w-4" /> {{ order.shipping.phone }}</p>
          </div>
        </div>

        <!-- Delivery Status -->
        <div v-if="order.status.label === 'Shipped'" class="flex flex-col gap-2 p-2 sm:p-4">
          <div class="flex justify-between items-center text-xs">
            <p class="font-bold text-sm sm:text-lg">VOTRE COMMANDE A ÉTÉ EXPÉDIÉE !</p>
            <p class="text-gray-700 sm:text-lg">{{ order.items.length }} <span>Produits</span></p>
          </div>
          <div class="sm:flex w-full items-center justify-between">
            <p class="text-sm font-bold text-gray-700 sm:text-sm">
              DATE PRÉVUE DE LIVRAISON :
              {{
                new Date(
                  new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 3)
                ).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              }}
            </p>
            <div class="bg-white py-2 text-sm flex items-center gap-2">
              <Truck />
              <RouterLink
                :to="{ name: 'tracking', params: { id: order.orderNumber } }"
                class="text-tea-600 sm:text-lg"
              >
                Suivre le colis
              </RouterLink>
            </div>
          </div>
          <div class="w-full h-3 bg-gray-200 overflow-hidden rounded-xl">
            <div class="h-full bg-tea-600" :style="{ width: '75%' }"></div>
          </div>
          <p class="text-xs sm:text-sm">
            Votre colis est en cours de livraison. Merci de votre patience et nous espérons que vous
            apprécierez votre commande lorsqu'elle arrivera !
          </p>
        </div>

        <div v-else-if="order.status.label === 'Delivered'" class="flex flex-col gap-2 p-2 sm:p-4">
          <div class="flex justify-between items-center text-xs">
            <p class="font-bold text-sm sm:text-lg">VOTRE COMMANDE A ÉTÉ LIVRÉE !</p>
            <p class="text-gray-700 sm:text-lg">{{ order.items.length }} <span>Produits</span></p>
          </div>
          <div class="sm:flex w-full items-center justify-between">
            <p class="text-sm font-bold text-gray-700 sm:text-sm">
              LIVRAISON LE :
              {{
                new Date(
                  new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 3)
                ).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              }}
            </p>
            <div class="bg-white py-2 text-sm flex items-center gap-2">
              <Truck />
              <RouterLink
                :to="{ name: 'tracking', params: { id: order.orderNumber } }"
                class="text-tea-600 sm:text-lg"
              >
                Infos de la livraison
              </RouterLink>
            </div>
          </div>
          <div class="w-full h-3 bg-tea-600 rounded-xl"></div>
          <p class="text-xs sm:text-sm">
            Ca y est : votre colis a été livré. Nous espérons que vous aimerez votre commande !
          </p>
        </div>

        <div v-if="order.status.label === 'Cancelled'" class="flex flex-col gap-2 p-2 sm:p-4">
          <div class="flex justify-between items-center text-xs">
            <p class="font-bold text-sm sm:text-lg">VOTRE COMMANDE A ÉTÉ ANNULÉE !</p>
            <p class="text-gray-700 sm:text-lg">{{ order.items.length }} <span>Produits</span></p>
          </div>
          <div class="sm:flex w-full items-center justify-between">
            <p class="text-sm font-bold text-gray-700 sm:text-sm">
              DATE D'ANNULATION :
              {{
                new Date(
                  new Date(order.createdAt).setDate(new Date(order.createdAt).getDate())
                ).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })
              }}
            </p>
          </div>
          <div class="w-full h-3 bg-gray-200 rounded-xl"></div>
          <p class="text-xs sm:text-sm">Votre commande a été annulée.</p>
        </div>

        <!-- Order Items -->
        <div class="flex flex-col w-full gap-2 px-2 sm:px-4 pb-2">
          <div
            v-for="(item, index) in order.items"
            :key="item.id"
            :class="[
              'h-28 flex w-full gap-8 pb-2',
              index !== order.items.length - 1 ? 'border-b border-gray-300' : ''
            ]"
          >
            <img class="min-w-24 h-full bg-slate-400" :src="getProductImage(item.id)" alt="" />
            <div class="flex flex-col text-sm gap-2">
              <p class="font-bold">{{ getProductTitle(item.id) }}</p>
              <p class="font-bold">{{ item.price }} €</p>
              <p>Quantité: {{ item.quantity || 1 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Information -->
      <div class="md:border md:flex md:flex-col md:rounded md:h-fit">
        <h6 class="font-bold text-sm p-2 sm:text-lg sm:p-4 text-gray-700">
          INFORMATION DE PAIEMENT
        </h6>
        <div class="flex gap-4 items-center p-2 sm:p-4 text-xs">
          <span v-if="order.paymentType === 'credit_card'" class="flex gap-4 items-center">
            <img
              class="w-9 px-2 py-1 sm:w-12"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/300px-MasterCard_Logo.svg.png"
              alt="Carte bancaire"
            />
            <h1 class="px-2 text-sm sm:text-lg">Carte bancaire</h1>
          </span>
        </div>
        <h6 class="font-bold text-sm p-2 sm:text-lg sm:p-4 text-gray-700">TOTAL DE COMMANDE</h6>
        <div class="p-2 mb-4 sm:p-4">
          <p class="flex justify-between text-sm sm:text-lg">
            Sous-total <span>{{ computeOrderTotal() }} €</span>
          </p>
          <p class="flex justify-between text-sm py-1 sm:text-lg">
            Livraison: <span>GRATUIT</span>
          </p>
          <p class="flex justify-between text-sm py-1 sm:text-lg">Remise: <span>0 €</span></p>

          <p class="font-bold flex justify-between text-sm sm:text-lg">
            Total: <span class="font-bold">{{ computeOrderTotal() }} €</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
