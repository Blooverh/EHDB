<script setup>
import '../assets/css/filterBox.css'
import { ref, computed } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  selectedFilters: {
    type: Object,
    required: true,
  },
  sections: {
    type: Array,
    required: true,
    /** @type {{ key: string, label: string, dataKey?: string, format?: (v: any) => string }[]} */
  },
})

const emit = defineEmits(['filters-changed', 'reset-filter'])

// Resolve the options array for a section — supports `dataKey` override for when
// the API returns data under a different key than the selectedFilters/query key
const getOptions = (section) => {
  return props.filters[section.dataKey || section.key]
}

// Track visibility per section — all start collapsed
const visibleSections = ref({})

const toggleSection = (key) => {
  visibleSections.value[key] = !visibleSections.value[key]
}

const isVisible = (key) => visibleSections.value[key] === true

const handleFilterChange = (filterType, value) => {
  const newFilters = JSON.parse(JSON.stringify(props.selectedFilters))
  if (!Array.isArray(newFilters[filterType])) {
    newFilters[filterType] = []
  }
  const filterArray = newFilters[filterType]
  const index = filterArray.indexOf(value)
  if (index === -1) {
    filterArray.push(value)
  } else {
    filterArray.splice(index, 1)
  }
  emit('filters-changed', newFilters)
}

const resetFilter = () => {
  emit('reset-filter')
}

const activeCount = computed(() => {
  let count = 0
  for (const key in props.selectedFilters) {
    const val = props.selectedFilters[key]
    if (Array.isArray(val) && val.length > 0) {
      count += val.length
    }
  }
  return count
})
</script>

<template>
  <div class="filter-panel">
    <div class="filter-panel-box">
      <!-- Header -->
      <div class="filter-panel-head">
        <div class="filter-panel-head-left">
          <h3 class="filter-panel-title">Filters</h3>
          <span v-if="activeCount > 0" class="filter-panel-badge">{{ activeCount }}</span>
        </div>
        <button
          type="button"
          class="filter-panel-reset"
          :disabled="activeCount === 0"
          @click="resetFilter"
        >
          Reset All
        </button>
      </div>

      <!-- Sections -->
      <div v-for="section in sections" :key="section.key" class="filter-group">
        <button type="button" class="filter-group-header" @click="toggleSection(section.key)">
          <span class="filter-group-label">{{ section.label }}</span>
          <ChevronDown
            :size="16"
            class="filter-group-chevron"
            :class="{ rotated: isVisible(section.key) }"
          />
        </button>

        <Transition name="collapse">
          <div v-if="isVisible(section.key)" class="filter-group-body">
            <!-- Options -->
            <div v-for="option in getOptions(section)" :key="option" class="filter-option">
              <label class="filter-option-label">
                <input
                  type="checkbox"
                  :checked="selectedFilters[section.key]?.includes(option)"
                  @change="handleFilterChange(section.key, option)"
                />
                <span class="filter-option-text">
                  {{ section.format ? section.format(option) : option }}
                </span>
              </label>
            </div>

            <!-- Empty state -->
            <div
              v-if="!getOptions(section) || getOptions(section).length === 0"
              class="filter-group-empty"
            >
              No options available
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
