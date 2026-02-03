<script setup>
  import { ref, watch, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import CpuCard from '@/components/CpuCard.vue';
  import serverVerticalCard from '@/components/serverVerticalCard.vue';
  import '../assets/css/hardwareCollection.css';
  import { ArrowBigRight, ArrowBigLeft } from 'lucide-vue-next';
import ServerVerticalCard from '@/components/serverVerticalCard.vue';

  const route = useRoute();
  const router = useRouter();
  const query = ref('');
  const results = ref({ cpus: [], servers: [] });
  const isLoading = ref(false);
  const error = ref(null);
  const totalPages = ref(0);
  const currentPage = ref(1);

  const fetchResults = async (searchTerm, page = 1) => {
    if (!searchTerm) {
      results.value = { cpus: [], servers: [] };
      totalPages.value = 0;
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const response = await axios.get(`/api/full-search?q=${searchTerm}&page=${page}`);
      results.value = response.data.results;
      totalPages.value = response.data.totalPages;
      currentPage.value = response.data.currentPage;
    } catch (err) {
      console.error('Error fetching search results:', err);
      error.value = 'Failed to fetch search results. Please try again later.';
    } finally {
      isLoading.value = false;
    }
  };

  watch(() => route.query, (newQuery) => {
    query.value = newQuery.q || '';
    const page = parseInt(newQuery.page || '1', 10);
    fetchResults(query.value, page);
  }, { immediate: true });

  const hasResults = computed(() => {
      return (results.value.cpus && results.value.cpus.length > 0) || (results.value.servers && results.value.servers.length > 0)
  })

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        router.push({ query: { ...route.query, page } });
    }
  };

  const newSearch = () => {
      if (query.value) {
        router.push({ query: { q: query.value, page: 1 } });
      }
  };

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
          @keydown.enter="newSearch"
        />
        <button type="button" class="search-btn" @click="newSearch">Search</button>
      </div>
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="hasResults" class="results-grid">
      <div v-if="results.cpus && results.cpus.length" class="cpu-results">
        <h2>CPUs</h2>
        <div class="d-grid gap-3 m-3">
          <CpuCard class="cpu-card p-2" v-for="cpu in results.cpus" :key="cpu._id" :cpu="cpu" />
        </div>
      </div>
      <div v-if="results.servers && results.servers.length" class="server-results">
        <h2>Servers</h2>
        <div class="d-flex flex-wrap flex-row  gap-5 m-3 algin-items-center justify-content-center">
          <ServerVerticalCard v-for="server in results.servers" :key="server._id" :server="server" />
        </div>
      </div>
    </div>
    <div v-else class="no-results">
      <h2>Looking for "{{ query }}"</h2>
      <p>If no hardware displayed, try another term.</p>
    </div>
    <div v-if="totalPages > 1" class="pagination-controls d-flex justify-content-center">
        <button class="p-2 btn-box-left" :class="{'active': currentPage > 1}" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"><ArrowBigLeft /></button>
        <span class="p-2 fw-bold">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="p-2 btn-box-right" :class="{'active': currentPage <= totalPages}" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"><ArrowBigRight /></button>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: 2rem;
  max-width: 90%;
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

.server-results > h2, .cpu-results > h2 {
  font-weight: bold;
  color: #007bff;
  font-size: 40px;
}

.loading, .error, .no-results {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin-top: 4rem;
}

</style>
