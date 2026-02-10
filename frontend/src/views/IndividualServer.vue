<script setup>
import HeroPart from '@/components/IndividualPage_Components/Hero_part.vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const error = ref(null)
const loading = ref(true)
const server = ref(null)

onMounted(async () => {
  const serverBrand = route.params.brand
  const serverSlug = route.params.slug

  try {
    if (!serverBrand || !serverSlug) {
      error.value = 'No Server Provided'
      loading.value = false
      return
    }
    const response = await axios.get(`/api/servers/${serverBrand}/${serverSlug}`)
    server.value = response.data
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'Server Not Found'
    } else {
      error.value = 'Failed to fetch server info'
    }
    console.error(err)
  } finally {
    loading.value = false
  }
})

document.title = 'Individual Server'

watch(server, (newServer) => {
  if (newServer) {
    document.title = `${newServer.brand?.toUpperCase()} ${newServer.model}`
  } else if (error.value) {
    document.title = '404 Not Found'
  }
})
</script>

<template>
  <div>
    <div v-if="server">
      <HeroPart :part="server" type="server" />
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
