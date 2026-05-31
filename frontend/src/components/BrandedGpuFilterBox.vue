<script setup>
import '../assets/css/hardwareCollection.css'
import { Transition, ref } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
    default: {
      vram: [],
      vramType: [],
      pcieInterface: [],
      gpuWorkload: [],
      gpuBrand: [],
    },
  },
  selectedFilters: {
    type: Object,
    required: true,
  },
})

// State for toggling each filter section's visibility
const isGpuBrandFilterVisible = ref(false)
const isVramTypeFilterVisible = ref(false)
const isPcieInterfaceFilterVisible = ref(false)
const isWorkloadFilterVisible = ref(false)
const isVramFilterVisible = ref(false)

// defining event that this component can emit
const emit = defineEmits(['filters-changed', 'reset-filter'])

// This function is called whenever a user clicks a checkbox
const handleFilterChange = (filterType, value) => {
  // Create a deep copy of the selected filters to avoid mutating the prop directly
  const newFilters = JSON.parse(JSON.stringify(props.selectedFilters))

  // Ensure that array exists
  if (!Array.isArray(newFilters[filterType])) {
    newFilters[filterType] = []
  }

  // Get the specific array of filters (e.g., the 'vramType' array)
  const filterArray = newFilters[filterType]
  const index = filterArray.indexOf(value)

  if (index === -1) {
    // If the value isn't in the array, add it
    filterArray.push(value)
  } else {
    // If it is in the array, remove it
    filterArray.splice(index, 1)
  }

  // Emit the 'filters-changed' event with the updated filters object as the payload
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

      <!-- GPU Brand Filter (chip maker: NVIDIA, AMD, Intel) -->
      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">GPU Brand</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isGpuBrandFilterVisible = !isGpuBrandFilterVisible"
          >
            {{ isGpuBrandFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isGpuBrandFilterVisible" class="option-box">
            <div
              class="input-option d-flex gap-2"
              v-for="gpuBrand in filters.gpuBrand"
              :key="gpuBrand"
            >
              <input
                type="checkbox"
                :id="'gpu-brand-' + gpuBrand"
                :value="gpuBrand"
                :checked="selectedFilters.gpuBrand?.includes(gpuBrand)"
                @change="handleFilterChange('gpuBrand', gpuBrand)"
              />
              <label :for="'gpu-brand-' + gpuBrand" class="ml-2">{{ gpuBrand }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <!-- VRAM Type Filter -->
      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">VRAM Type</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isVramTypeFilterVisible = !isVramTypeFilterVisible"
          >
            {{ isVramTypeFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isVramTypeFilterVisible" class="option-box">
            <div
              class="input-option d-flex gap-2"
              v-for="vramType in filters.vramType"
              :key="vramType"
            >
              <input
                type="checkbox"
                :id="'vram-type-' + vramType"
                :value="vramType"
                :checked="selectedFilters.vramType?.includes(vramType)"
                @change="handleFilterChange('vramType', vramType)"
              />
              <label :for="'vram-type-' + vramType" class="ml-2">{{ vramType }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <!-- PCIe Interface Filter -->
      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">PCIe Interface</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isPcieInterfaceFilterVisible = !isPcieInterfaceFilterVisible"
          >
            {{ isPcieInterfaceFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isPcieInterfaceFilterVisible" class="option-box">
            <div
              class="input-option d-flex gap-2"
              v-for="pcie in filters.pcieInterface"
              :key="pcie"
            >
              <input
                type="checkbox"
                :id="'pcie-' + pcie"
                :value="pcie"
                :checked="selectedFilters.pcieInterface?.includes(pcie)"
                @change="handleFilterChange('pcieInterface', pcie)"
              />
              <label :for="'pcie-' + pcie" class="ml-2">{{ pcie }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <!-- GPU Workload Filter -->
      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Workload</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isWorkloadFilterVisible = !isWorkloadFilterVisible"
          >
            {{ isWorkloadFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isWorkloadFilterVisible" class="option-box">
            <div
              class="input-option d-flex gap-2"
              v-for="workload in filters.gpuWorkload"
              :key="workload"
            >
              <input
                type="checkbox"
                :id="'workload-' + workload"
                :value="workload"
                :checked="selectedFilters.gpuWorkload?.includes(workload)"
                @change="handleFilterChange('gpuWorkload', workload)"
              />
              <label :for="'workload-' + workload" class="ml-2">{{ workload }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <!-- VRAM Size Filter -->
      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">VRAM Size</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isVramFilterVisible = !isVramFilterVisible"
          >
            {{ isVramFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isVramFilterVisible" class="option-box">
            <div class="input-option d-flex gap-2" v-for="vram in filters.vram" :key="vram">
              <input
                type="checkbox"
                :id="'vram-' + vram"
                :value="vram"
                :checked="selectedFilters.vram?.includes(vram)"
                @change="handleFilterChange('vram', vram)"
              />
              <label :for="'vram-' + vram" class="ml-2">{{ vram }} GB</label>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
