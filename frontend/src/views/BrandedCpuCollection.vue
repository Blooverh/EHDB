<script setup>
import '../assets/css/hardwareCollection.css'
import { cpuBrandFormatter } from '@/utils/formatCpuTitle'
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import CpuCard from '@/components/CpuCard.vue'
import PaginationControls from '@/components/PaginationControls.vue'
import FilterBox from '@/components/FilterBox.vue'
import CollectionSkeleton from '@/components/CollectionSkeleton.vue'

// Lucide svg import
import { Cpu } from 'lucide-vue-next'
import { SlidersHorizontal } from 'lucide-vue-next'

// Filter section configuration for the unified FilterBox (no brand — already scoped by URL param)
const filterSections = [
  { key: 'codename', label: 'Code Name' },
  { key: 'generation', label: 'Generation' },
  { key: 'socket', label: 'Socket' },
  { key: 'coreNum', label: 'CPU Cores' },
  { key: 'ratedSpeeds', label: 'Memory Speeds', format: (v) => `${v} MT/s` },
  { key: 'memorySupport', label: 'Memory Types' },
  { key: 'cache', label: 'L3 Cache' },
]

const router = useRouter()
const route = useRoute()

// Filter visibility state - hidden by default on mobile
const showFilters = ref(window.innerWidth > 768)

// current page is computed property derived from url
const currentPage = computed(() => parseInt(route.query.page) || 1)

// DATA
//Reactive Objs
const cpus = ref([])
const totalPages = ref(0)
const totalCpus = ref(0)
const loading = ref(true)
const error = ref(false)
const brand_cpu = ref(null)

// reactive objs for filter
const filters = ref({
  codename: [],
  generation: [],
  memorySupport: [],
  ratedSpeeds: [],
  socket: [],
  coreNum: [],
  cache: [],
})

const selectedFilters = ref({
  codename: [].concat(route.query.codename || []),
  generation: [].concat(route.query.generation || []),
  memorySupport: [].concat(route.query.memorySupport || []),
  ratedSpeeds: [].concat(parseInt(route.query.ratedSpeeds) || []),
  socket: [].concat(route.query.socket || []),
  coreNum: [].concat(parseInt(route.query.coreNum) || []),
  cache: [].concat(route.query.cache || []),
})

// Actions
const updateFilters = (newFilters) => {
  const query = { ...route.query }

  // Iterate over the new filters and update the query object
  for (const key in newFilters) {
    const value = newFilters[key]
    const queryKey = key === 'cache' ? 'cache.cacheL3' : key
    // If the filter has a value, add it to the query.
    if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      query[queryKey] = value
    } else {
      // Otherwise, remove it from the query.
      delete query[queryKey]
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
      codename: [].concat(newQuery.codename || []),
      generation: [].concat(newQuery.generation || []),
      memorySupport: [].concat(newQuery.memorySupport || []),
      // Only parse to integer if value exists, otherwise return empty array
      // This prevents [NaN] when URL has no query params (e.g., when resetting filters)
      // parseInt(undefined) returns NaN, and [].concat(NaN) creates [NaN] which breaks checkbox logic
      ratedSpeeds: newQuery.ratedSpeeds ? [].concat(parseInt(newQuery.ratedSpeeds)) : [],
      socket: [].concat(newQuery.socket || []),
      coreNum: newQuery.coreNum ? [].concat(parseInt(newQuery.coreNum)) : [],
      // we need to specify cache.cacheL3 on new Query on writing so on reading it also works
      cache: [].concat(newQuery['cache.cacheL3'] || []),
    }

    try {
      const params = new URLSearchParams(newQuery)
      const cpuBrand = route.params.brand

      // since watcher changes immediate to avoid undefined we check if param exists
      if (!cpuBrand) return

      const response = await axios.get(`/api/cpus/${cpuBrand}?${params.toString()}`)
      cpus.value = response.data.cpus
      totalCpus.value = response.data.totalCpus
      totalPages.value = response.data.totalPages
      brand_cpu.value = cpuBrand

      const { data } = await axios.get(`/api/cpus/${cpuBrand}/filter-options`)
      filters.value = data
    } catch (err) {
      if (err.response && err.response.status === 404) {
        error.value = 'No CPUs match this Brand selection'
        totalCpus.value = 0
      } else {
        error.value = 'Failed to fetch CPUs. Please Try Again'
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
        <Cpu :size="35" class="cpu-icon" />
        <h1>{{ cpuBrandFormatter(brand_cpu) }} Processor Collection</h1>
      </div>

      <p v-if="totalCpus > 0">
        Current List of {{ cpuBrandFormatter(brand_cpu) }} CPUs: ({{ totalCpus }})
      </p>

      <CollectionSkeleton v-if="loading" type="cpu" />

      <div v-if="error" class="error-message">
        {{ error }}
        Reset Filters !
      </div>

      <div v-if="!loading && !error">
        <div v-if="cpus.length > 0" class="d-grid gap-3 m-3">
          <CpuCard v-for="cpu in cpus" :key="cpu._id" :cpu="cpu" class="cpu-card p-2" />
        </div>
        <div v-else class="no-results">
          <p>No cpus found matching your criteria.</p>
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
