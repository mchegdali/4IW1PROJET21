<template>
  <div class="flex flex-col items-center h-screen bg-tea-600">


    <h1 class="text-[400px] font-bold flex items-center justify-center text-white">
      4
      <img src="./img/sachet.png" alt="" class="w-64 h-64 mb-4" />
      4
    </h1>
    
    <p class="font-bold text-4xl text-white">OOOPS ! CETTE PAGE N'EXISTE PAS</p>

    <div class="block mt-20">
      <RouterLink :to="{ name: 'home' }">
        <p class="p-4 text-white rounded-md bg-tea-500">Retourner à l'accueil</p>
      </RouterLink>
    </div>
  </div>
</template>
