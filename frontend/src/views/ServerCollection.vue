<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import '../assets/css/hardwareCollection.css'
import FilterBox from '@/components/FilterBox.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import { Server } from 'lucide-vue-next'
import { SlidersHorizontal } from 'lucide-vue-next'
import HardwareVerticalCard from '@/components/HardwareVerticalCard.vue'

// Filter section configuration for the unified FilterBox
const filterSections = [
  { key: 'brand', dataKey: 'brands', label: 'Brand' },
  { key: 'socket', label: 'CPU Socket' },
  { key: 'cpuGen', label: 'CPU Generation' },
  { key: 'ssdInterfaces', label: 'SSD Interface' },
  { key: 'moboType', label: 'Motherboard Type' },
  { key: 'speeds', label: 'Memory Speeds', format: (v) => `${v} MT/s` },
  { key: 'memoryType', label: 'Memory Types' },
]

// --- Router and Route instances ---
const router = useRouter()
const route = useRoute()

// Filter visibility state - hidden by default on mobile
const showFilters = ref(window.innerWidth > 768)

// --- State Management ---
const servers = ref([])
// current page is now a computed property derived from the URL
const currentPage = computed(() => parseInt(route.query.page) || 1)
const totalPages = ref(0)
const totalServers = ref(0)
const loading = ref(true)
const error = ref(false)

// Reactive objects for filter
const filters = ref({
  brands: [],
  socket: [],
  cpuGen: [],
  moboType: [],
  memoryType: [],
  speeds: [],
  ssdInterfaces: [],
})

const selectedFilters = ref({
  brand: [].concat(route.query.brand || []),
  socket: [].concat(route.query.socket || []),
  cpuGen: [].concat(route.query.cpuGen || []),
  moboType: [].concat(route.query.moboType || []),
  memoryType: [].concat(route.query.memoryType || []),
  speeds: [].concat(route.query.speeds || []),
  ssdInterfaces: [].concat(route.query.ssdInterfaces || []),
})

// --- ACTIONS ---
const updateFilters = (newFilters) => {
  const query = { ...route.query }

  // Iterate over the new filters and update the query object
  for (const key in newFilters) {
    const value = newFilters[key]
    let keyChecker = ''

    // get correct model properties for filtering
    if (key === 'memoryType') {
      keyChecker = 'memorySpecs.memory_type'
    } else if (key === 'speeds') {
      keyChecker = 'memorySpecs.speeds'
    } else if (key === 'socket') {
      keyChecker = 'socketInfo'
    } else if (key === 'cpuGen') {
      keyChecker = 'compatibleCpuGen'
    } else if (key === 'moboType') {
      keyChecker = 'motherboardType'
    } else if (key === 'ssdInterfaces') {
      keyChecker = 'ssdInterfaces'
    } else {
      keyChecker = key
    }

    // If the filter has a value, add it to the query.
    if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      query[keyChecker] = value
    } else {
      // Otherwise, remove it from the query.
      delete query[keyChecker]
    }
  }

  // When filters change, always reset to the first page
  delete query.page

  router.push({ query })
}

const resetFilters = () => {
  // remove all query params from URL
  // resetting the filters and page number
  router.push({ query: {} })
}

// PAGINATION
const goToPage = (page) => {
  const query = { ...route.query, page } // query retains the query params and the page number
  console.log(query)

  // if page number is less than 1 all query parameter for page is deleted
  if (page <= 1) {
    delete query.page
  }

  // if page is different from 0 and 1 we pass to router the route with query parameters and page
  router.push({ query })
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Watcher

/*
  When URL changes we fetch new data, no side effects as we use the old value for comparison to avoid refetching certain servers

*/

watch(
  () => route.query,
  async (newQuery) => {
    loading.value = true
    error.value = null

    // Always sync selectedFilters with URL first (outside try-catch)
    selectedFilters.value = {
      brand: [].concat(newQuery.brand || []),
      socket: [].concat(newQuery.socket || []),
      cpuGen: [].concat(newQuery.cpuGen || []),
      moboType: [].concat(newQuery.moboType || []),
      memoryType: [].concat(newQuery.memoryType || []),
      // Only parse to integer if value exists, otherwise return empty array
      // This prevents [NaN] when URL has no query params (e.g., when resetting filters)
      // parseInt(undefined) returns NaN, and [].concat(NaN) creates [NaN] which breaks checkbox logic
      speeds: newQuery.speeds ? [].concat(parseInt(newQuery.speeds)) : [],
      ssdInterfaces: [].concat(newQuery.ssdInterfaces || []),
    }

    try {
      const params = new URLSearchParams(newQuery) // this turns to a string like brand=dell&socket=am5
      // fetch data with the new query params
      const response = await axios.get(`/api/servers?${params.toString()}`)
      servers.value = response.data.servers
      totalPages.value = response.data.totalPages
      totalServers.value = response.data.totalServers

      const { data } = await axios.get('/api/servers/filter-options')
      filters.value = data
    } catch (err) {
      if (err.response.status === 404) {
        error.value = 'No Servers Match Your Selection'
        totalServers.value = 0
      } else {
        error.value = 'Failed to fetch servers. Please Try Again later.'
      }
    } finally {
      loading.value = false
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="part-collection">
    <button class="filter-toggle" @click="toggleFilters">
      <SlidersHorizontal :size="20" />
      {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
    </button>
    <FilterBox
      v-show="showFilters"
      :filters="filters"
      :selectedFilters="selectedFilters"
      :sections="filterSections"
      @filters-changed="updateFilters"
      @reset-filter="resetFilters"
    />

    <div class="collection-container">
      <div class="title-collection d-flex flex-row align-items-center" style="gap: 10px">
        <Server :size="35" />
        <h1>Server Collection</h1>
      </div>

      <p v-if="totalServers > 0">Current List: ({{ totalServers }} Servers)</p>

      <div v-if="loading" class="loading-message">Loading Servers...</div>

      <div v-if="error" class="error-message">
        {{ error }}
        Reset Filters !
      </div>

      <!-- if loading is completed and there is no error add Server Card -->
      <div v-if="!loading && !error">
        <div
          v-if="servers.length > 0"
          class="d-flex flex-wrap flex-row gap-5 m-3 algin-items-center"
        >
          <HardwareVerticalCard
            v-for="server in servers"
            :key="server._id"
            :item="server"
            type="server"
          />
        </div>
      </div>

      <PaginationControls
        v-if="!loading"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-change="goToPage"
      />
    </div>
  </div>
</template>
