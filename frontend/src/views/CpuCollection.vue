<script setup>
import '../assets/css/hardwareCollection.css';
import CpuFilterBox from '@/components/CpuFilterBox.vue';
import { ref, watch, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

// --- STATE ---
// The current page is now a computed property derived from the URL.
const currentPage = computed(() => parseInt(route.query.page) || 1);

// --- DATA ---
// Refs to hold data returned from the server.
const cpus = ref([]);
const totalPages = ref(0);
const totalCpus = ref(0);
const loading = ref(true);
const error = ref(null);

// --- ACTIONS ---
// Pagination actions now directly trigger a route change.
const goToPage = (page) => {
    const query = { ...route.query, page }; // query retains query params and page number
    // if page number is less than 1 page query paramater is deleted
    if (page <= 1) {
        delete query.page;
    }
    router.push({ query }); // pass query to router
};

// functions that increases and decreases pages and triggers function to change router url
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        goToPage(currentPage.value + 1);
    }
};
const prevPage = () => {
    if (currentPage.value > 1) {
        goToPage(currentPage.value - 1);
    }
};

// --- WATCHERS (SIDE EFFECTS) ---

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
      // Add different error messages depending on status code given by backend
      if(err.response.status === 404){
        error.value = 'No CPUs Match Your Selection';
      }else {
        error.value = 'Failed to fetch CPUs. Please try again later.';
      }
      console.error(err.response);
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
         <div v-if="error" class="error-message">{{ error }} <RouterLink to='/cpus'>Reset Filter</RouterLink></div>
    
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
