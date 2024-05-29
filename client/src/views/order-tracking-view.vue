<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ordersData from '@/api/order.json';
import { Calendar, ChevronRight, MoveLeft, Package2 } from 'lucide-vue-next';

const route = useRoute();
const orderId = route.params.id;

const order = ref(ordersData.orders.find(o => o.orderId === orderId));

const calculateTotalPrice = (items: Array<any>) => {
  return items.reduce((total, item) => total + item.price, 0);
};

console.log(order);
</script>

<template>
  <div v-if="order" class="flex flex-col gap-4 mb-4 bg-white">
    <div class="flex items-center w-full relative align">
      <RouterLink :to="{ name: 'order' }"><MoveLeft/></RouterLink>
    
      <h1 class="font-bold text-lg text-center w-full">Détails de la commande</h1>
    </div>

    <div class="flex gap-4">
      <Package2 />
            <p>N° de commande: <span class="font-bold">{{ order.orderNumber }}</span></p>
          </div>

          <div class="flex gap-4">
            <Calendar />
            <p>Date de commande: <span class="font-bold">{{ new Date(order.shippingDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span></p>
          </div>
<div class="border-b-8 border-gray-200">
  <h6 class="font-bold text-xs bg-gray-200 p-2">INFORMATION DE PAIEMENT</h6>
    <h1 class="text-xs font-bold mt-2">ADRESSE DE COLLECTE</h1>
    <div class="p-2 border-b border-gray-200">
      
      <p>19 rue de la paix</p>
      <p>77000 PARIS</p>
      <p>France</p>
    </div>
    <h1 class="text-xs font-bold mt-2">VOS COORDONNEES</h1>
    <div class="p-2">
      
      <p>Jhon Doe</p>
      <p>07 23 45 11 54</p>
    </div>
    
</div>
      
    
        
    <p>Statut de livraison: <span class="font-bold">{{ order.deliveryStatus ? 'Livré' : 'En cours de livraison' }}</span></p>
    


    

    <div class="flex flex-col w-full gap-2">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="h-24 flex w-full gap-8"
      >
    
        <img class="min-w-24 h-full bg-slate-400" :src="item.image" alt="" />
        <div class="flex flex-col">
       
            <p class="font-bold">{{ item.title }}</p>
       
    
            <p class="font-bold">{{ item.price }} €</p>
       
    
           
        <p>Quantité: {{ item.quantity }}</p>
          
       
        </div>
      
    
       
      </div>
      <div class="border-b border-t border-gray-200 py-2">
      <RouterLink :to="{ name: 'deli' , params: { id: order.orderId }}" class="w-1/2 text-tea-600">Suivre le colis</RouterLink>
    </div>
    <h6 class="font-bold text-xs bg-gray-200 p-2">INFORMATION DE PAIEMENT</h6>
    <h1 class="px-2">Paypal</h1>
    
    <h6 class="font-bold text-xs bg-gray-200 p-2">TOTAL DE COMMANDE</h6>
    </div>
    <p class="font-bold flex justify-between">Sous-total <span>{{ calculateTotalPrice(order.items) }} €</span></p>
    <p class="font-bold flex justify-between">Livraison: <span class="font-bold">GRATUIT</span></p>
    <p class="font-bold flex justify-between">Remise: <span class="font-bold">0 €</span></p>
    <p class="font-bold flex justify-between">Total: <span class="font-bold">{{ calculateTotalPrice(order.items) }} €</span></p>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
