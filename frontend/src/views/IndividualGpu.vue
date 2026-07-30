<script setup>
import '../assets/css/individual-parts.css'
import HeroPart from '@/components/IndividualPage_Components/Hero_part.vue'
import ComponentSpecs from '@/components/IndividualPage_Components/ComponentSpecs.vue'
import PriceHistoryCpu from '@/components/PriceHistoryCpu.vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Store, SquareArrowOutUpRight } from 'lucide-vue-next'
import Skeleton from '@/components/IndividualPage_Components/Skeleton.vue'

const route = useRoute()
const error = ref(null)
const loading = ref(true)
const gpu = ref(null)

onMounted(async () => {
  const gpuBrand = route.params.brand
  const gpuSlug = route.params.slug

  try {
    if (!gpuBrand || !gpuSlug) {
      error.value = 'No GPU Provided'
      loading.value = false
      return
    }
    const response = await axios.get(`/api/gpus/${gpuBrand}/${gpuSlug}`)
    gpu.value = response.data
  } catch (err) {
    if (err.response?.status === 404) {
      error.value = 'GPU Not Found'
    } else {
      error.value = 'Failed to fetch GPU info'
    }
    console.error(err)
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

// Core GPU specifications
const coreProps = [
  { key: 'brand', label: 'Brand' },
  { key: 'gpuBrand', label: 'GPU Chip Brand' },
  { key: 'model', label: 'Model' },
  { key: 'vram', label: 'VRAM (GB)' },
  { key: 'vramType', label: 'VRAM Type' },
  { key: 'coreClock', label: 'Core Clock (MHz)' },
  { key: 'boostClock', label: 'Boost Clock (MHz)' },
  { key: 'power', label: 'TDP (W)' },
  { key: 'powerConnectors', label: 'Power Connectors' },
  { key: 'pcieInterface', label: 'PCIe Interface' },
  { key: 'slotWidth', label: 'Slot Width' },
]

// GPU compute & output specifications
const computeProps = [
  { key: 'cudaCores', label: 'CUDA Cores' },
  { key: 'tensorCores', label: 'Tensor Cores' },
  { key: 'RayTracingCores', label: 'RT Cores' },
  { key: 'memoryBandwidth', label: 'Memory Bandwidth (GB/s)' },
  { key: 'coolingType', label: 'Cooling Type' },
  { key: 'cardDimensions', label: 'Card Dimensions' },
  { key: 'gpuWorkload', label: 'Workload' },
  { key: 'brandMPN', label: 'Brand MPN' },
  { key: 'gpuBrandMPN', label: 'GPU Brand MPN' },
]

// GPU tags as array
const tagsProps = [{ key: 'gpuTags', label: 'GPU Tags' }]

watch(gpu, (newGpu) => {
  if (newGpu) {
    document.title = `${newGpu.brand} ${newGpu.model}`
  } else if (error.value) {
    document.title = '404 Not Found'
  }
})
</script>

<template>
  <div>
    <div v-if="gpu">
      <HeroPart :part="gpu" type="gpu" />

      <div class="container d-flex flex-column gap-2 mt-3 mb-3">
        <div class="d-flex flex-row align-items-center gap-2 justify-content-center">
          <Store :size="30" />
          <h2 class="fw-bold mb-0">Where To Buy</h2>
        </div>

        <ol class="d-flex flex-row gap-3 p-0 justify-content-start">
          <li class="buy-item" v-for="listing in gpu.gpuInfo">
            <img
              class="website_favicons"
              :src="getFavicon(listing.website)"
              :alt="`${gpu.brand} ${gpu.model} - ${listing.website}`"
            />

            <span class="website-item fw-bold">{{ listing.website }}</span>

            <span class="price-item">${{ listing.currPrice.toLocaleString() }}</span>
            <a
              class="link-item d-flex flex-row gap-1 align-items-center"
              target="_blank"
              :href="listing.websiteLink"
            >
              <span style="color: gray">Visit</span>
              <SquareArrowOutUpRight color="gray" :size="16" :stroke-width="2" />
            </a>
          </li>
        </ol>
      </div>

      <PriceHistoryCpu v-if="gpu.gpuInfo && gpu.gpuInfo.length" :listings="gpu.gpuInfo" />

      <ComponentSpecs :part="gpu" boxTitle="Core Specifications" :properties="coreProps" />

      <ComponentSpecs :part="gpu" boxTitle="Compute &amp; Physical" :properties="computeProps" />

      <ComponentSpecs
        v-if="gpu.gpuTags && gpu.gpuTags.length && gpu.gpuTags[0] !== 'N/A'"
        :part="gpu"
        boxTitle="Workloads"
        :properties="tagsProps"
      />
    </div>
    <div v-else-if="loading"><Skeleton /></div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
