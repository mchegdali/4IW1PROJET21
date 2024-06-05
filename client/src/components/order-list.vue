<script setup lang="ts">
import { ref } from 'vue';
import ordersData from '@/api/order.json';

const orders = ref<Array<any>>(ordersData.orders);

// fetch('http://localhost:3000/orders')
//   .then((response) => response.json())
//   .then((data) => {
//     orders.value = data;
//   });
</script>

<template>
  <div class="sm:items-center flex justify-center flex-col">
    <RouterLink
      v-for="order in orders"
      :key="order.orderId"
      class="rounded-lg p-5 shadow-lg flex flex-col gap-4 mb-4 bg-white sm:w-2/3"
      :to="{ name: 'order', params: { id: order.orderId } }"
    >
      <div
        :class="
          order.deliveryStatus
            ? 'flex justify-between items-center'
            : 'flex flex-col sm:flex-row justify-between items-center'
        "
      >
        <h1 class="font-bold text-lg">
          Commande du
          {{
            new Date(order.orderDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          }}
        </h1>
        <div
          class="border border-tea-600 text-tea-600 px-2 rounded-full font-bold text-sm"
          v-if="order.deliveryStatus === true"
        >
          Livré
        </div>
        <div class="font-bold border border-tea-600 text-tea-600 px-4 rounded-full text-sm" v-else>
          Livraison prévue le
          {{
            new Date(order.shippingDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          }}
        </div>
      </div>

      <div
        class="flex w-full"
        :class="{
          'justify-start gap-4': order.items.length < 3,
          'justify-between sm:justify-start sm:gap-4': order.items.length >= 3
        }"
      >
        <div
          v-for="(item, index) in order.items.slice(0, 3)"
          :key="item.id"
          class="relative w-24 h-24"
        >
          <img class="min-w-24 h-full bg-slate-400" :src="item.image" alt="" />
          <div
            v-if="index === 2 && order.items.length > 3"
            class="extra-items-count w-full h-full flex justify-center items-center font-bold text-2xl top-0 right-0 text-white absolute bg-black bg-opacity-55"
          >
            +{{ order.items.length - 3 }}
          </div>
        </div>
      </div>
      <div class="border-b border-t border-gray-200 py-2" v-if="order.deliveryStatus === false">
        <RouterLink
          :to="{ name: 'order', params: { id: order.orderId } }"
          class="w-1/2 text-tea-600"
          >Suivre le colis</RouterLink
        >
      </div>
      <div>
        <p>
          N° de commande: <span class="font-bold">{{ order.orderNumber }}</span>
        </p>
        <p>
          Date d'expédition:
          <span class="font-bold">{{
            new Date(order.shippingDate).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          }}</span>
        </p>
      </div>
    </RouterLink>
  </div>
</template>
