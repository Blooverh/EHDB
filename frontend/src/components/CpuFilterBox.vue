<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter()

const filters = ref({
    brands: [],
    codenames: [],
    generation: [],
    memorySupports: [],
    ratedSpeeds: [],
    socket: [],
    coreNum: [],
    threadNum: [],
    cache: []
});

const selectedFilters = ref({
    brand: [].concat(route.query.brand || []),
    codename: route.query.codename || '' ,
    generation: [].concat(route.query.generation || []),
    memorySupport: route.query.memorySupport,
    ratedSpeeds: route.query.ratedSpeeds ? parseInt(route.query.ratedSpeeds): null,
    socket: route.query.socket,
    coreNum: route.query.coreNum ? parseInt(route.query.coreNum) : null,
    threadNum: route.query.threadNum ? parseInt(route.query.threadNum) : null,
    cache: route.query.cache ? parseInt(route.query.cache) : null
});

onMounted( async () => {
    const { data } = await axios.get('/api/cpus/filter-options');
    filters.value = data;
});

function updateFilters() {
    const query = { ...route.query };

    // Iterate over all filters managed by this component and update the query object.
    for (const key in selectedFilters.value) {
      const value = selectedFilters.value[key];
      // If the filter has a value, add it to the query.
      if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
          query[key] = value;
      } else {
          // Otherwise, remove it from the query.
          delete query[key];
      }
    }

    // A filter change should always reset the user to the first page of results.
    delete query.page;

    // Push the updated query to the router.
    router.push({ query });
}

</script>

<template>
<div class="filter-box p-4 border rounded">
    <h3 class="font-bold mb-2">Filters</h3>

    <div class="mb-4">
      <label class="font-bold mb-2 block">Brand</label>
      <div class="input-option" v-for="brand in filters.brands" :key="brand">
        <input type="checkbox" :id="brand" :value="brand" v-model="selectedFilters.brand" @change="updateFilters">
        <label :for="brand" class="ml-2">{{ brand }}</label>
      </div>
    </div>

    <div class="mb-4">
      <label class="font-bold mb-2 block">Generation</label>
      <div class="input-option" v-for="generation in filters.generation" :key="generation">
        <input type="checkbox" :id="generation" :value="generation" v-model="selectedFilters.generation" @change="updateFilters">
        <label :for="generation" class="ml-2">{{ generation }}</label>
      </div>
    </div>

    <div>
      <label>Cores:</label>
      <select v-model="selectedFilters.coreNum" @change="updateFilters">
        <option value="">All</option>
        <option v-for="c in filters.coreNum" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>
  </div>
</template>