<script setup>
import { ref, onMounted, Transition } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// State for toggling the brand filter visibility
const isBrandFilterVisible = ref(true);
const isGenFilterVisible = ref(true);
const isCoreFilterVisible = ref(true);

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


// we use empty array and we concatenate the values of the queries related to that query property, so we can update filters
const selectedFilters = ref({
  brand: [].concat(route.query.brand || []),
  codename: [].concat(route.query.codename || []),
  generation: [].concat(route.query.generation || []),
  memorySupport: [].concat(route.query.memorySupport || []),
  ratedSpeeds: [].concat(parseInt(route.query.ratedSpeeds || [])),
  socket: [].concat(route.query.socket || []),
  coreNum: [].concat(parseInt(route.query.coreNum) || []),
  threadNum: [].concat(parseInt(route.query.threadNum) || []),
  cache: [].concat(parseInt(route.query.cache) || [])
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

function resetFilter() {
  selectedFilters.value.brand = [];
  selectedFilters.value.codename = [];
  selectedFilters.value.generation = [];
  selectedFilters.value.memorySupport = [];
  selectedFilters.value.ratedSpeeds = [];
  selectedFilters.value.socket = [];
  selectedFilters.value.coreNum = [];
  selectedFilters.value.threadNum = [];
  selectedFilters.value.cache = [];

  updateFilters();
}

</script>

<template>
  <div class="filter">
    <div class="filter-box">
      <div class="filter-head mb-3">
        <h3 class="fw-bold mb-2">Filters</h3>
        <button type="button" class="reset" name="reset-filter" @click="resetFilter">Reset</button>
      </div>

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Brand</p>
          <button type="button" class="toggle-btn" @click="isBrandFilterVisible = !isBrandFilterVisible">
            {{ isBrandFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isBrandFilterVisible" class="option-box">
            <div class="input-option" v-for="brand in filters.brands" :key="brand">
              <input type="checkbox" :id="brand" :value="brand" v-model="selectedFilters.brand" @change="updateFilters">
              <label :for="brand" class="ml-2">{{ brand }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 generation-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Generation</p>
          <button type="button" class="toggle-btn" @click="isGenFilterVisible = !isGenFilterVisible">
            {{ isGenFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div class="option-box" v-if="isGenFilterVisible">
            <div class="input-option" v-for="generation in filters.generation" :key="generation">
              <input type="checkbox" name="generation" :id="generation" :value="generation" v-model="selectedFilters.generation" @change="updateFilters">
              <label :for="generation" class="ml-2">{{ generation }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Cores</p>
          <button type="button" class="toggle-btn" @click="isCoreFilterVisible = !isCoreFilterVisible">
            {{ isCoreFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div class="option-box" v-if="isCoreFilterVisible">
            <div class="input-option" v-for="coreNum in filters.coreNum" :key="coreNum">
              <input type="checkbox" name="cores" :id="coreNum" :value="coreNum" v-model="selectedFilters.coreNum" @change="updateFilters">
              <label :for="coreNum" class="ml-2">{{ coreNum }}</label>
            </div>
          </div>
        </Transition>
      </div>

    </div>
  </div>
</template>
