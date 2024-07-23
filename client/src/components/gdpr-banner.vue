<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { onBeforeRouteUpdate, RouterLink, useRoute } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const showBanner = ref(true);

const contractualPages = ['conditions', 'confidentiality-declaration', 'cookie-policy'];

const isContractualPage = computed(() => {
    return contractualPages.includes(route.name as string);
});

const checkCookiesAccepted = () => {
    if (localStorage.getItem('cookiesAccepted') === 'true' || isContractualPage.value) {
        showBanner.value = false;
    }
};

const acceptCookies = (value: boolean) => {
    if (value) {
        localStorage.setItem('cookiesAccepted', 'true');
        showBanner.value = false;
    }
};

onBeforeMount(() => {
    checkCookiesAccepted();
});

onBeforeRouteUpdate((to) => {
    if (contractualPages.includes(to.name as string)) {
        showBanner.value = false;
    } else {
        checkCookiesAccepted();
    }
});


</script>

<template>
    <AlertDialog v-if="!isContractualPage" @update:open="acceptCookies" :open="showBanner">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Gestion des cookies</AlertDialogTitle>
                <AlertDialogDescription>
                    Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à
                    naviguer sur le site, vous acceptez notre utilisation des cookies.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel as-child>
                    <RouterLink :to="{ name: 'cookie-policy' }" class="underline">En savoir plus</RouterLink>
                </AlertDialogCancel>
                <AlertDialogAction as-child>
                    <Button @click="acceptCookies"
                        class="bg-secondary text-secondary-foreground py-2 px-4 rounded">Accepter</Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
