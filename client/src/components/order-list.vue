<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package2, Truck } from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import config from '@/config';
import type { Order, Product } from '../api/orders.api';

const orders = ref<Order[]>([]);
const itemDetails = ref<Record<string, Product>>({});
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedDate = ref('');
const selectedStartDate = ref('');
const selectedEndDate = ref('');

const isMobile = ref(window.innerWidth < 640);

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function statusClass(status: string): string {
  switch (status) {
    case 'Delivered':
      return 'Livrée';
    case 'Shipped':
      return 'Expédiée';
    case 'Cancelled':
      return 'Annulée';
    default:
      return 'En cours de traitement';
  }
}

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    if (searchQuery.value && !order.orderNumber.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return false;
    }
    
    if (selectedStatus.value && order.status.label !== selectedStatus.value) {
      return false;
    }
    
    if (selectedStartDate.value) {
      const orderDate = new Date(order.createdAt);
      const startDate = new Date(selectedStartDate.value);
      if (orderDate < startDate) {
        return false;
      }
    }
    
    return true;
  });
});

const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;

const userStore = useUserStore();
userStore.accessToken;

async function fetchOrders(): Promise<void> {
  try {
    const response = await fetch(`${config.apiBaseUrl}/users/${userId}/orders`, {
      headers: {
        Authorization: `Bearer ${userStore.accessToken}`
      }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    orders.value = data;
    await fetchProductDetails(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

async function fetchProductDetails(orders: Order[]): Promise<void> {
  const productIds = new Set<string>();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item._id) productIds.add(item._id);
    });
  });

  for (const productId of productIds) {
    try {
      const response = await fetch(`${config.apiBaseUrl}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${userStore.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const product = await response.json();
      itemDetails.value = { ...itemDetails.value, [product.id]: product };
    } catch (error) {
      console.error('Error fetching product details for ID', productId, ':', error);
    }
  }
}

onMounted(fetchOrders);

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 640;
});
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-start sm:justify-center px-4 mt-2">
    <div :class="[
    'mb-4 w-full sm:w-1/4 sm:mr-4 rounded-lg',
    isMobile ? 'border border-tea-600' : 'shadow-lg'
  ]">
    <div v-if="!isMobile" class="font-semibold text-white p-4 text-2xl bg-tea-600 rounded-t-lg">
      Filtrer les commandes
    </div>
    <details :open="!isMobile">
      <summary v-if="isMobile" class="p-2 font-semibold text-gray-700 cursor-pointer">
        Filtrer
      </summary>
      <div :class="isMobile ? 'mt-4 p-2' : 'p-6'">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nº commande : 78524263"
          class="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <label for="status" class="block text-gray-700 font-semibold mb-2">
          Statut de la commande
          <select
            id="status"
            v-model="selectedStatus"
            class="w-full p-2 border border-gray-300 rounded mb-4 bg-white"
          >
            <option value="">Tous</option>
            <option value="Delivered">Livré</option>
            <option value="Shipped">Expédié</option>
            <option value="Pending">En cours</option>
            <option value="Cancelled">Annulé</option>
          </select>
        </label>
        <label for="date" class="block text-gray-700 font-semibold mb-2">
          Date précise
          <input
            type="date"
            id="date"
            v-model="selectedDate"
            class="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </label>
        <div class="flex flex-col sm:flex-row gap-4">
          <label for="startDate" class="block text-gray-700 font-semibold mb-2 w-full sm:w-1/2">
            Date de début
            <input
              type="date"
              id="startDate"
              v-model="selectedStartDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
          <label for="endDate" class="block text-gray-700 font-semibold mb-2 w-full sm:w-1/2">
            Date de fin
            <input
              type="date"
              id="endDate"
              v-model="selectedEndDate"
              class="w-full p-2 border border-gray-300 rounded mb-4"
            />
          </label>
        </div>
      </div>
    </details>
  </div>

    <!-- Commandes -->
    <div class="flex flex-col items-center w-full sm:w-3/4">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="rounded-lg p-5 shadow-lg flex flex-col gap-4 mb-4 bg-white w-full sm:w-full"
      >
        <router-link :to="{ name: 'order', params: { id: order._id } }">
          <div
            :class="
              order.status.label
                ? 'flex justify-between items-center'
                : 'flex flex-col lg:flex-row sm:justify-between lg:items-center'
            "
            class="cursor-pointer"
          >
            <h1 class="font-bold text-lg">Commande du {{ formatDate(order.createdAt) }}</h1>
            <Badge variant="outline" class="border-tea-600 text-tea-600">
              {{ statusClass(order.status.label) }}
            </Badge>
          </div>
        </router-link>

        <div
          :class="
            order.items.length < 3
              ? 'flex justify-start gap-4'
              : 'flex justify-between sm:justify-start sm:gap-4 w-full'
          "
        >
          <div
            v-for="(item, index) in order.items.slice(0, 3)"
            :key="item._id"
            class="relative w-24 h-24"
          >
            <img class="min-w-24 h-full bg-slate-400" :src="itemDetails[item._id]?.image" alt="" />
            <div
              v-if="index === 2 && order.items.length > 3"
              class="extra-items-count w-full h-full flex justify-center items-center font-bold text-2xl top-0 right-0 text-white absolute bg-black bg-opacity-55"
            >
              +{{ order.items.length - 3 }}
            </div>
          </div>
        </div>
        <div
          class="border-b border-t border-gray-200 py-2 flex gap-3"
          v-if="order.status.label == 'Shipped'"
        >
          <Truck />
          <router-link
            :to="{ name: 'tracking', params: { id: order.orderNumber } }"
            class="w-1/2 text-tea-600"
            >Suivre le colis</router-link
          >
        </div>

        <div>
          <p class="flex gap-3">
            <Package2 />
            N° de commande : <span class="font-bold">{{ order.orderNumber }}</span>
          </p>
          <p class="flex gap-3" v-if="order.shippingDate">
            <Calendar />
            <span class="font-bold">
              {{ "Date d'expédition : " + formatDate(order.shippingDate) }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
