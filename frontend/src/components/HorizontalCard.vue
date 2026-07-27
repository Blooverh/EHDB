<script setup>
import '../assets/css/horizontalCard.css'
import { cpuBrandFormatter, formatModel } from '@/utils/formatCpuTitle'
import { computed } from 'vue'

const props = defineProps({
  cpu: {
    type: Object,
    required: true,
  },
})

const brandGradient = computed(() => {
  switch (props.cpu.brand) {
    case 'amd':
      return 'linear-gradient(to right, #00c9ff, #0047ab)'
    case 'intel':
      return 'linear-gradient(to right, #0071c5, #00a4ef)'
    default:
      return 'linear-gradient(to right, #00c9ff, #0047ab)'
  }
})
</script>

<template>
  <div class="d-flex hc-card">
    <div
      class="d-flex align-items-center justify-content-center hc-card-brand px-3 py-4"
      :style="{ background: brandGradient }"
    >
      <span class="hc-brand-badge">{{ cpuBrandFormatter(cpu.brand) }}</span>
    </div>
    <div class="hc-card-content p-3 p-md-4 flex-grow-1">
      <div class="d-flex flex-column gap-2 mb-3">
        <RouterLink
          class="hc-title text-decoration-none fw-bold"
          :to="`/cpus/${cpu.brand}/${cpu.slug}`"
        >
          {{ cpuBrandFormatter(cpu.brand) }} {{ formatModel(cpu.model) }}
        </RouterLink>
        <div class="d-flex flex-row flex-wrap gap-2">
          <span class="hc-tag">{{ cpu.generation }}</span>
          <span class="hc-tag">{{ cpu.socket }}</span>
          <span class="hc-tag">{{ cpu.tdp }}W</span>
          <span class="hc-tag">{{ cpu.cache.cacheL3 }}</span>
        </div>
      </div>
      <div class="hc-divider mb-3"></div>
      <div class="d-grid hc-spec-grid gap-2 mb-3">
        <div class="d-flex flex-column align-items-center hc-spec-box p-2 rounded">
          <span class="hc-spec-value fw-bold">{{ cpu.coreNum }}C</span>
          <span class="hc-spec-label text-uppercase">Cores</span>
        </div>
        <div class="d-flex flex-column align-items-center hc-spec-box p-2 rounded">
          <span class="hc-spec-value fw-bold">{{ cpu.threadNum }}T</span>
          <span class="hc-spec-label text-uppercase">Threads</span>
        </div>
        <div class="d-flex flex-column align-items-center hc-spec-box p-2 rounded">
          <span class="hc-spec-value fw-bold">{{ cpu.ratedSpeeds }}</span>
          <span class="hc-spec-label text-uppercase">RAM MT/s</span>
        </div>
        <div class="d-flex flex-column align-items-center hc-spec-box p-2 rounded">
          <span class="hc-spec-value fw-bold">{{ cpu.frequency }}</span>
          <span class="hc-spec-label text-uppercase">Base GHz</span>
        </div>
        <div class="d-flex flex-column align-items-center hc-spec-box p-2 rounded">
          <span class="hc-spec-value fw-bold">{{ cpu.turboFrequency }}</span>
          <span class="hc-spec-label text-uppercase">Boost GHz</span>
        </div>
        <div class="d-flex flex-column align-items-center hc-spec-box p-2 rounded">
          <span class="hc-spec-value fw-bold hc-spec-mpn">{{ cpu.partNum }}</span>
          <span class="hc-spec-label text-uppercase">MPN</span>
        </div>
      </div>
      <RouterLink
        class="hc-btn-details d-inline-flex align-items-center gap-2 text-decoration-none fw-semibold"
        :to="`/cpus/${cpu.brand}/${cpu.slug}`"
      >
        View Details
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </RouterLink>
    </div>
  </div>
</template>
