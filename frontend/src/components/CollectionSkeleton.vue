<script setup>
import '../assets/css/skeleton.css'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['cpu', 'gpu', 'server'].includes(value),
  },
  count: {
    type: Number,
    default: 6,
  },
})

// CPU specs that the skeleton replicates (labels only — values are animated blocks)
const cpuSpecs = ['Cores', 'Threads', 'Max RAM Speed', 'Base Clock', 'Turbo Clock', 'MPN']
// GPU/Server icon-spec rows (2 columns of 3)
const verticalSpecRows = [0, 1, 2]
</script>

<template>
  <!-- CPU Skeleton: full-width cards in a grid, matching CpuCard layout -->
  <div v-if="type === 'cpu'" class="d-grid gap-3 m-3">
    <div v-for="n in count" :key="n" class="skeleton-cpu-card">
      <!-- Title row + tags -->
      <div class="skeleton-cpu-title-row">
        <div class="skeleton-block skeleton-cpu-title"></div>
        <div class="skeleton-cpu-tags">
          <div class="skeleton-block skeleton-cpu-tag"></div>
          <div class="skeleton-block skeleton-cpu-tag"></div>
          <div class="skeleton-block skeleton-cpu-tag"></div>
          <div class="skeleton-block skeleton-cpu-tag"></div>
        </div>
      </div>

      <!-- Separator -->
      <div class="skeleton-cpu-separator"></div>

      <!-- Spec boxes -->
      <div class="skeleton-cpu-specs">
        <div v-for="spec in cpuSpecs" :key="spec" class="skeleton-cpu-spec">
          <div class="skeleton-block skeleton-cpu-spec-label"></div>
          <div class="skeleton-block skeleton-cpu-spec-value"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Vertical Card Skeleton: fixed-width cards in flex-wrap, matching HardwareVerticalCard -->
  <div v-else class="d-flex flex-wrap flex-row gap-5 m-3 align-items-center">
    <div v-for="n in count" :key="n" class="skeleton-vertical-card">
      <!-- Image placeholder -->
      <div class="skeleton-vcard-image">
        <div class="skeleton-vcard-image-block"></div>
      </div>

      <!-- Info section -->
      <div class="skeleton-vcard-info">
        <div class="skeleton-block skeleton-vcard-title"></div>

        <div class="skeleton-vcard-specs">
          <div class="skeleton-vcard-spec-col">
            <div v-for="i in verticalSpecRows" :key="'l-' + i" class="skeleton-vcard-spec-row">
              <div class="skeleton-block skeleton-vcard-icon"></div>
              <div class="skeleton-block skeleton-vcard-spec-text"></div>
            </div>
          </div>
          <div class="skeleton-vcard-spec-col">
            <div v-for="i in verticalSpecRows" :key="'r-' + i" class="skeleton-vcard-spec-row">
              <div class="skeleton-block skeleton-vcard-icon"></div>
              <div class="skeleton-block skeleton-vcard-spec-text"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Link button placeholder -->
      <div class="skeleton-block skeleton-vcard-link"></div>
    </div>
  </div>
</template>
