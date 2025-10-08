<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import '../assets/css/hardwareCollection.css';
import ServerFilterBox from '@/components/ServerFilterBox.vue';

// --- Router and Route instances ---
const router = useRouter();
const route = useRoute();

// --- State Management ---
const servers = ref([]);
const currentPage = ref(1);
const totalPages = ref(0);
const totalServers = ref(0);
const filters = ref({
  brand: '',
  model: '',
  // need to add more filters when server is populated like pricing
});
const loading = ref(true);
const error = ref(null);

// --- Data Fetching ---
const fetchServers = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: 20,
    });

    if (filters.value.brand) {
      params.append('brand', filters.value.brand);
    }

    // more filters based on server schema

    const response = await axios.get(`/api/servers?${params.toString()}`);
    
    servers.value = response.data.servers;
    totalPages.value = response.data.totalPages;
    totalServers.value = response.data.totalDocs;

  } catch (err) {
    error.value = 'Failed to fetch servers. Please try again later.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// --- URL Update Logic ---
const updateUrl = () => {
  const query = {};
  // Only add parameters to the URL if they have a value
  if (currentPage.value > 1) {
    query.page = currentPage.value;
  }
  if (filters.value.brand) {
    query.brand = filters.value.brand;
  }
  if (filters.value.model) {
    query.model = filters.value.model;
  }
  router.push({ query });
};

// --- Pagination Handlers ---
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    updateUrl();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    updateUrl();
  }
};

// --- Reactivity ---
// Watch for user input on filters and update the URL
watch(filters, () => {
  currentPage.value = 1; // Reset page to 1 on any filter change
  updateUrl();
}, { deep: true });

// Watch the URL query and treat it as the source of truth
watch(() => route.query, (newQuery) => {
  // Update component state from the URL
  currentPage.value = parseInt(newQuery.page) || 1;
  filters.value.brand = newQuery.brand || '';
  filters.value.model = newQuery.model || '';
  
  // Fetch data based on the state derived from the URL
  fetchServers();
}, { immediate: true }); // immediate: true ensures it runs on component load

</script>

<template>
  <div class="part-collection">
    <ServerFilterBox />
    <div class="collection-container">
        <div class="title-collection d-flex flex-row align-items-center">
          <!-- Missing Server SVG -->
          <h1>Server Collection</h1>
        </div>

        <p v-if="totalServers > 0">Browse our catalog of Servers ({{ totalServers }} Servers)</p>
  
        <!-- Filter Controls -->
        <div class="filter-controls">
          <input type="text" v-model.lazy="filters.brand" placeholder="Filter by Brand..." class="filter-input" />
          <input type="text" v-model.lazy="filters.model" placeholder="Filter by Model..." class="filter-input" />
        </div>
  
        <!-- Loading and Error State -->
        <div v-if="loading" class="loading-message">Loading servers...</div>
        <div v-if="error" class="error-message">{{ error }}</div>
  
        <!-- Server Grid and No Results -->
        <div v-if="!loading && !error">
          <div v-if="servers.length > 0" class="server-grid">
            <!-- Server Card -->
            <div v-for="server in servers" :key="server._id" class="server-card">
              <h3 class="server-brand">{{ server.brand }}</h3>
              <p class="server-model">{{ server.model }}</p>
              <!-- You can add more server details here -->
            </div>
          </div>
          <div v-else class="no-results">
            <p>No servers found matching your criteria.</p>
          </div>
        </div>
  
      <!-- Pagination Controls -->
      <div v-if="!loading && totalPages > 1" class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
      </div>
    </div>
  </div>
  
</template>