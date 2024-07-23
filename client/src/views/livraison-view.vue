<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import config from '@/config';

const userStore = useUserStore();
const router = useRouter();

const addresses = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedAddress = ref(null);

const fetchAddresses = async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    error.value = "Utilisateur non connecté";
    loading.value = false;
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/users/${userId}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userStore.accessToken}`
      },
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des adresses');
    }
    addresses.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

const selectAddress = (address) => {
  selectedAddress.value = address;
  // Ici, vous pouvez ajouter la logique pour utiliser l'adresse sélectionnée
  console.log('Adresse sélectionnée:', address);
};

onMounted(fetchAddresses);
</script>

<template>
  <main class="grow">
    <h1 class="text-3xl font-bold mb-4">Adresses de livraison</h1>
    
    <div v-if="loading" class="text-center">
      Chargement des adresses...
    </div>
    
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    
    <div v-else-if="addresses.length === 0" class="text-center">
      Aucune adresse de livraison enregistrée.
    </div>
    
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="px-4 py-2">Sélectionner</th>
            <th class="px-4 py-2">Nom</th>
            <th class="px-4 py-2">Adresse</th>
            <th class="px-4 py-2">Ville</th>
            <th class="px-4 py-2">Pays</th>
            <th class="px-4 py-2">Téléphone</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="address in addresses" :key="address._id" class="border-b">
            <td class="px-4 py-2">
              <input 
                type="radio" 
                :id="address._id" 
                name="address" 
                :value="address"
                v-model="selectedAddress"
                @change="selectAddress(address)"
              />
            </td>
            <td class="px-4 py-2">{{ address.firstName }} {{ address.lastName }}</td>
            <td class="px-4 py-2">{{ address.street }}</td>
            <td class="px-4 py-2">{{ address.zipCode }} {{ address.city }}</td>
            <td class="px-4 py-2">{{ address.country }}</td>
            <td class="px-4 py-2">{{ address.phone }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="selectedAddress" class="mt-4 p-4 bg-green-100 rounded">
      <h2 class="font-semibold">Adresse sélectionnée :</h2>
      <p>{{ selectedAddress.firstName }} {{ selectedAddress.lastName }}</p>
      <p>{{ selectedAddress.street }}</p>
      <p>{{ selectedAddress.zipCode }} {{ selectedAddress.city }}</p>
      <p>{{ selectedAddress.country }}</p>
      <p>Téléphone : {{ selectedAddress.phone }}</p>
    </div>
    
    <div class="mt-4">
      <RouterLink :to="{ name: 'add-addresse' }" class="text-blue-500 hover:underline">
        Ajouter une nouvelle adresse
      </RouterLink>
    </div>
  </main>
</template>