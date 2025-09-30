<script setup>
import { ref, onMounted, Transition } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

// State for toggling the brand filter visibility
const isBrandFilterVisible = ref(false);
const isGenFilterVisible = ref(false);
const isCoreFilterVisible = ref(false);
const isCodenameFilterVisible = ref(false);
const isRatedSpeedsFilterVisible = ref(false);
const isMemSupportFilterVisible = ref(false);
const isSocketFilterAvailable = ref(false);
const isThreadFilterAvailable = ref(false);
const isCacheFilterAvailable = ref(false);

const route = useRoute();
const router = useRouter()

const filters = ref({
  brands: [],
  codename: [],
  generation: [],
  memorySupport: [],
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
  ratedSpeeds: [].concat(parseInt(route.query.ratedSpeeds) || []),
  socket: [].concat(route.query.socket || []),
  coreNum: [].concat(parseInt(route.query.coreNum) || []),
  threadNum: [].concat(parseInt(route.query.threadNum) || []),
  cache: [].concat(route.query.cache || [])
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
      const queryKey = key === 'cache' ? 'cache.cacheL3' : key;
      // If the filter has a value, add it to the query.
      if (value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
        query[queryKey] = value;
      } else {
        // Otherwise, remove it from the query.
        delete query[queryKey];
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

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Socket</p>
          <button type="button" class="toggle-btn" @click="isSocketFilterAvailable = !isSocketFilterAvailable">
            {{ isSocketFilterAvailable ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isSocketFilterAvailable" class="option-box">
            <div class="input-option" v-for="socket in filters.socket" :key="socket">
              <input type="checkbox" :id="socket" :value="socket" v-model="selectedFilters.socket" @change="updateFilters">
              <label :for="socket" class="ml-2">{{ socket }}</label>
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
          <p class="fw-bold filter-tl">Code Name</p>
          <button type="button" class="toggle-btn" @click="isCodenameFilterVisible = !isCodenameFilterVisible">{{ isCodenameFilterVisible ? 'Hide' : "Show" }}</button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isCodenameFilterVisible">
            <div class="input-option" v-for="codename in filters.codename" :key="codename">
              <input type="checkbox" name="codename" :id="codename" :value="codename" v-model="selectedFilters.codename" @change="updateFilters">
              <label :for="codename" class="ml-2">{{ codename }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Memory Types</p>
          <button type="button" class="toggle-btn" @click="isMemSupportFilterVisible = !isMemSupportFilterVisible">{{ isMemSupportFilterVisible ? 'Hide' : "Show" }}</button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isMemSupportFilterVisible">
            <div class="input-option" v-for="memory in filters.memorySupport" :key="memory">
              <input type="checkbox" name="memory" :id="memory" :value="memory" v-model="selectedFilters.memorySupport" @change="updateFilters">
              <label :for="memory" class="ml-2">{{ memory }}</label>
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

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Threads</p>
          <button type="button" class="toggle-btn" @click="isThreadFilterAvailable = !isThreadFilterAvailable">
            {{ isThreadFilterAvailable ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div class="option-box" v-if="isThreadFilterAvailable">
            <div class="input-option" v-for="threadNum in filters.threadNum" :key="threadNum">
              <input type="checkbox" name="cores" :id="threadNum" :value="threadNum" v-model="selectedFilters.threadNum" @change="updateFilters">
              <label :for="threadNum" class="ml-2">{{ threadNum }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Memory Speeds</p>
          <button type="button" class="toggle-btn" @click="isRatedSpeedsFilterVisible = !isRatedSpeedsFilterVisible">{{ isRatedSpeedsFilterVisible ? 'Hide' : "Show" }}</button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isRatedSpeedsFilterVisible">
            <div class="input-option" v-for="speed in filters.ratedSpeeds" :key="speed">
              <input type="checkbox" name="speed" :id="speed" :value="speed" v-model="selectedFilters.ratedSpeeds" @change="updateFilters">
              <label :for="speed" class="ml-2">{{ speed }}MT/s</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Cache L3</p>
          <button type="button" class="toggle-btn" @click="isCacheFilterAvailable = !isCacheFilterAvailable">{{ isCacheFilterAvailable ? 'Hide' : "Show" }}</button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isCacheFilterAvailable">
            <div class="input-option" v-for="cache in filters.cache" :key="cache">
              <input type="checkbox" name="speed" :id="cache" :value="cache" v-model="selectedFilters.cache" @change="updateFilters">
              <label :for="cache" class="ml-2">{{ cache }}</label>
            </div>
          </div>
        </Transition>
      </div>
      
    </div>
  </div>
</template>
