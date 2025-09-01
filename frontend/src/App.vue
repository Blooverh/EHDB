<script setup>
import Header from './components/Header.vue';
import Homepage from './views/Homepage.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { RouterView } from 'vue-router';


const cpus = ref(null);

onMounted( async () => {
  try{
    const cpusRes = await axios.get('/api/cpus/amd');
    cpus.value = cpusRes.data;
  }catch(err){
    err.value = err.message
  }
});
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
