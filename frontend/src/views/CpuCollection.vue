<script setup>
import '../assets/css/hardwareCollection.css';
import CpuFilterBox from '@/components/CpuFilterBox.vue';
import { ref, reactive, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// --- STATE ---
// Initialize state from the URL query to support deep-linking and browser history.
const currentPage = ref(parseInt(route.query.page) || 1);
const filters = reactive({
    brand: route.query.brand || '',
    codename: route.query.codename || '',
    generation: route.query.generation || '',
    memorySupport: route.query.memorySupport || '',
    ratedSpeeds: route.query.ratedSpeeds ? parseInt(route.query.ratedSpeeds) : null,
    socket: route.query.socket || '',
    coreNum: route.query.coreNum ? parseInt(route.query.coreNum) : null,
    threadNum: route.query.threadNum ? parseInt(route.query.threadNum) : null,
    'cache.cacheL3': route.query['cache.cacheL3'] ? parseInt(route.query['cache.cacheL3']) : null,
});

// --- DATA ---
// Refs to hold data returned from the server.
const cpus = ref([]);
const totalPages = ref(0);
const totalCpus = ref(0);
const loading = ref(true);
const error = ref(null);

// --- ACTIONS ---
// Function to push the component's current state to the URL.
const updateUrl = () => {
    const query = {};
    if (currentPage.value > 1) {
        query.page = currentPage.value;
    }
    for (const key in filters) {
        const value = filters[key];
        if (value !== null && value !== '') {
            query[key] = value;
        }
    }
    router.push({ query });
};

// Pagination actions simply update the reactive state; watchers handle the side effects.
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

// --- WATCHERS (SIDE EFFECTS) ---

// 1. When user input changes the local state (filters or page), update the URL.
watch(filters, () => {
    // When a filter changes, always reset to page 1.
    if (currentPage.value !== 1) {
        currentPage.value = 1;
    } else {
        // If already on page 1, the page watcher won't fire, so trigger update manually.
        updateUrl();
    }
}, { deep: true });

watch(currentPage, updateUrl);

// 2. When the URL changes, fetch new data. This is the single source of truth for API calls.
watch(() => route.query, async (newQuery) => {
    loading.value = true;
    error.value = null;
    try {
        const params = new URLSearchParams(newQuery);
        const response = await axios.get(`/api/cpus?${params.toString()}`);
        cpus.value = response.data.cpus;
        totalPages.value = response.data.totalPages;
        totalCpus.value = response.data.totalCpus;
    } catch (err) {
        error.value = 'Failed to fetch CPUs. Please try again later.';
        console.error(err);
    } finally {
        loading.value = false;
    }
}, { immediate: true, deep: true });

</script>

<template>
    <div class="collection-container">
         <h1>cpu Collection</h1>
         <p>Browse our catalog of enterprise cpus.</p>
    
         <CpuFilterBox />
    
         <!-- Loading and Error State -->
         <div v-if="loading" class="loading-message">Loading cpus...</div>
         <div v-if="error" class="error-message">{{ error }}</div>
    
         <!-- cpu Grid and No Results -->
         <div v-if="!loading && !error">
           <div v-if="cpus.length > 0" class="cpu-grid">
             <!-- cpu Card -->
             <div v-for="cpu in cpus" :key="cpu._id" class="cpu-card">
              <h3 class="cpu-brand">{{ cpu.brand }}</h3>
              <p class="cpu-model">{{ cpu.model }}</p>
              <!-- You can add more cpu details here -->
            </div>
          </div>
          <div v-else class="no-results">
            <p>No cpus found matching your criteria.</p>
          </div>
        </div>
   
        <!-- Pagination Controls -->
        <div v-if="!loading && totalPages > 1" class="pagination-controls">
          <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
        </div>
      </div>
</template>
