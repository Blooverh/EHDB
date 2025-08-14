<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>

  <div v-if="cpus">
    <ul v-for="(item, idx) in cpus" :key="item.id || idx">
      <li>{{ item.brand }} {{  item.model }}</li>
    </ul>
  </div>
</template>

<style scoped></style>
