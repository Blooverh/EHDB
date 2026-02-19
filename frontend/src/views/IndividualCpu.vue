<script setup>
// Component import
import HeroPart from '@/components/IndividualPage_Components/Hero_part.vue' // hero component for individual parts
import CpuSpecs from '@/components/IndividualPage_Components/CpuSpecs.vue'
import '../assets/css/individual-parts.css'
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { cpuBrandFormatter, formatModel } from '@/utils/formatCpuTitle'
import { Store, SquareArrowOutUpRight } from 'lucide-vue-next'

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

const favicon_links = {
  'Cloud Ninjas': 'https://ik.imagekit.io/blooverh/EHDB/cloud_ninjas_favicon.webp',
  'Server Monkey': 'https://ik.imagekit.io/blooverh/EHDB/ServerMonkey_Logo_Head_3.png',
  xByte: 'https://ik.imagekit.io/blooverh/EHDB/xbyte-favicon-96x96.png',
}

const getFavicon = (website) => favicon_links[website] || ''

const coreProps = [
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'codename', label: 'Codename' },
  { key: 'generation', label: 'Generation' },
  { key: 'socket', label: 'Socket' },
  { key: 'socketPackage', label: 'Socket Package' },
  { key: 'coreNum', label: 'Cores' },
  { key: 'threadNum', label: 'Threads' },
  { key: 'frequency', label: 'Base Frequency (GHz)' },
  { key: 'turboFrequency', label: 'Turbo Frequency (GHz)' },
  { key: 'tdp', label: 'TDP (W)' },
  { key: 'processSize', label: 'Process Size' },
  { key: 'partNum', label: 'Part Number' },
  { key: 'pcieGen', label: 'PCIe Generation' },
]

const memoryProps = [
  { key: 'memorySupport', label: 'Memory Support' },
  { key: 'ratedSpeeds', label: 'Max Rated Speed (MT/s)' },
  { key: 'memoryBus', label: 'Memory Bus' },
  { key: 'eccMemory', label: 'ECC Memory Support' },
  { key: 'cache.cacheL1', label: 'L1 Cache' },
  { key: 'cache.cacheL2', label: 'L2 Cache' },
  { key: 'cache.cacheL3', label: 'L3 Cache (MB)' },
]

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

      <div class="container d-flex flex-column gap-2">
        <div class="d-flex flex-row align-items-center gap-2">
          <Store :size="30" />
          <h2 class="fw-bold mb-0">Where To Buy</h2>
        </div>

        <ol class="d-flex flex-row gap-3 p-0">
          <li class="buy-item" v-for="listing in cpu.info">
            <!-- svg or image of website -->
            <img
              class="website_favicons"
              :src="getFavicon(listing.website)"
              :alt="`${cpu.brand} ${cpu.model} - ${listing.website}`"
            />
            <!-- name of website -->
            <span class="website-item fw-bold">{{ listing.website }}</span>
            <!-- current Price -->
            <span class="price-item">${{ listing.currPrice }}</span>
            <!-- anchor to link with small svg -->
            <a
              class="link-item d-flex flex-row gap-1 align-items-center"
              target="_blank"
              :href="listing.link"
            >
              <span>Visit</span>
              <SquareArrowOutUpRight :size="16" :stroke-width="2" />
            </a>
          </li>
        </ol>
      </div>

      <CpuSpecs :part="cpu" boxTitle="Core Specifications" :properties="coreProps" />

      <CpuSpecs :part="cpu" boxTitle="Cache &amp; Memory" :properties="memoryProps" />
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
