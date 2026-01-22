<script setup>
  import { ref, onMounted, watch, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import CpuCard from '@/components/CpuCard.vue';
  import serverCard from '@/components/serverCard.vue';
  import '../assets/css/hardwareCollection.css';

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
      const response = await axios.get(`/api/full-search?q=${searchTerm}`);
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


<template>
  <div class="search-page">
    <h1>Search Results</h1>
    <div class="search-bar-container">
      <div class="search-box">
        <input
          type="text"
          class="search-input"
          placeholder="Search for servers, processors, SSDs etc..."
          v-model="query"
          @keydown.enter="fetchResults(query)"
        />
        <button type="button" class="search-btn" @click="fetchResults(query)">Search</button>
      </div>
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="hasResults" class="results-grid">
      <div v-if="results.cpus && results.cpus.length" class="cpu-results">
        <h2>CPUs</h2>
        <div class="d-grid gap-3 m-3">
          <CpuCard v-for="cpu in results.cpus" :key="cpu._id" :cpu="cpu" />
        </div>
      </div>
      <div v-if="results.servers && results.servers.length" class="server-results">
        <h2>Servers</h2>
        <div class="d-grid gap-3 m-3">
          <serverCard v-for="server in results.servers" :key="server._id" :server="server" />
        </div>
      </div>
    </div>
    <div v-else class="no-results">
      <h2>Looking for "{{ query }}"</h2>
      <p>If no hardware displayed, try another term.</p>
    </div>
  </div>
</template>

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

.search-box {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 25px;
    padding: 5px 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1); /* Subtle shadow for depth */
    width: 500px;
}

.search-input {
  border: none; /* Remove default input border */
  outline: none; /* Remove outline on focus */
  flex-grow: 1; /* Allows input to take available space */
  padding: 10px;
  background-color: transparent;
}

.search-btn {
    background-color: #007bff; /* Primary blue color */
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    cursor: pointer;
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
