<script setup>
import '../assets/css/hardwareCollection.css'
import { cpuBrandFormatter } from '@/utils/formatCpuTitle'
import { Transition, ref } from 'vue'
const props = defineProps({
  filters: {
    type: Object,
    required: true,
    default: {
      brands: [],
      codename: [],
      generation: [],
      socket: [],
      coreNum: [],
      ratedSpeeds: [],
      memorySupport: [],
      cache: [],
    },
  },
  selectedFilters: {
    type: Object,
    required: true,
  },
})

// State for toggling the brand filter visibility
const isBrandFilterVisible = ref(false)
const isGenFilterVisible = ref(false)
const isCoreFilterVisible = ref(false)
const isCodenameFilterVisible = ref(false)
const isRatedSpeedsFilterVisible = ref(false)
const isMemSupportFilterVisible = ref(false)
const isSocketFilterAvailable = ref(false)
const isCacheFilterAvailable = ref(false)

// defining event that this component can emit
const emit = defineEmits(['filters-changed', 'reset-filter'])

// 3. This function is called whenever a user clicks a checkbox
const handleFilterChange = (filterType, value) => {
  // Create a deep copy of the selected filters to avoid mutating the prop directly
  const newFilters = JSON.parse(JSON.stringify(props.selectedFilters))

  // Ensure that array exists
  if (!Array.isArray(newFilters[filterType])) {
    newFilters[filterType] = []
  }

  // Get the specific array of filters (e.g., the 'codename' array)
  const filterArray = newFilters[filterType]
  const index = filterArray.indexOf(value)

  if (index === -1) {
    // If the value isn't in the array, add it
    filterArray.push(value)
  } else {
    // If it is in the array, remove it
    filterArray.splice(index, 1)
  }

  // 4. Emit the 'filters-changed' event with the updated filters object as the payload
  emit('filters-changed', newFilters)
}

const resetFilter = () => {
  emit('reset-filter')
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
          <button
            type="button"
            class="toggle-btn"
            @click="isBrandFilterVisible = !isBrandFilterVisible"
          >
            {{ isBrandFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isBrandFilterVisible" class="option-box">
            <div class="input-option d-flex gap-2" v-for="brand in filters.brands" :key="brand">
              <input
                type="checkbox"
                :id="brand"
                :value="brand"
                :checked="selectedFilters.brand.includes(brand)"
                @change="handleFilterChange('brand', brand)"
              />
              <label :for="brand" class="ml-2">{{ cpuBrandFormatter(brand) }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Socket</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isSocketFilterAvailable = !isSocketFilterAvailable"
          >
            {{ isSocketFilterAvailable ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isSocketFilterAvailable" class="option-box">
            <div class="input-option d-flex gap-2" v-for="socket in filters.socket" :key="socket">
              <input
                type="checkbox"
                :id="socket"
                :value="socket"
                :checked="selectedFilters.socket.includes(socket)"
                @change="handleFilterChange('socket', socket)"
              />
              <label :for="socket" class="ml-2">{{ socket }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 generation-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Generation</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isGenFilterVisible = !isGenFilterVisible"
          >
            {{ isGenFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div class="option-box" v-if="isGenFilterVisible">
            <div
              class="input-option d-flex gap-2"
              v-for="generation in filters.generation"
              :key="generation"
            >
              <input
                type="checkbox"
                name="generation"
                :id="generation"
                :value="generation"
                :checked="selectedFilters.generation.includes(generation)"
                @change="handleFilterChange('generation', generation)"
              />
              <label :for="generation" class="ml-2">{{ generation }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Code Name</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isCodenameFilterVisible = !isCodenameFilterVisible"
          >
            {{ isCodenameFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isCodenameFilterVisible">
            <div
              class="input-option d-flex gap-2"
              v-for="codename in filters.codename"
              :key="codename"
            >
              <input
                type="checkbox"
                name="codename"
                :id="codename"
                :value="codename"
                :checked="selectedFilters.codename.includes(codename)"
                @change="handleFilterChange('codename', codename)"
              />
              <label :for="codename" class="ml-2">{{ codename }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Memory Types</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isMemSupportFilterVisible = !isMemSupportFilterVisible"
          >
            {{ isMemSupportFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isMemSupportFilterVisible">
            <div
              class="input-option d-flex gap-2"
              v-for="memory in filters.memorySupport"
              :key="memory"
            >
              <input
                type="checkbox"
                name="memory"
                :id="memory"
                :value="memory"
                :checked="selectedFilters.memorySupport.includes(memory)"
                @change="handleFilterChange('memorySupport', memory)"
              />
              <label :for="memory" class="ml-2">{{ memory }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Cores</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isCoreFilterVisible = !isCoreFilterVisible"
          >
            {{ isCoreFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div class="option-box" v-if="isCoreFilterVisible">
            <div
              class="input-option d-flex gap-2"
              v-for="coreNum in filters.coreNum"
              :key="coreNum"
            >
              <input
                type="checkbox"
                name="cores"
                :id="coreNum"
                :value="coreNum"
                :checked="selectedFilters.coreNum.includes(coreNum)"
                @change="handleFilterChange('coreNum', coreNum)"
              />
              <label :for="coreNum" class="ml-2">{{ coreNum }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Memory Speeds</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isRatedSpeedsFilterVisible = !isRatedSpeedsFilterVisible"
          >
            {{ isRatedSpeedsFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isRatedSpeedsFilterVisible">
            <div
              class="input-option d-flex gap-2"
              v-for="speed in filters.ratedSpeeds"
              :key="speed"
            >
              <input
                type="checkbox"
                name="speed"
                :id="speed"
                :value="speed"
                :checked="selectedFilters.ratedSpeeds.includes(speed)"
                @change="handleFilterChange('ratedSpeeds', speed)"
              />
              <label :for="speed" class="ml-2">{{ speed }}MT/s</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 core-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Cache L3</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isCacheFilterAvailable = !isCacheFilterAvailable"
          >
            {{ isCacheFilterAvailable ? 'Hide' : 'Show' }}
          </button>
        </div>
        <Transition name="slide-fade">
          <div class="option-box" v-if="isCacheFilterAvailable">
            <div class="input-option d-flex gap-2" v-for="cache in filters.cache" :key="cache">
              <input
                type="checkbox"
                name="speed"
                :id="cache"
                :value="cache"
                :checked="selectedFilters.cache.includes(cache)"
                @change="handleFilterChange('cache', cache)"
              />
              <label :for="cache" class="ml-2">{{ cache }}</label>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
