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
    brand: route.query.brand || '',
    codename: route.query.codename || '' ,
    generation: route.query.generation || '',
    memorySupport: route.query.memorySupport,
    ratedSpeeds: route.query.ratedSpeeds ? parseInt(route.query.ratedSpeeds): null,
    socket: route.query.socket,
    coreNum: route.query.coreNums ? parseInt(route.query.coreNums) : null,
    threadNum: route.query.threadNums ? parseInt(route.query.threadNums) : null,
    cache: route.query.cache ? parseInt(route.query.cache) : null
});

onMounted( async () => {
    const { data } = await axios.get('/api/cpus/filter-options');
    filters.value = data;
});

function updateFilters() {
    router.push({query: {...selectedFilters.value }});
}

</script>

<template>
<div class="filter-box p-4 border rounded">
    <h3 class="font-bold mb-2">Filters</h3>

    <div class="mb-4">
      <label>Brand:</label>
      <select v-model="selectedFilters.brand" @change="updateFilters">
        <option value="">All</option>
        <option v-for="b in filters.brands" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div class="mb-4">
      <label>Generation:</label>
      <select v-model="selectedFilters.generation" @change="updateFilters">
        <option value="">All</option>
        <option v-for="g in filters.generation" :key="g" :value="g">{{ g }}</option>
      </select>
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