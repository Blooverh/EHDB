<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import '../assets/css/hardwareCollection.css'
import ServerFilterBox from '@/components/ServerFilterBox.vue'
import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next'
import ServerVerticalCard from '@/components/serverVerticalCard.vue'

// --- Router and Route instances ---
const router = useRouter()
const route = useRoute()

// --- Template Refs ---
const filterBoxRef = ref(null)

// --- State Management ---
const servers = ref([])
// current page is now a computed property derived from the URL
const currentPage = computed(() => parseInt(route.query.page) || 1)
const totalPages = ref(0)
const totalServers = ref(0)
const loading = ref(true)
const error = ref(false)

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

// pagination function for next page and previous page
const nextPage = () => {
  // if current page is less than total page based on query we allow next page navigation
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const previousPage = () => {
  //if current page is more than 1
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// --- Error Handling ---
const handleErrorReset = () => {
  if (filterBoxRef.value) {
    filterBoxRef.value.resetFilter()
  }
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

    try {
      const params = new URLSearchParams(newQuery) // this turns to a string like brand=dell&socket=am5
      // fetch data with the new query params
      const response = await axios.get(`/api/servers?${params.toString()}`)
      servers.value = response.data.servers
      totalPages.value = response.data.totalPages
      totalServers.value = response.data.totalServers
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
    <ServerFilterBox ref="filterBoxRef" />

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
        <h1>Server Collection</h1>
      </div>

      <p v-if="totalServers > 0">Current List: ({{ totalServers }} Servers)</p>

      <div v-if="loading" class="loading-message">Loading Servers</div>

      <div v-if="error" class="error-message">
        {{ error }}
        <button @click="handleErrorReset" class="btn btn-primary mt-2">Clear Filters</button>
      </div>

      <!-- if loading is completed and there is no error add Server Card -->
      <div v-if="!loading && !error">
        <div
          v-if="servers.length > 0"
          class="d-flex flex-wrap flex-row gap-5 m-3 algin-items-center"
        >
          <ServerVerticalCard v-for="server in servers" :key="server._id" :server="server" />
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
