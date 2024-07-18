<template>
    <section class="flex-1 ml-80">
        <h1 class="text-2xl font-bold text-green-900 mb-10 p-5">Utilisateurs</h1>
        <UtilisateurTable :clients="clients" @delete-clients="deleteClients" @update-client="updateClient" />
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UtilisateurTable from '../UtilisateurTable.vue';

interface Client {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    ville: string;
}

export default defineComponent({
    name: 'Utilisateur',
    components: {
        UtilisateurTable,
    },
    setup() {
        const clients = ref<Client[]>([
            { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@example.com', ville: 'Paris' },
            { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@example.com', ville: 'Lyon' },
            { id: 3, nom: 'Bernard', prenom: 'Claire', email: 'claire.bernard@example.com', ville: 'Marseille' },
            { id: 4, nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@example.com', ville: 'Bordeaux' },
            { id: 5, nom: 'Petit', prenom: 'Julie', email: 'julie.petit@example.com', ville: 'Toulouse' },
            { id: 6, nom: 'Moreau', prenom: 'Luc', email: 'luc.moreau@example.com', ville: 'Nice' },
            { id: 7, nom: 'Leroy', prenom: 'Emma', email: 'emma.leroy@example.com', ville: 'Nantes' },
            { id: 8, nom: 'Simon', prenom: 'Paul', email: 'paul.simon@example.com', ville: 'Strasbourg' },
            { id: 9, nom: 'Laurent', prenom: 'Isabelle', email: 'isabelle.laurent@example.com', ville: 'Lille' },
            { id: 10, nom: 'Lefebvre', prenom: 'Marie', email: 'marie.lefebvre@example.com', ville: 'Rennes' },
            { id: 11, nom: 'Roux', prenom: 'Antoine', email: 'antoine.roux@example.com', ville: 'Reims' },
        ]);

        const deleteClients = (clientIds: number[]) => {
            clients.value = clients.value.filter(client => !clientIds.includes(client.id));
        };

        const updateClient = (updatedClient: Client) => {
            const index = clients.value.findIndex(client => client.id === updatedClient.id);
            if (index !== -1) {
                clients.value.splice(index, 1, updatedClient);
            }
        };

        return {
            clients,
            deleteClients,
            updateClient,
        };
    },
});
</script>

<style lang="scss" scoped>
</style>
