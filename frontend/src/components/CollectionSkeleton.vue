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
const cpuSpecs = ['Cores', 'Threads', 'RAM MT/s', 'Base GHz', 'Boost GHz', 'MPN']
// GPU/Server icon-spec rows (2 columns of 3)
const verticalSpecRows = [0, 1, 2]
</script>

<template>
  <!-- CPU Skeleton: horizontal card layout matching HorizontalCard.vue -->
  <div v-if="type === 'cpu'" class="d-grid gap-3 m-3">
    <div v-for="n in count" :key="n" class="d-flex skeleton-hc-card">
      <!-- Brand sidebar -->
      <div class="skeleton-hc-brand skeleton-block"></div>

      <!-- Content area -->
      <div class="skeleton-hc-content">
        <!-- Title + tags -->
        <div class="skeleton-hc-header">
          <div class="skeleton-block skeleton-hc-title"></div>
          <div class="skeleton-hc-tags">
            <div class="skeleton-block skeleton-hc-tag"></div>
            <div class="skeleton-block skeleton-hc-tag"></div>
            <div class="skeleton-block skeleton-hc-tag"></div>
            <div class="skeleton-block skeleton-hc-tag"></div>
          </div>
        </div>

        <!-- Divider -->
        <div class="skeleton-hc-divider"></div>

        <!-- Spec grid -->
        <div class="skeleton-hc-specs">
          <div v-for="spec in cpuSpecs" :key="spec" class="skeleton-hc-spec">
            <div class="skeleton-block skeleton-hc-spec-value"></div>
            <div class="skeleton-block skeleton-hc-spec-label"></div>
          </div>
        </div>

        <!-- Button -->
        <div class="skeleton-block skeleton-hc-btn"></div>
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
