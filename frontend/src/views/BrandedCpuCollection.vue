<script setup>
import '../assets/css/hardwareCollection.css'
import { cpuBrandFormatter } from '@/utils/formatCpuTitle'
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import CpuCard from '@/components/CpuCard.vue'
import brandedCpuFilter from '@/components/brandedCpuFilter.vue'

// Lucide svg import
import { ArrowBigRight, ArrowBigLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

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

      // Update selectedFilters from the URL to ensure consistency
      selectedFilters.value = {
        codename: [].concat(newQuery.codename || []),
        generation: [].concat(newQuery.generation || []),
        memorySupport: [].concat(newQuery.memorySupport || []),
        ratedSpeeds: [].concat(parseInt(newQuery.ratedSpeeds) || []),
        socket: [].concat(newQuery.socket || []),
        coreNum: [].concat(parseInt(newQuery.coreNum) || []),
        // we need to specify cache.cacheL3 on new Query on writing so on reading it also works
        cache: [].concat(newQuery['cache.cacheL3'] || []),
      }

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
    <!-- CpuFilterBox for brands -->
    <brandedCpuFilter
      :filters="filters"
      :selectedFilters="selectedFilters"
      @filters-changed="updateFilters"
      @reset-filter="resetFilters"
    />

    <div class="collection-container">
      <div class="title-collection d-flex flex-row align-items-center">
        <svg
          class="cpu-icon"
          width="50"
          height="50"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2.66675H3.99996C3.26358 2.66675 2.66663 3.2637 2.66663 4.00008V12.0001C2.66663 12.7365 3.26358 13.3334 3.99996 13.3334H12C12.7363 13.3334 13.3333 12.7365 13.3333 12.0001V4.00008C13.3333 3.2637 12.7363 2.66675 12 2.66675Z"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M9.33333 6H6.66667C6.29848 6 6 6.29848 6 6.66667V9.33333C6 9.70152 6.29848 10 6.66667 10H9.33333C9.70152 10 10 9.70152 10 9.33333V6.66667C10 6.29848 9.70152 6 9.33333 6Z"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 1.33325V2.66659"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 13.3333V14.6666"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1.33337 10H2.66671"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1.33337 6H2.66671"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.3334 10H14.6667"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.3334 6H14.6667"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6 1.33325V2.66659"
            stroke="currentColor"
            stroke-width="1.33333"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h1>{{ cpuBrandFormatter(brand_cpu) }} Processor Collection</h1>
      </div>

      <p v-if="totalCpus > 0">
        Current List of {{ cpuBrandFormatter(brand_cpu) }} CPUs: ({{ totalCpus }})
      </p>

      <div v-if="loading" class="loading-message">Loading CPUs...</div>

      <div v-if="error" class="error-message">
        {{ error }}
        <RouterLink :to="`/cpus/${brand_cpu}`">Reset Filter</RouterLink>
      </div>

      <div v-if="!loading && !error">
        <div v-if="cpus.length > 0" class="d-grid gap-3 m-3">
          <CpuCard v-for="cpu in cpus" :key="cpu._id" :cpu="cpu" class="cpu-card p-2" />
        </div>
        <div v-else class="no-results">
          <p>No cpus found matching your criteria.</p>
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
