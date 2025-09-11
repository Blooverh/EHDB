<script setup>
import Header from './components/Header.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <Header />
  </header>
  <main>
    <RouterView/>
  </main>
  <footer>
    Footer 
  </footer>
  
</template>

<style scoped></style>
