<template>
  <div class="search-page">
    <h1>Search Results</h1>
    <div class="search-bar-container">
      <LiveSearchBar />
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="hasResults" class="results-grid">
      <div v-if="results.cpus && results.cpus.length" class="cpu-results">
        <h2>CPUs</h2>
        <div class="card-grid">
          <CpuCard v-for="cpu in results.cpus" :key="cpu._id" :cpu="cpu" />
        </div>
      </div>
      <div v-if="results.servers && results.servers.length" class="server-results">
        <h2>Servers</h2>
        <div class="card-grid">
          <serverCard v-for="server in results.servers" :key="server._id" :server="server" />
        </div>
      </div>
    </div>
    <div v-else class="no-results">
      <h2>No results found for "{{ query }}"</h2>
      <p>Try a different search term.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import LiveSearchBar from '@/components/LiveSearchBar.vue';
import CpuCard from '@/components/CpuCard.vue';
import serverCard from '@/components/serverCard.vue';

const route = useRoute();
const query = ref(route.query.q || '');
const results = ref({ cpus: [], servers: [] });
const isLoading = ref(false);
const error = ref(null);

const fetchResults = async (searchTerm) => {
  if (!searchTerm) {
    results.value = { cpus: [], servers: [] };
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/api/search?q=${searchTerm}`);
    results.value = response.data;
  } catch (err) {
    console.error('Error fetching search results:', err);
    error.value = 'Failed to fetch search results. Please try again later.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchResults(query.value);
});

watch(() => route.query.q, (newQuery) => {
  query.value = newQuery;
  fetchResults(newQuery);
});

const hasResults = computed(() => {
    return (results.value.cpus && results.value.cpus.length > 0) || (results.value.servers && results.value.servers.length > 0)
})
</script>

<style scoped>
.search-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.results-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

h1, h2 {
  text-align: center;
  margin-bottom: 1rem;
}

.loading, .error, .no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 4rem;
}
</style>
