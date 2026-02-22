<script setup>
import '../assets/css/individual-parts.css'
import HeroPart from '@/components/IndividualPage_Components/Hero_part.vue'
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Store, SquareArrowOutUpRight, Info, Server } from 'lucide-vue-next'
import ServerSpecs from '@/components/IndividualPage_Components/ServerSpecs.vue'
import { Tooltip } from 'bootstrap'


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
  {key: 'brand', label: 'Brand'},
  {key: 'model', label: 'Model'},
  {key: 'socketInfo', label: 'Socket Type'},
  {key: 'motherboardType', label: 'Motherboard Memory Generation'},
  {key: 'serverType', label: 'Server Physical Size'},
  {key: 'userManual', label: 'User Manual'},
  {key: 'techSpecs', label: 'Server Specifications'}
]

// multiple Value general properties
const multipleVal_props = [
  {key: 'compatibleCpuGen', label: 'Processor Generations'},
  {key: 'memorySpecs.memory_type', label: 'Memory Type'}, 
  {key: 'memorySpecs.speeds', label: 'Compatible Memory Speeds'},
  {key: 'memorySpecs.max_configs', label: 'Server Configurations'},
  {key: 'ssdInterfaces', label: 'SSD Interfaces'},
  {key: 'expansionSlots', label: 'PCIe Expansion Slots'},
  {key: 'nicInterfaces', label: 'Network Card Interfaces'},

]

// Multiple value properties where values are official parts
const partsVal_props = [
  {key: 'compatibleRaids', label: 'RAID Controllers'},
  {key: 'compatibleOs', label: 'Compatible Operating Systems'}, 
  {key: 'compatibleNics', label: 'Compatible Network Cards'}, 
  {key: 'compatiblePSU', label: 'Power Supply Configurations'}, 
  {key: 'sysManagement', label: 'System Management Software'}
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

      <div class="container d-flex flex-column gap-2">
        <div class="d-flex flex-row align-items-center gap-2">
          <Store :size="30" />
          <h2 class="fw-bold mb-0">Where to buy</h2>
        </div>

        <ol class="d-flex flex-row flex-wrap gap-3 p-0">
          <li class="buy-item" v-for="listing in server.chassisInfo">
            <img
              class="website_favicons"
              :src="getFavicon(listing.website)"
              :alt="`${server.brand} ${server.model} - ${listing.website}`"
            />

            <span class="website-item fw-bold">{{ listing.website }}</span>
            
            <span class="price-item">${{ listing.currPrice }}</span>
            
            <span
              v-if="listing.chassis"
              class="chassis-tooltip"
              data-bs-toggle="tooltip"
              :data-bs-title="listing.chassis"
            >
              <Info :size="16" :stroke-width="2" />
              Chassis
            </span>
            
            <a
              class="link-item d-flex flex-row gap-1 align-items-center"
              target="_blank"
              :href="listing.websiteLink"
            >
              <span>Visit</span>
              <SquareArrowOutUpRight :size="16" :stroke-width="2" />
            </a>
          </li>
        </ol>
      </div>

      <!-- Specs Component -->

      <ServerSpecs :part="server" boxTitle="Quick Specifications" :properties="singleVal_Props" />

      <ServerSpecs :part="server" boxTitle="Server Component Compatibility" :properties="multipleVal_props" />

      <ServerSpecs :part="server" boxTitle="Server Part List Compatibility" :properties="partsVal_props" />
    

    </div>
    <div v-else-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>

<style scoped>
  .chassis-tooltip {
    cursor: pointer;
    color: #6c757d;
    display: inline-flex;
    align-items: center;
  }

  .chassis-tooltip:hover {
    color: #495057;
  }

  .buy-item{
    height: auto;
  }
</style>
