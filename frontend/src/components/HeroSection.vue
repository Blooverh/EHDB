<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import LiveSearchBar from './LiveSearchBar.vue'
import '../assets/css/hero-homepage.css'
import { Gpu, Server, Cpu, LoaderCircle } from 'lucide-vue-next'

const error = ref(null)
const servers = ref(null)
const cpus = ref(null)
const gpus = ref(null)

onMounted(async () => {
  try {
    const serverRes = await axios.get('/api/servers-length')
    const cpuRes = await axios.get('/api/cpus-length')
    const gpuRes = await axios.get('/api/gpus-length')
    servers.value = serverRes.data
    cpus.value = cpuRes.data
    gpus.value = gpuRes.data
  } catch (err) {
    error.value = err.message
  }
})
</script>

<template>
  <div class="hero-section">
    <div class="hero-box">
      <h1 class="hero-titles">
        <span class="title-a">Enterprise</span>
        <span class="title-b">Hardware</span>
        <span class="title-a">Database</span>
      </h1>

      <h2 class="sub-hero-title">
        Looking For a One Stop Shop, For Specifications, Comparisons and Insights On Hardware Parts,
        Such as CPUs, Servers, Storage, and Memory From Leading Manufacturers? This Database Is For
        you!
      </h2>
    </div>

    <!-- Search Box -->
    <LiveSearchBar />
    <!-- Info Blocks -->
    <div class="hardware-info-box">
      <div class="hardware-card">
        <div v-if="error">
          <p>Error Fetching Data</p>
        </div>
        <div v-else-if="servers" class="box-align">
          <Server class="box-icon" />
          <span class="box-span">Servers</span>
          <span class="parts-in-db" v-if="servers > 100"> 100+</span>
        </div>
        <div v-else>
          <LoaderCircle class="box-icon spinning" />
        </div>
      </div>
      <div class="hardware-card">
        <div v-if="error">
          <p>Error Fetching Data</p>
        </div>
        <div v-else-if="cpus" class="box-align">
          <Cpu class="box-icon" />
          <span class="box-span">Processors</span>
          <span class="parts-in-db" v-if="cpus > 400"> 400+</span>
        </div>
        <div v-else>
          <LoaderCircle class="box-icon spinning" />
        </div>
      </div>
      <div class="hardware-card">
        <div v-if="error">
          <p>Error Fetching Data</p>
        </div>
        <div v-else-if="gpus" class="box-align">
          <Gpu class="box-icon" />
          <span class="box-span">GPUs</span>
          <span class="parts-in-db" v-if="gpus > 40"> 40+</span>
        </div>
        <div v-else>
          <LoaderCircle class="box-icon spinning" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
