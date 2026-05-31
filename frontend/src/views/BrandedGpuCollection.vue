<script setup>
import '../assets/css/hardwareCollection.css'
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import GpuVerticalCard from '@/components/gpuVerticalCard.vue'
import BrandedGpuFilterBox from '@/components/BrandedGpuFilterBox.vue'

// Lucide svg import
import { ArrowBigRight, ArrowBigLeft, Gpu } from 'lucide-vue-next'
import { SlidersHorizontal } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// Filter visibility state - hidden by default on mobile
const showFilters = ref(window.innerWidth > 768)

// current page is computed property derived from url
const currentPage = computed(() => parseInt(route.query.page) || 1)

// DATA
//Reactive Objs
const gpus = ref([])
const totalPages = ref(0)
const totalGpus = ref(0)
const loading = ref(true)
const error = ref(false)
const brand_gpu = ref(null)

// reactive objs for filter
const filters = ref({
  vramType: [],
  pcieInterface: [],
  gpuWorkload: [],
  vram: [],
  gpuBrand: [],
})

const selectedFilters = ref({
  vramType: [].concat(route.query.vramType || []),
  pcieInterface: [].concat(route.query.pcieInterface || []),
  gpuWorkload: [].concat(route.query.gpuWorkload || []),
  // Only parse to integer if value exists, otherwise return empty array
  // This prevents [NaN] when URL has no query params (e.g., when resetting filters)
  // parseInt(undefined) returns NaN, and [].concat(NaN) creates [NaN] which breaks checkbox logic
  vram: route.query.vram ? [].concat(parseInt(route.query.vram)) : [],
  gpuBrand: [].concat(route.query.gpuBrand || []),
})

// Actions
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

const toggleFilters = () => {
  showFilters.value = !showFilters.value
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
      vramType: [].concat(newQuery.vramType || []),
      pcieInterface: [].concat(newQuery.pcieInterface || []),
      gpuWorkload: [].concat(newQuery.gpuWorkload || []),
      // Only parse to integer if value exists, otherwise return empty array
      // This prevents [NaN] when URL has no query params (e.g., when resetting filters)
      // parseInt(undefined) returns NaN, and [].concat(NaN) creates [NaN] which breaks checkbox logic
      vram: newQuery.vram ? [].concat(parseInt(newQuery.vram)) : [],
      gpuBrand: [].concat(newQuery.gpuBrand || []),
    }

    try {
      const params = new URLSearchParams(newQuery)
      const gpuBrand = route.params.brand

      // since watcher changes immediate to avoid undefined we check if param exists
      if (!gpuBrand) return

      const response = await axios.get(`/api/gpus/${gpuBrand}?${params.toString()}`)
      gpus.value = response.data.gpus
      totalGpus.value = response.data.totalGpus
      totalPages.value = response.data.totalPages
      brand_gpu.value = gpuBrand

      const { data } = await axios.get(`/api/gpus/${gpuBrand}/filter-options`)
      filters.value = data
    } catch (err) {
      if (err.response && err.response.status === 404) {
        error.value = 'No GPUs match this Brand selection'
        totalGpus.value = 0
      } else {
        error.value = 'Failed to fetch GPUs. Please Try Again'
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
    <button class="filter-toggle" @click="toggleFilters">
      <SlidersHorizontal :size="20" />
      {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
    </button>
    <!-- BrandedGpuFilterBox for brands -->
    <BrandedGpuFilterBox
      v-show="showFilters"
      :filters="filters"
      :selectedFilters="selectedFilters"
      @filters-changed="updateFilters"
      @reset-filter="resetFilters"
    />

    <div class="collection-container">
      <div class="title-collection d-flex flex-row align-items-center" style="gap: 10px">
        <Gpu :size="35" class="gpu-icon" />
        <h1>{{ brand_gpu }} GPU Collection</h1>
      </div>

      <p v-if="totalGpus > 0">Current List of {{ brand_gpu }} GPUs: ({{ totalGpus }})</p>

      <div v-if="loading" class="loading-message">Loading GPUs...</div>

      <div v-if="error" class="error-message">
        {{ error }}
        Reset Filters !
      </div>

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
