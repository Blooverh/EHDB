<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import '../assets/css/hardwareCollection.css'
import GpuFilter from '@/components/GpuFilter.vue'
import GpuVerticalCard from '@/components/gpuVerticalCard.vue'
import { ArrowBigLeft, ArrowBigRight, Gpu } from 'lucide-vue-next'
import { SlidersHorizontal } from 'lucide-vue-next'

// --- Router and Route instances ---
const router = useRouter()
const route = useRoute()

// Filter visibility state - hidden by default on mobile
const showFilters = ref(window.innerWidth > 768)

// --- State Management ---
const gpus = ref([])
// current page is now a computed property derived from the URL
const currentPage = computed(() => parseInt(route.query.page) || 1)
const totalPages = ref(0)
const totalGpus = ref(0)
const loading = ref(true)
const error = ref(false)

// Reactive objects for filter
const filters = ref({
  brands: [],
  vram: [],
  vramType: [],
  pcieInterface: [],
  gpuWorkload: [],
})

const selectedFilters = ref({
  brand: [].concat(route.query.brand || []),
  vramType: [].concat(route.query.vramType || []),
  pcieInterface: [].concat(route.query.pcieInterface || []),
  gpuWorkload: [].concat(route.query.gpuWorkload || []),
  // Only parse to integer if value exists, otherwise return empty array
  // This prevents [NaN] when URL has no query params (e.g., when resetting filters)
  // parseInt(undefined) returns NaN, and [].concat(NaN) creates [NaN] which breaks checkbox logic
  vram: route.query.vram ? [].concat(parseInt(route.query.vram)) : [],
})

// --- ACTIONS ---
const updateFilters = (newFilters) => {
  const query = { ...route.query }

  // Iterate over the new filters and update the query object
  for (const key in newFilters) {
    const value = newFilters[key]

    // If the filter has a value, add it to the query.
    if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      query[key] = value
    } else {
      // Otherwise, remove it from the query.
      delete query[key]
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

  // if page number is less than 1 all query parameter for page is deleted
  if (page <= 1) {
    delete query.page
  }

  // if page is different from 0 and 1 we pass to router the route with query parameters and page
  router.push({ query })
}

// pagination function for next page and previous page
const nextPage = () => {
  // if current page is less than total page based on query we allow next page navigation
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const previousPage = () => {
  // if current page is more than 1
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Watcher

/*
  When URL changes we fetch new data.
*/

watch(
  () => route.query,
  async (newQuery) => {
    loading.value = true
    error.value = null

    // Always sync selectedFilters with URL first (outside try-catch)
    selectedFilters.value = {
      brand: [].concat(newQuery.brand || []),
      vramType: [].concat(newQuery.vramType || []),
      pcieInterface: [].concat(newQuery.pcieInterface || []),
      gpuWorkload: [].concat(newQuery.gpuWorkload || []),
      // Only parse to integer if value exists, otherwise return empty array
      // This prevents [NaN] when URL has no query params (e.g., when resetting filters)
      // parseInt(undefined) returns NaN, and [].concat(NaN) creates [NaN] which breaks checkbox logic
      vram: newQuery.vram ? [].concat(parseInt(newQuery.vram)) : [],
    }

    try {
      const params = new URLSearchParams(newQuery) // this turns to a string like brand=nvidia&vramType=GDDR6
      // fetch data with the new query params
      const response = await axios.get(`/api/gpus?${params.toString()}`)
      gpus.value = response.data.gpus
      totalPages.value = response.data.totalPages
      totalGpus.value = response.data.totalGpus

      const { data } = await axios.get('/api/gpus/filter-options')
      filters.value = data
    } catch (err) {
      if (err.response && err.response.status === 404) {
        error.value = 'No GPUs Match Your Selection'
        totalGpus.value = 0
      } else {
        error.value = 'Failed to fetch GPUs. Please Try Again later.'
      }
      console.error(err)
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
    <GpuFilter
      v-show="showFilters"
      :filters="filters"
      :selectedFilters="selectedFilters"
      @filters-changed="updateFilters"
      @reset-filter="resetFilters"
    />

    <div class="collection-container">
      <div class="title-collection d-flex flex-row align-items-center" style="gap: 10px">
        <Gpu :size="35" />
        <h1>GPU Collection</h1>
      </div>

      <p v-if="totalGpus > 0">Current List: ({{ totalGpus }} GPUs)</p>

      <div v-if="loading" class="loading-message">Loading GPUs...</div>

      <div v-if="error" class="error-message">
        {{ error }}
        Reset Filters !
      </div>

      <!-- if loading is completed and there is no error add GPU Card -->
      <div v-if="!loading && !error">
        <div v-if="gpus.length > 0" class="d-flex flex-wrap flex-row gap-5 m-3 align-items-center">
          <GpuVerticalCard v-for="gpu in gpus" :key="gpu._id" :gpu="gpu" />
        </div>
        <div v-else class="no-results">
          <p>No GPUs found matching your criteria.</p>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="!loading && totalPages > 1"
        class="pagination-controls d-flex justify-content-center"
      >
        <button
          @click="previousPage"
          :disabled="currentPage <= 1"
          :class="{ active: currentPage > 1 }"
          class="btn-box-left p-2"
        >
          <ArrowBigLeft />
        </button>
        <span class="p-2 fw-bold">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="btn-box-right p-2"
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          :class="{ active: currentPage <= totalPages }"
        >
          <ArrowBigRight />
        </button>
      </div>
    </div>
  </div>
</template>
