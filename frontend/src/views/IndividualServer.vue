<script setup>
import '../assets/css/individual-parts.css'
import HeroPart from '@/components/IndividualPage_Components/Hero_part.vue'
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Store, SquareArrowOutUpRight, Info, TrendingUp } from 'lucide-vue-next'
import ServerSpecs from '@/components/IndividualPage_Components/ServerSpecs.vue'
import PriceHistoryServer from '@/components/PriceHistoryServer.vue'
import { Tooltip } from 'bootstrap'

const route = useRoute()
const error = ref(null)
const loading = ref(true)
const server = ref(null)
const selectedWebsite = ref('') // reactive variable to keep track which website price graph is being displayed

// we compute based on future changes on webiste additions or removals
const uniqueWebsites = computed(() => {
  if (!server.value?.chassisInfo) return []
  const websites = [...new Set(server.value.chassisInfo.map((item) => item.website))] // we use set to avoid replicated websites 
  if (websites.length > 0 && !selectedWebsite.value) {
    selectedWebsite.value = websites[0]
  }
  return websites
})

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
    initTooltips() // initializ tool tip after information is loaded and not on first page load due to data taking time be fetched
  }
})

const favicon_links = {
  'Cloud Ninjas': 'https://ik.imagekit.io/blooverh/EHDB/cloud_ninjas_favicon.webp',
  'Server Monkey': 'https://ik.imagekit.io/blooverh/EHDB/ServerMonkey_Logo_Head_3.png',
  xByte: 'https://ik.imagekit.io/blooverh/EHDB/xbyte-favicon-96x96.png',
}

const getFavicon = (website) => favicon_links[website] || ''

// nextTick is used where we can only offer the tool tip after data is loaded
const initTooltips = () => {
  nextTick(() => {
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipElements.forEach((el) => new Tooltip(el))
  })
}

// Property Setup for servers

// Single value properties
const singleVal_Props = [
  { key: 'brand', label: 'Brand' },
  { key: 'model', label: 'Model' },
  { key: 'socketInfo', label: 'Socket Type' },
  { key: 'motherboardType', label: 'Motherboard Memory Generation' },
  { key: 'serverType', label: 'Server Physical Size' },
  { key: 'userManual', label: 'User Manual' },
  { key: 'techSpecs', label: 'Server Specifications' },
]

// multiple Value general properties
const multipleVal_props = [
  { key: 'compatibleCpuGen', label: 'Processor Generations' },
  { key: 'memorySpecs.memory_type', label: 'Memory Type' },
  { key: 'memorySpecs.speeds', label: 'Compatible Memory Speeds' },
  { key: 'memorySpecs.max_configs', label: 'Server Configurations' },
  { key: 'ssdInterfaces', label: 'SSD Interfaces' },
  { key: 'expansionSlots', label: 'PCIe Expansion Slots' },
  { key: 'nicInterfaces', label: 'Network Card Interfaces' },
]

// Multiple value properties where values are official parts
const partsVal_props = [
  { key: 'compatibleRaids', label: 'RAID Controllers' },
  { key: 'compatibleOs', label: 'Compatible Operating Systems' },
  { key: 'compatibleNics', label: 'Compatible Network Cards' },
  { key: 'compatiblePSU', label: 'Power Supply Configurations' },
  { key: 'sysManagement', label: 'System Management Software' },
]

watch(server, (newServer) => {
  if (newServer) {
    document.title = `${newServer.brand} ${newServer.model}`
  } else if (error.value) {
    document.title = '404 Not Found'
  }
})
</script>

<template>
  <div>
    <div v-if="server">
      <HeroPart :part="server" type="server" />

      <!-- Specs Component -->

      <ServerSpecs :part="server" boxTitle="Quick Specifications" :properties="singleVal_Props" />

      <ServerSpecs
        :part="server"
        boxTitle="Server Component Compatibility"
        :properties="multipleVal_props"
      />

      <ServerSpecs
        :part="server"
        boxTitle="Server Part List Compatibility"
        :properties="partsVal_props"
      />

      <!-- Price History Tabs -->
      <div v-if="uniqueWebsites.length > 0" class="container mb-3 mt-5">
        <div class="d-flex align-items-center justify-content-center gap-2 mb-3">
          <TrendingUp :size="30" />
          <h3 class="fw-bold mb-0">Price Tracker</h3>
        </div>

        <ul class="nav nav-tabs">
          <li v-for="website in uniqueWebsites" :key="website" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: selectedWebsite === website }"
              @click="selectedWebsite = website"
            >
              {{ website }}
            </button>
          </li>
        </ul>
        <PriceHistoryServer :chassisInfo="server.chassisInfo" :selectedWebsite="selectedWebsite" />
      </div>

      <!-- List of where to buy -->

      <div class="container d-flex flex-column gap-2 mt-5">
        <div class="d-flex flex-row align-items-center justify-content-center gap-2 mb-3">
          <Store :size="30" />
          <h2 class="fw-bold mb-0">Where to buy</h2>
        </div>

        <ol class="d-flex flex-column gap-2 p-0">
          <li class="buy-item-vertical" v-for="listing in server.chassisInfo">
            <div class="d-flex flex-row flex-wrap align-items-center gap-3 w-100">
              <img
                class="website_favicons"
                :src="getFavicon(listing.website)"
                :alt="`${server.brand} ${server.model} - ${listing.website}`"
              />

              <div class="d-flex flex-column flex-grow-1" style="min-width: 120px">
                <span class="website-item fw-bold">{{ listing.website }}</span>
                <span v-if="listing.chassis" class="website-item text-muted small">
                  {{ listing.chassis }}
                </span>
              </div>

              <div class="d-flex align-items-center gap-2">
                <span class="price-item fw-bold">${{ listing.currPrice }}</span>

                <span
                  v-if="listing.priceChange !== 0"
                  class="price-change fw-bold"
                  :class="listing.priceChange > 0 ? 'text-danger' : 'text-success'"
                >
                  {{ listing.priceChange > 0 ? '+' : '' }}${{ listing.priceChange }}
                </span>
              </div>

              <a
                class="link-item d-flex flex-row gap-1 align-items-center btn btn-primary btn-sm"
                target="_blank"
                :href="listing.websiteLink"
              >
                <span>Visit</span>
                <SquareArrowOutUpRight :size="16" :stroke-width="2" />
              </a>
            </div>
          </li>
        </ol>
      </div>
    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
