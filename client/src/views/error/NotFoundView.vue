<template>

<div class="flex flex-col h-screen bg-tea-600">
  <h1 class="text-9xl font-bold text-white flex items-center justify-center sm:text-[6rem] md:text-[8rem] lg:text-[25rem] mt-20">
    4
    <img src="./img/sachet.png" alt="" class="h-32 w-32 sm:h-64 sm:w-64 lg:h-72 lg:w-72 mx-4" />
    4
  </h1>

  <p class="font-bold sm:text-4xl text-white mt-4 flex justify-center ">OOOPS ! CETTE PAGE N'EXISTE PAS</p>

  <div class="mt-8 flex justify-center">
    <RouterLink :to="{ name: 'home' }">
      <p class="p-4 text-white rounded-md bg-tea-500 hover:bg-tea-400 cursor-pointer">
        Retourner à l'accueil
      </p>
    </RouterLink>
  </div>
</div>


</template>
