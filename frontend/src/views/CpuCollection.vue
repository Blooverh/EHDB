<script setup>
import '../assets/css/hardwareCollection.css'
import CpuFilterBox from '@/components/CpuFilterBox.vue'
import { cpuBrandFormatter, formatModel } from '@/utils/formatCpuTitle.js'
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

//Lucide svg import
import { ArrowBigRight } from 'lucide-vue-next'
import { ArrowBigLeft } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// --- STATE ---
// The current page is now a computed property derived from the URL.
const currentPage = computed(() => parseInt(route.query.page) || 1)

// --- DATA ---
// Refs to hold data returned from the server.
const cpus = ref([])
const totalPages = ref(0)
const totalCpus = ref(0)
const loading = ref(true)
const error = ref(false)

// Reactive objects for filter
const filters = ref({
  brands: [],
  codename: [],
  generation: [],
  memorySupport: [],
  ratedSpeeds: [],
  socket: [],
  coreNum: [],
  cache: [],
})

const selectedFilters = ref({
  brand: [].concat(route.query.brand || []),
  codename: [].concat(route.query.codename || []),
  generation: [].concat(route.query.generation || []),
  memorySupport: [].concat(route.query.memorySupport || []),
  ratedSpeeds: [].concat(parseInt(route.query.ratedSpeeds) || []),
  socket: [].concat(route.query.socket || []),
  coreNum: [].concat(parseInt(route.query.coreNum) || []),
  cache: [].concat(route.query.cache || []),
})

// --- ACTIONS ---
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

// Pagination actions now directly trigger a route change.
const goToPage = (page) => {
  const query = { ...route.query, page } // query retains query params and page number
  // if page number is less than 1 page query paramater is deleted
  if (page <= 1) {
    delete query.page
  }
  router.push({ query }) // pass query to router
}

// functions that increases and decreases pages and triggers function to change router url
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

// --- WATCHERS ---

// When the URL changes, fetch new data. This is the single source of truth for API calls.
/* 
    First argument is a getter function returning the current route query. 
    The second argument is the callback, which receives the new query whenever it changes. 
    Since `route` is reactive (provided by vue-router), we can watch it to react to changes 
    caused by user interactions (e.g. checking a filter checkbox updates the URL). 

    We use `{ deep: true }` so the watcher also reacts to changes inside the query object, 
    not just when the entire query reference is replaced. 

    By default, watchers are lazy (they only run when the source changes), so we add 
    `immediate: true` to also run the callback once right after the watcher is created.

    We don’t use onMounted() here because we rely on a watch() with the { immediate: true } option. This watcher automatically tracks reactive dependencies, such as the route queries, and runs the callback whenever they change. This ensures that CPUs are fetched not only initially, but also every time the URL changes due to addition, removal, or modification of query parameters.

  */
watch(
  () => route.query,
  async (newQuery) => {
    loading.value = true
    error.value = null

    // Always sync selectedFilters with URL first (outside try-catch)
    selectedFilters.value = {
      brand: [].concat(newQuery.brand || []),
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
      const response = await axios.get(`/api/cpus?${params.toString()}`)
      cpus.value = response.data.cpus
      totalPages.value = response.data.totalPages
      totalCpus.value = response.data.totalCPUs

      const { data } = await axios.get('/api/cpus/filter-options')
      filters.value = data
    } catch (err) {
      // Add different error messages depending on status code given by backend
      if (err.response.status === 404) {
        error.value = 'No CPUs Match Your Selection'
        totalCpus.value = 0
      } else {
        error.value = 'Failed to fetch CPUs. Please try again later.'
      }
      console.error(err.response)
    } finally {
      loading.value = false
    }
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <div class="part-collection">
    <CpuFilterBox
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
        <h1>Processor Collection</h1>
      </div>

      <p v-if="totalCpus > 0">Current List: ({{ totalCpus }} CPUs)</p>

      <div v-if="loading" class="loading-message">Loading cpus...</div>
      <div v-if="error" class="error-message">
        {{ error }}
        <RouterLink to="/cpus">Reset Filter</RouterLink>
      </div>

      <div v-if="!loading && !error">
        <div v-if="cpus.length > 0" class="cpu-grid d-grid gap-3 m-3">
          <!-- cpu Card -->
          <div v-for="cpu in cpus" :key="cpu._id" class="cpu-card p-2">
            <!-- CPU Card -->
            <div class="title-tags d-flex flex-row gap-3 align-items-center mt-2">
              <RouterLink class="cpu-title" :to="`/cpus/${cpu.brand}/${cpu.slug}`"
                >{{ cpuBrandFormatter(cpu.brand) }} {{ formatModel(cpu.model) }}</RouterLink
              >
              <div class="cpu-tags d-flex flex-row justify-content-between gap-2">
                <p class="tag">{{ cpu.generation }}</p>
                <p class="tag">{{ cpu.socket }}</p>
                <p class="tag">{{ cpu.tdp }}W</p>
                <p class="tag">{{ cpu.cache.cacheL3 }}</p>
              </div>
            </div>
            <div class="solid-separation"></div>
            <div class="spec-boxes mt-2 d-flex flex-row justify-content-between gap-2">
              <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Cores</span>
                <span class="spec-info">{{ cpu.coreNum }}C</span>
              </div>
              <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Threads</span>
                <span class="spec-info">{{ cpu.threadNum }}T</span>
              </div>
              <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Max RAM Speed</span>
                <span class="spec-info">{{ cpu.ratedSpeeds }}MT/s</span>
              </div>
              <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Base Clock</span>
                <span class="spec-info">{{ cpu.frequency }}GHz</span>
              </div>
              <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">Turbo Clock</span>
                <span class="spec-info">{{ cpu.turboFrequency }}GHz</span>
              </div>
              <div class="spec-box d-flex flex-column align-items-center">
                <span class="spec-tl">MPN</span>
                <span class="spec-info">{{ cpu.partNum }}</span>
              </div>
            </div>
          </div>
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
