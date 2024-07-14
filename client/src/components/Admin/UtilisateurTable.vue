<template>
    <div class="container mx-auto mb-16">
        <div class="flex justify-between items-center w-full bg-gray-100 p-3 border-t border-l border-r border-gray-300">
            <h2 class="text-xl font-bold">Liste des utilisateurs</h2>
            <div class="flex items-center ml-auto space-x-2">
                <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Rechercher..."
                class="p-2 border border-gray-300 rounded"
                />
                <Csv @click="exportSelectedCsv" class="h-9 cursor-pointer" />
            </div>
        </div>
  
        <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
                <tr>
                    <th class="py-2 px-4">
                        <input type="checkbox" @change="toggleAllSelections" :checked="allFilteredSelected" />
                    </th>
                    <th class="py-2 px-4 cursor-pointer hover:bg-gray-200" @click="sortBy('id')">
                        ID
                        <DoubleArrow class="inline-block ml-2" />
                    </th>
                    <th class="py-2 px-4 cursor-pointer hover:bg-gray-200" @click="sortBy('nom')">
                        Nom
                        <DoubleArrow class="inline-block ml-2" />
                    </th>
                    <th class="py-2 px-4 cursor-pointer hover:bg-gray-200" @click="sortBy('prenom')">
                        Prénom
                        <DoubleArrow class="inline-block ml-2" />
                    </th>
                    <th class="py-2 px-4 cursor-pointer hover:bg-gray-200" @click="sortBy('email')">
                        Email
                        <DoubleArrow class="inline-block ml-2" />
                    </th>
                    <th class="py-2 px-4 cursor-pointer hover:bg-gray-200" @click="sortBy('ville')">
                        Ville
                        <DoubleArrow class="inline-block ml-2" />
                    </th>
                    <th class="py-2 px-4">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="client in paginatedClients" :key="client.id" class="border-t hover:bg-gray-50">
                    <td class="py-2 px-4 text-center">
                        <input type="checkbox" v-model="selectedClients" :value="client.id" />
                    </td>
                    <td class="py-2 px-4 text-center">{{ client.id }}</td>
                    <td class="py-2 px-4 text-center">{{ client.nom }}</td>
                    <td class="py-2 px-4 text-center">{{ client.prenom }}</td>
                    <td class="py-2 px-4 text-center">{{ client.email }}</td>
                    <td class="py-2 px-4 text-center">{{ client.ville }}</td>
                    <td class="py-2 px-4 text-center">
                        <button @click="viewClient(client)" class="text-white bg-gradient-to-br from-blue-500 to-cyan-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Voir</button>
                        <button @click="editClient(client)" class="text-gray-900 bg-gradient-to-r from-teal-400 to-lime-400 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Éditer</button>
                        <button @click="deleteClient(client)" class="text-gray-900 bg-gradient-to-r from-red-400 via-red-300 to-orange-300 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Supprimer</button>
                    </td>
                </tr>
            </tbody>
        </table>
  
        <div class="mt-4 flex items-center justify-center">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-200 rounded-l disabled:opacity-50">
                Précédent
            </button>
            <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-200 rounded-r disabled:opacity-50">
                Suivant
            </button>
        </div>

        <!-- La modal pour visualiser ou éditer l'utilisateur -->
        <DialogUtilisateur :client="selectedClient" v-model="isDialogOpen" :isEditMode="isEditMode" @save="saveClient" />
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import DoubleArrow from '../Admin/svg/DoubleArrow.vue';
import Csv from '../Admin/svg/Csv.vue';
import DialogUtilisateur from '../Admin/DialogUtilisateur.vue';

interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    ville: string;
}

export default defineComponent({
    name: 'UtilisateurTable',
    components: {
        DoubleArrow,
        Csv,
        DialogUtilisateur
    },
    emits: ['delete-clients'],
    props: {
        clients: {
            type: Array as PropType<Client[]>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const searchQuery = ref('');
        const sortedColumn = ref('');
        const sortOrder = ref<'asc' | 'desc'>('asc');
        const currentPage = ref(1);
        const perPage = ref(10);
        const selectedClients = ref<number[]>([]);
        const selectedClient = ref<Client | null>(null);
        const isDialogOpen = ref(false);
        const isEditMode = ref(false);

        const filteredClients = computed(() => {
            if (!searchQuery.value) {
                return props.clients;
            }
            return props.clients.filter(client =>
                Object.values(client).some(val =>
                    String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
                )
            );
        });

        const sortedClients = computed(() => {
            if (!sortedColumn.value) {
                return filteredClients.value;
            }
            return filteredClients.value.slice().sort((a, b) => {
                if (sortOrder.value === 'asc') {
                    return a[sortedColumn.value] > b[sortedColumn.value] ? 1 : -1;
                } else {
                    return a[sortedColumn.value] < b[sortedColumn.value] ? 1 : -1;
                }
            });
        });

        const paginatedClients = computed(() => {
            const start = (currentPage.value - 1) * perPage.value;
            const end = start + perPage.value;
            return sortedClients.value.slice(start, end);
        });

        const totalPages = computed(() => {
            return Math.ceil(sortedClients.value.length / perPage.value);
        });

        const allFilteredSelected = computed({
            get() {
                return filteredClients.value.every(client => selectedClients.value.includes(client.id));
            },
            set(value: boolean) {
                if (value) {
                    selectedClients.value = filteredClients.value.map(client => client.id);
                } else {
                    selectedClients.value = [];
                }
            }
        });

        const sortBy = (column: keyof Client) => {
            if (sortedColumn.value === column) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortedColumn.value = column;
                sortOrder.value = 'asc';
            }
        };

        const handleSearch = () => {
            currentPage.value = 1;
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const toggleAllSelections = () => {
            allFilteredSelected.value = !allFilteredSelected.value;
        };

        const exportSelectedCsv = async () => {
        const selected = props.clients.filter(client => selectedClients.value.includes(client.id));
        if (selected.length === 0) {
            alert('Aucun client sélectionné');
            return;
        }

        const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Ville'];
        const rows = selected.map(client => [client.id, client.nom, client.prenom, client.email, client.ville]);

        let csvContent = '';
        csvContent += headers.join(',') + '\r\n';
        rows.forEach(rowArray => {
            const row = rowArray.join(',');
            csvContent += row + '\r\n';
        });

        try {
            // Utilisation de l'API Web File System pour créer et écrire dans le fichier
            const handle = await window.showSaveFilePicker({
                suggestedName: 'clients_selectionnes.csv',
                types: [{
                    description: 'CSV file',
                    accept: {'text/csv': ['.csv']},
                }],
            });

            const writableStream = await handle.createWritable();
            await writableStream.write(new Blob([csvContent], {type: 'text/csv'}));
            await writableStream.close();
            alert('Fichier CSV exporté avec succès.');
        } catch (err) {
            console.error('Erreur lors de l\'exportation du fichier CSV :', err);
        }
    };

        const viewClient = (client: Client) => {
            selectedClient.value = client;
            isEditMode.value = false;
            isDialogOpen.value = true;
        };

        const editClient = (client: Client) => {
            selectedClient.value = client;
            isEditMode.value = true;
            isDialogOpen.value = true;
        };

        const deleteClient = (client: Client) => {
            if (selectedClients.value.length > 0) {
                if (confirm('Voulez-vous vraiment supprimer les clients sélectionnés ?')) {
                    emit('delete-clients', selectedClients.value);
                    selectedClients.value = [];
                }
            } else {
                if (confirm(`Supprimer client: ${client.nom} ${client.prenom} ?`)) {
                    emit('delete-clients', [client.id]);
                }
            }
        };

        const saveClient = (client: Client) => {
            const index = props.clients.findIndex(c => c.id === client.id);
            if (index !== -1) {
                props.clients.splice(index, 1, client);
            }
        };

        return {
            searchQuery,
            sortedColumn,
            sortOrder,
            currentPage,
            perPage,
            selectedClients,
            filteredClients,
            sortedClients,
            paginatedClients,
            totalPages,
            allFilteredSelected,
            sortBy,
            handleSearch,
            nextPage,
            prevPage,
            toggleAllSelections,
            exportSelectedCsv,
            viewClient,
            editClient,
            deleteClient,
            isDialogOpen,
            selectedClient,
            saveClient,
            isEditMode,
        };
    },
});
</script>
  
<style scoped>
.container {
    max-width: 1200px;
}
.cursor-pointer {
    cursor: pointer;
}
</style>
  