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
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from './ui/button/Button.vue';

const route = useRoute();

const open = ref(true);
const contractualPages = ['conditions', 'confidentiality-declaration', 'cookie-policy'];

const isContractualPage = computed(() => {
  return contractualPages.includes(route.name as string);
});

const checkCookiesAccepted = () => {
  if (localStorage.getItem('cookiesAccepted') === 'true' || isContractualPage.value) {
    open.value = false;
  }
};

const acceptCookies = (value: boolean) => {
  if (value) {
    localStorage.setItem('cookiesAccepted', 'true');
    open.value = false;
  }
};

const handleCloseAlert = () => {
  open.value = false;
};

onBeforeMount(() => {
  checkCookiesAccepted();
});

onBeforeRouteUpdate((to) => {
  if (contractualPages.includes(to.name as string)) {
    open.value = false;
  } else {
    checkCookiesAccepted();
  }
});
</script>

<template>
  <AlertDialog v-if="!isContractualPage" @update:open="acceptCookies" :open="open">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Gestion des cookies</AlertDialogTitle>
        <AlertDialogDescription>
          Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à
          naviguer sur le site, vous acceptez notre utilisation des cookies.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="flex flex-col gap-1">
        <AlertDialogAction @click="acceptCookies"> Accepter </AlertDialogAction>
        <p role="button" class="text-sm text-primary text-end" @click="handleCloseAlert">
          Continuer sans accepter
        </p>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
