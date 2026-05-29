<script setup>
import '../assets/css/verticalCard.css'
import { Cpu, MemoryStickIcon, Gauge, NetworkIcon, Ruler, Zap } from 'lucide-vue-next'

// props for GPU information
const props = defineProps({
  gpu: {
    type: Object,
    required: true,
  },
})

const gpuName = `${props.gpu.brand} ${props.gpu.model}`
</script>

<template>
  <div class="card d-flex justify-content-between">
    <div class="img-box d-flex justify-content-center">
      <!-- GPU Image -->
      <img :src="gpu.gpuImage" :alt="gpuName" />
    </div>

    <div class="info-box d-flex flex-column gap-3 p-2">
      <RouterLink
        class="server-title"
        :to="`/gpus/${gpu.brand.toLowerCase().replace(/\s+/g, '-')}/${gpu.slug}`"
      >
        {{ gpu.brand }} {{ gpu.model }}
      </RouterLink>

      <div class="container">
        <div class="row">
          <!-- Col 1 - GPU Brand, VRAM, Core Clocks -->
          <div class="col">
            <div class="icon-spec">
              <Zap class="icon-color" />
              <span class="spec">{{ gpu.gpuBrand }}</span>
            </div>
            <div class="icon-spec">
              <MemoryStickIcon class="icon-color" />
              <span class="spec">{{ gpu.vram }} GB {{ gpu.vramType }}</span>
            </div>
            <div class="icon-spec">
              <Gauge class="icon-color" />
              <span class="spec">{{ gpu.coreClock }} / {{ gpu.boostClock }} MHz</span>
            </div>
          </div>
          <!-- Col 2 - PCIe, Slot Width, CUDA Cores / TDP -->
          <div class="col">
            <div class="icon-spec">
              <NetworkIcon class="icon-color" />
              <span class="spec">{{ gpu.pcieInterface }}</span>
            </div>
            <div class="icon-spec">
              <Ruler class="icon-color" />
              <span class="spec">{{ gpu.slotWidth }}</span>
            </div>
            <div class="icon-spec">
              <Cpu class="icon-color" />
              <span class="spec" v-if="gpu.cudaCores"
                >{{ gpu.cudaCores.toLocaleString() }} CUDA</span
              >
              <span class="spec" v-else>{{ gpu.power }}W</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <RouterLink
      class="server-link"
      :to="`/gpus/${gpu.brand.toLowerCase().replace(/\s+/g, '-')}/${gpu.slug}`"
    >
      View GPU Details
    </RouterLink>
  </div>
</template>

<style scoped>
.server-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
