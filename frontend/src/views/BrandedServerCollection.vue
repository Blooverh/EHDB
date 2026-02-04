<script setup>
import '../assets/css/hardwareCollection.css'
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import BrandedServerFilterBox from '@/components/BrandedServerFilterBox.vue'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next'
import ServerVerticalCard from '@/components/serverVerticalCard.vue'

const router = useRouter()
const route = useRoute()

// current page is computed property derived from url
const currentPage = computed(() => parseInt(route.query.page) || 1)

// DATA
//Reactive Objs
const servers = ref([])
const totalPages = ref(0)
const totalServers = ref(0)
const loading = ref(true)
const error = ref(false)
const brand_server = ref(null)

// reactive objs for filter
const filters = ref({
  socket: [],
  cpuGen: [],
  moboType: [],
  memoryType: [],
  speeds: [],
  ssdInterfaces: [],
})

const selectedFilters = ref({
  socket: [].concat(route.query.socket || []),
  cpuGen: [].concat(route.query.cpuGen || []),
  moboType: [].concat(route.query.moboType || []),
  memoryType: [].concat(route.query.memoryType || []),
  speeds: [].concat(route.query.speeds || []),
  ssdInterfaces: [].concat(route.query.ssdInterfaces || []),
})

// Actions
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

// pagination actions now directly trigger a route change
const goToPage = (page) => {
  // query retains query params and page number
  const query = { ...route.query, page }

  // if page number is less or equal to 1 we delete parameters from query
  if (page <= 1) {
    delete query.page
  }

  // if page more than 1 we push query prams to router
  router.push({ query })
}

// functions that iterates to next or previous page and triggers route change
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// WATCHERS (SIDE EFFECTS)
/* 
    - we pass query as argument and will watch based on new query if we need to update query in URL 
    */

watch(
  () => route.query,
  async (newQuery) => {
    loading.value = true
    error.value = false

    // Always sync selectedFilters with URL first (outside try-catch)
    selectedFilters.value = {
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
      const params = new URLSearchParams(newQuery)
      const serverBrand = route.params.brand

      // since watcher changes immediate to avoid undefined we check if param exists
      if (!serverBrand) return

      const response = await axios.get(`/api/servers/${serverBrand}?${params.toString()}`)
      servers.value = response.data.servers
      totalServers.value = response.data.totalServers
      totalPages.value = response.data.totalPages
      brand_server.value = serverBrand

      const { data } = await axios.get(`/api/servers/${serverBrand}/filter-options`)
      filters.value = data
    } catch (err) {
      if (err.response && err.response.status === 404) {
        error.value = 'No Servers match this Brand selection'
        totalServers.value = 0
      } else {
        error.value = 'Failed to fetch Servers. Please Try Again'
      }
      console.error(err.response)
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="part-collection">
    <!-- ServerFilterBox for brands -->
    <BrandedServerFilterBox
      :filters="filters"
      :selectedFilters="selectedFilters"
      @filters-changed="updateFilters"
      @reset-filter="resetFilters"
    />

    <div class="collection-container">
      <div class="title-collection d-flex flex-row align-items-center">
        <svg
          width="50"
          height="50"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.3334 1.33325H2.66671C1.93033 1.33325 1.33337 1.93021 1.33337 2.66659V5.33325C1.33337 6.06963 1.93033 6.66659 2.66671 6.66659H13.3334C14.0698 6.66659 14.6667 6.06963 14.6667 5.33325V2.66659C14.6667 1.93021 14.0698 1.33325 13.3334 1.33325Z"
            stroke="#082D5E"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.3334 9.33325H2.66671C1.93033 9.33325 1.33337 9.93021 1.33337 10.6666V13.3333C1.33337 14.0696 1.93033 14.6666 2.66671 14.6666H13.3334C14.0698 14.6666 14.6667 14.0696 14.6667 13.3333V10.6666C14.6667 9.93021 14.0698 9.33325 13.3334 9.33325Z"
            stroke="#082D5E"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 4H4.00667"
            stroke="#082D5E"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 12H4.00667"
            stroke="#082D5E"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h1>{{ brand_server }} Server Collection</h1>
      </div>

      <p v-if="totalServers > 0">
        Current List of {{ brand_server }} Servers: ({{ totalServers }})
      </p>

      <div v-if="loading" class="loading-message">Loading Servers...</div>

      <div v-if="error" class="error-message">
        {{ error }}
        Reset Filters !
      </div>

      <div v-if="!loading && !error">
        <div
          v-if="servers.length > 0"
          class="d-flex flex-wrap flex-row gap-5 m-3 algin-items-center"
        >
          <ServerVerticalCard v-for="server in servers" :key="server._id" :server="server" />
        </div>
        <div v-else class="no-results">
          <p>No servers found matching your criteria.</p>
        </div>
      </div>
      <!-- Pagination Controls -->
      <div
        v-if="!loading && totalPages > 1"
        class="pagination-controls d-flex justify-content-center"
      >
        <button
          @click="prevPage"
          :disabled="currentPage <= 1"
          :class="{ active: currentPage > 1 }"
          class="btn-box-left p-2"
        >
          <ArrowBigLeft />
        </button>
        <span class="p-2 fw-bold">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          :class="{ active: currentPage <= totalPages }"
          class="p-2 btn-box-right"
        >
          <ArrowBigRight />
        </button>
      </div>
    </div>
  </div>
</template>
