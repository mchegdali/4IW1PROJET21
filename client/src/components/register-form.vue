<script setup lang="ts">
import Input from './ui/input/Input.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <div class="flex flex-col gap-4">
    <label>Adresse e-mail</label>
    <Input id="search" type="text" placeholder="E-mail" class="pl-10" />
    <label>Prenom</label>
    <Input id="search" type="text" placeholder="Prenom" class="pl-10" />
    <label>Nom de famille</label>
    <Input id="search" type="text" placeholder="Nom de famille" class="pl-10" />
    <label>Mot de passe</label>
    <Input id="search" type="text" placeholder="Mot de passe" class="pl-10" />
    <label>Date de naissance</label>
    <Input id="search" type="text" placeholder="Mot de passe" class="pl-10" />
    <Button class="w-full">Confirmer</Button>
    <a href="/" class="text-center">Déja un compte ?</a>
  </div>
</template>
