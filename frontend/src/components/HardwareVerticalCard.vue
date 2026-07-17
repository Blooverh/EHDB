<script setup>
import '../assets/css/verticalCard.css'
import { Cpu, MemoryStickIcon, Gauge, NetworkIcon, Ruler, Zap, Server, Book } from 'lucide-vue-next'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['gpu', 'server'].includes(value),
  },
})

const itemName = `${props.item.brand} ${props.item.model}`
</script>

<template>
  <div class="card d-flex justify-content-between">
    <div class="img-box d-flex justify-content-center">
      <img :src="type === 'gpu' ? item.gpuImage : item.featureImg" :alt="itemName" />
    </div>

    <div class="info-box d-flex flex-column gap-3 p-2">
      <RouterLink
        class="server-title"
        :to="`/${type === 'gpu' ? 'gpus' : 'servers'}/${item.brand.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`"
      >
        {{ item.brand }} {{ item.model }}
      </RouterLink>

      <div class="container">
        <div class="row">
          <template v-if="type === 'gpu'">
            <div class="col">
              <div class="icon-spec">
                <Zap class="icon-color" />
                <span class="spec">{{ item.brand }}</span>
              </div>
              <div class="icon-spec">
                <MemoryStickIcon class="icon-color" />
                <span class="spec">{{ item.vram }} GB {{ item.vramType }}</span>
              </div>
              <div class="icon-spec">
                <Gauge class="icon-color" />
                <span class="spec">{{ item.coreClock }} / {{ item.boostClock }} MHz</span>
              </div>
            </div>
            <div class="col">
              <div class="icon-spec">
                <NetworkIcon class="icon-color" />
                <span class="spec">{{ item.pcieInterface }}</span>
              </div>
              <div class="icon-spec">
                <Ruler class="icon-color" />
                <span class="spec">{{ item.slotWidth }}</span>
              </div>
              <div class="icon-spec">
                <Cpu class="icon-color" />
                <span class="spec" v-if="item.cudaCores"
                  >{{ item.cudaCores.toLocaleString() }} CUDA</span
                >
                <span class="spec" v-else>{{ item.power }}W</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="col">
              <div class="icon-spec">
                <Server class="icon-color" />
                <span class="spec">{{ item.brand }}</span>
              </div>
              <div class="icon-spec">
                <NetworkIcon class="icon-color" />
                <span class="spec">{{ item.socketInfo }}</span>
              </div>
              <div class="icon-spec">
                <Ruler class="icon-color" />
                <span class="spec">{{ item.serverType }}</span>
              </div>
            </div>
            <div class="col">
              <div class="icon-spec">
                <Cpu class="icon-color" />
                <span class="spec">
                  {{ item.compatibleCpuGen.length }} CPU
                  {{ item.compatibleCpuGen.length > 1 ? 'Generations' : 'Generation' }}
                </span>
              </div>
              <div class="icon-spec">
                <MemoryStickIcon class="icon-color" />
                <span class="spec">{{ item.motherboardType }}</span>
              </div>
              <div class="icon-spec">
                <Book class="icon-color" />
                <span class="spec"><a :href="item.techSpecs">Specs Guide</a></span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <RouterLink
      class="server-link"
      :to="`/${type === 'gpu' ? 'gpus' : 'servers'}/${item.brand.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`"
    >
      {{ type === 'gpu' ? 'View GPU Details' : 'View Server Details' }}
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
