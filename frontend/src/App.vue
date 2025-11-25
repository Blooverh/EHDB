<script setup>
import Header from './components/Header.vue';
import Footer from './components/footer.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <header>
    <Header />
  </header>
  <main>
    <RouterView/>
  </main>
  <Footer />
  
</template>

<style scoped></style>
