<template>
  <div class="container mx-auto mb-16">
    <div class="flex justify-between items-center w-full bg-gray-100 p-3 border-t border-l border-r border-gray-300">
      <h2 class="text-xl font-bold">Liste des utilisateurs</h2>
      <div class="flex items-center ml-auto space-x-2">
        <input
          type="text"
          placeholder="Rechercher..."
          class="p-2 border border-gray-300 rounded"
          @input="handleSearch"
        />
        <Csv class="h-9 cursor-pointer" @click="exportCsv"/>
      </div>
    </div>

    <table class="min-w-full bg-white border border-gray-300">
      <thead class="bg-gray-100">
        <tr class="h-16">
          <th class="py-2 px-4 w-1/6">
            <input type="checkbox" @change="selectAll($event)" :checked="allSelected" />
          </th>
          <th @click="sortBy('id')" class="py-2 px-4 cursor-pointer hover:bg-gray-200 w-1/6">
            ID
            <DoubleArrow class="inline-block ml-2" />
          </th>
          <th @click="sortBy('fullname')" class="py-2 px-4 cursor-pointer hover:bg-gray-200 w-1/6">
            Nom Complet
            <DoubleArrow class="inline-block ml-2" />
          </th>
          <th @click="sortBy('email')" class="py-2 px-4 cursor-pointer hover:bg-gray-200 w-1/6">
            Email
            <DoubleArrow class="inline-block ml-2" />
          </th>
          <th @click="sortBy('role')" class="py-2 px-4 cursor-pointer hover:bg-gray-200 w-1/6">
            Role
            <DoubleArrow class="inline-block ml-2" />
          </th>
          <th class="py-2 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client._id" class="border-t hover:bg-gray-50">
          <td class="py-2 px-4 text-center w-1/6">
            <input type="checkbox" :value="client._id" :checked="localSelectedClientIds.includes(client._id)" @change="updateSelection(client._id, $event)" />
          </td>
          <td class="py-2 px-4 text-center w-1/6">{{ client._id }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ client.fullname }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ client.email }}</td>
          <td class="py-2 px-4 text-center w-1/6">{{ client.role }}</td>
          <td class="py-2 px-4 text-center w-1/6">
            <button
              class="mr-2 text-black rounded-lg text-sm px-5 py-2 bg-white border border-gray-300 transition-colors duration-300 hover:bg-gray-500 hover:text-white text-center mb-2"
              @click="viewClient(client._id)"
            >
              Voir
            </button>
            <button
              class="text-black rounded-lg text-sm px-5 py-2 bg-white border border-gray-300 transition-colors duration-300 hover:bg-gray-500 hover:text-white text-center mb-2"
              @click="editClient(client._id)"
            >
              Éditer
            </button>
            <button
              class="text-black rounded-lg text-sm px-5 py-2 bg-white border border-gray-300 transition-colors duration-300 hover:bg-gray-500 hover:text-white text-center mb-2"
              @click="deleteClient(client._id)"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';
import DoubleArrow from '../Admin/svg/DoubleArrow.vue';
import Csv from '../Admin/svg/Csv.vue';
import { useUserStore } from '@/stores/user';
import { toast } from '../ui/toast';

interface Client {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

export default defineComponent({
  name: 'UtilisateurTable',
  components: {
    DoubleArrow,
    Csv
  },
  props: {
    clients: {
      type: Array as PropType<Client[]>,
      required: true
    },
    selectedClientIds: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  emits: ['sort', 'select-all', 'update-selection', 'view-client', 'edit-client', 'search'],
  setup(props, { emit }) {
    const localSelectedClientIds = computed({
      get: () => props.selectedClientIds,
      set: (value: string[]) => emit('update-selection', value)
    });

    const allSelected = computed(() => {
      return props.clients.every(client => localSelectedClientIds.value.includes(client._id));
    });

    const sortBy = (field: string) => {
      emit('sort', field);
    };

    const exportCsv = async () => {
      const userStore = useUserStore();
      await userStore.refreshAccessToken();
      const accessToken = userStore.accessToken;

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/selected`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ ids: props.selectedClientIds })
      });

      if (!response.ok) {
        console.error('Failed to fetch selected users');
        return;
      }

      const selectedClients = await response.json();

      const csvContent = 'ID,Nom Complet,Email,Role\n'
        + selectedClients.map(client => {
          return `${client.id},${client.fullname},${client.email},${client.role}`;
        }).join('\n');

      const handle = await window.showSaveFilePicker({
        suggestedName: 'clients_selectionnes.csv',
        types: [{
          description: 'CSV file',
          accept: {'text/csv': ['.csv']},
        }],
      });

      const writable = await handle.createWritable();
      await writable.write(csvContent);
      await writable.close();

      toast({
        title: 'Téléchargement',
        description: 'Le CSV a bien été téléchargé',
        type: 'foreground',
        duration: 2500,
        variant: 'success'
      });
    };

    const selectAll = (event: Event) => {
      const isChecked = (event.target as HTMLInputElement).checked;
      emit('select-all', isChecked);
    };

    const updateSelection = (clientId: string, event: Event) => {
      const isChecked = (event.target as HTMLInputElement).checked;
      emit('update-selection', { clientId, isChecked });
    };

    const viewClient = (clientId: string) => {
      emit('view-client', clientId);
    };

    const editClient = (clientId: string) => {
      emit('edit-client', clientId);
    };

    const deleteClient = (clientId: string) => {
      emit('delete-client', clientId);
    };

    const handleSearch = (event: Event) => {
      const searchText = (event.target as HTMLInputElement).value;
      emit('search', searchText);
    };

    return {
      localSelectedClientIds,
      allSelected,
      sortBy,
      exportCsv,
      selectAll,
      updateSelection,
      viewClient,
      editClient,
      handleSearch,
      deleteClient,
    };
  }
});
</script>

<style scoped>
.container {
  max-width: 1500px;
}
.cursor-pointer {
  cursor: pointer;
}
.readonly-input {
  pointer-events: none;
  caret-color: transparent;
}
</style>
