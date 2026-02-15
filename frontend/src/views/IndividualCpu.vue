<script setup>
// Component import
import HeroPart from '@/components/IndividualPage_Components/Hero_part.vue' // hero component for individual parts
import '../assets/css/individual-parts.css';
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { cpuBrandFormatter, formatModel } from '@/utils/formatCpuTitle'
import { Store } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const error = ref(false)
const loading = ref(true)
const cpu = ref(null)

onMounted(async () => {
  const cpuBrand = route.params.brand
  const cpuSlug = route.params.slug

  try {
    // if no cpu brand or slug URI, load error value as not provided by route
    if (!cpuBrand || !cpuSlug) {
      error.value = 'No CPU Provided'
      loading.value = false // load value to false, as there is nothing to load
      return
    }
    const response = await axios.get(`/api/cpus/${cpuBrand}/${cpuSlug}`)
    cpu.value = response.data
  } catch (error) {
    if (error.response.status === 404) {
      error.value = 'CPU Not Found. Failed Fetching CPU'
    } else if (error.response.status === 400) {
      error.value = 'Failed to fetch servers. Try again later!'
    } else {
      error.value = 'Info fetching failed'
    }

    console.error(error)
  } finally {
    loading.value = false
  }
})

// default document title
document.title = 'Individual CPU'

// on a change of cpu for this view, we change the document title depending on the current cpu page
watch(cpu, (newCPU) => {
  if (newCPU) {
    document.title = `${cpuBrandFormatter(newCPU.brand)} ${formatModel(newCPU.model)}`
  } else if (error.value) {
    document.title = '404 Not Found'
  }
})
</script>

<template>
  <div>
    <div v-if="cpu">
        <HeroPart :part="cpu" type="cpu" />

        <div class="container d-flex flex-column">
            <div class="d-flex flex-row align-items-center gap-2">
                <Store />
                <h2 class="fw-bold mb-0">Where To Buy</h2>
            </div>

            <ol class="d-flex flex-row gap-2">
                <li class="buy-item" v-for="listings in cpu.info">
                    <!-- svg or image of website -->

                    <!-- name of website -->
                    <span class="website-item fw-bold">{{ listings.website }}</span>
                    <!-- current Price -->
                    <span class="price-item">${{ listings.currPrice }}</span>
                    <!-- anchor to link with small svg -->
                    <span class="link-item"></span>
                </li>
            </ol>
        </div>
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
