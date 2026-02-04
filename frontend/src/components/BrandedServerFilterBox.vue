<script setup>
import '../assets/css/hardwareCollection.css'
import { Transition, ref } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
    default: {
      socket: [],
      cpuGen: [],
      moboType: [],
      memoryType: [],
      speeds: [],
      ssdInterfaces: [],
    },
  },
  selectedFilters: {
    type: Object,
    required: true,
  },
})

// State for toggling each option
const isSocketFilterVisible = ref(false)
const isCpuGenFilterVisible = ref(false)
const isMotherboardTypeFilterVisible = ref(false)
const isMemoryTypeFilterVisible = ref(false)
const isSpeedsFilterVisible = ref(false)
const isStorageFilterVisible = ref(false)

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

  // Get the specific array of filters
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

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Socket</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isSocketFilterVisible = !isSocketFilterVisible"
          >
            {{ isSocketFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isSocketFilterVisible" class="option-box">
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

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">CPU Generation</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isCpuGenFilterVisible = !isCpuGenFilterVisible"
          >
            {{ isCpuGenFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isCpuGenFilterVisible" class="option-box">
            <div class="input-option d-flex gap-2" v-for="cpuGen in filters.cpuGen" :key="cpuGen">
              <input
                type="checkbox"
                :id="cpuGen"
                :value="cpuGen"
                :checked="selectedFilters.cpuGen.includes(cpuGen)"
                @change="handleFilterChange('cpuGen', cpuGen)"
              />
              <label :for="cpuGen" class="ml-2">{{ cpuGen }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">SSD Interface Compatibility</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isStorageFilterVisible = !isStorageFilterVisible"
          >
            {{ isStorageFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isStorageFilterVisible" class="option-box">
            <div class="input-option d-flex gap-2" v-for="ssd in filters.ssdInterfaces" :key="ssd">
              <input
                type="checkbox"
                :id="ssd"
                :value="ssd"
                :checked="selectedFilters.ssdInterfaces.includes(ssd)"
                @change="handleFilterChange('ssdInterfaces', ssd)"
              />
              <label :for="ssd" class="ml-2">{{ ssd }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Motherboard Memory Type</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isMotherboardTypeFilterVisible = !isMotherboardTypeFilterVisible"
          >
            {{ isMotherboardTypeFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isMotherboardTypeFilterVisible" class="option-box">
            <div class="input-option d-flex gap-2" v-for="mobo in filters.moboType" :key="mobo">
              <input
                type="checkbox"
                :id="mobo"
                :value="mobo"
                :checked="selectedFilters.moboType.includes(mobo)"
                @change="handleFilterChange('moboType', mobo)"
              />
              <label :for="mobo" class="ml-2">{{ mobo }}</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Compatible Memory Speeds</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isSpeedsFilterVisible = !isSpeedsFilterVisible"
          >
            {{ isSpeedsFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isSpeedsFilterVisible" class="option-box">
            <div class="input-option d-flex gap-2" v-for="speed in filters.speeds" :key="speed">
              <input
                type="checkbox"
                :id="speed"
                :value="speed"
                :checked="selectedFilters.speeds.includes(speed)"
                @change="handleFilterChange('speeds', speed)"
              />
              <label :for="speed" class="ml-2">{{ speed }}MT/s</label>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mb-4 brand-box">
        <div class="filter-header">
          <p class="fw-bold filter-tl">Compatible Memory Types</p>
          <button
            type="button"
            class="toggle-btn"
            @click="isMemoryTypeFilterVisible = !isMemoryTypeFilterVisible"
          >
            {{ isMemoryTypeFilterVisible ? 'Hide' : 'Show' }}
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="isMemoryTypeFilterVisible" class="option-box">
            <div
              class="input-option d-flex gap-2"
              v-for="memType in filters.memoryType"
              :key="memType"
            >
              <input
                type="checkbox"
                :id="memType"
                :value="memType"
                :checked="selectedFilters.memoryType.includes(memType)"
                @change="handleFilterChange('memoryType', memType)"
              />
              <label :for="memType" class="ml-2">{{ memType }}</label>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
