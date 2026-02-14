<script setup>
import '../../assets/css/individual-parts.css'

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatModel, cpuBrandFormatter } from '@/utils/formatCpuTitle'
import { Cpu, Server } from 'lucide-vue-next';

const route = useRoute()

const props = defineProps({
  part: {
    type: Object,
    required: true,
  },
  type: {
    // ensuring only valid parts are passed, ensuring bug prevention
    type: String,
    required: true,
    validator: (value) => ['cpu', 'server'].includes(value),
  },
})

// Field mappings for each hardware type to handle different property names
const fieldMappings = {
  cpu: {
    image: 'featureImg',
    prices: 'info',
    model: 'model',
    brand: 'brand',
    tag1: 'generation',
    tag2: 'socket',
    tag3: ['cache', 'cacheL3'],
    tag4: 'processSize',
    info1: 'coreNum', 
    info2: 'threadNum',
    info3: 'frequency',
    info4: 'turboFrequency', 
  },
  server: {
    image: 'featureImg',
    prices: 'chassisInfo',
    model: 'model',
    brand: 'brand',
    tag1: 'brand',
    tag2: 'motherboardType',
    tag3: ['serverType'],
    tag4: 'socketInfo',
    info1: 'ssdInterfaces',
    info2: 'nicInterfaces',
    info3: 'compatibleRaids',
    info4: 'compatibleCpuGen'
  },
}

// Computed property to normalize data based on type
const displayData = computed(() => {
  const mapping = fieldMappings[props.type]
  const part = props.part

  return {
    type: props.type,
    image: part[mapping.image],
    prices: part[mapping.prices],
    model: part[mapping.model],
    brand: part[mapping.brand],
    tag1: part[mapping.tag1],
    tag2: part[mapping.tag2],
    tag3: mapping.tag3.reduce((obj, key) => obj?.[key], part),
    tag4: part[mapping.tag4],
    info1: part[mapping.info1],
    info2: part[mapping.info2],
    info3: part[mapping.info3],
    info4: part[mapping.info4]
  }
})

// alt name for image
let altName = `${displayData.value.brand} ${displayData.value.model}`;

// computed property for labels and elements of the page that change depending on the prop type (cpu, server, ssd, etc...)
const statLabels = {
    cpu: {
        info1: {
            label: 'Cores',
            result: displayData.value.info1
        },
        info2: {
            label: 'Threads',
            result: displayData.value.info2
        },
        info3: {
            label: 'Clock Speeds',
            result: `${displayData.value.info3}GHz`
        },
        info4: {
            label: 'Turbo Clock Speeds',
            result: `${displayData.value.info4}GHz`
        },
    },
    server: {
        info1: {
            label: '# SSD Interfaces',
            result: displayData.value.info1.length
        },
        info2: {
            label: '# Network Interfaces',
            result: displayData.value.info2.length
        },
        info3: {
            label: '# Compatible RAIDs',
            result: displayData.value.info3.length
        },
        info4: {
            label: 'Compatible CPU Generations',
            result: displayData.value.info4.length
        }
    }
}

const currentLabels = computed(() => statLabels[displayData.value.type]);

// breadcrumb
// Computed property
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean) // Boolean is used to remove empty strings

  // we map each path element in paths, and build a fullpath, and assign to that map key label with value
  // and path key with value of the path
  return paths.map((path, index) => {
    const fullPath = '/' + paths.slice(0, index + 1).join('/')
    let moddedLabel = ''

    if (index === paths.length - 1) {
      // Last item - use the model name from the part data
      // Format model name if it's a CPU
      if (props.type === 'cpu') {
        moddedLabel = formatModel(displayData.value.model)
      } else {
        moddedLabel = displayData.value.model
      }
    } else if (path === 'cpus') {
      moddedLabel = 'CPUs'
    } else if (path === 'servers') {
      moddedLabel = 'Servers'
    } else {
      moddedLabel = path.charAt(0).toUpperCase() + path.slice(1)
    }
    return {
      label: moddedLabel,
      path: fullPath,
    }
  })
})
</script>

<template>
  <div class="hero-individualPart container-xl">
    <nav class="breadcrumb-nav" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><RouterLink to="/">Home</RouterLink></li>
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ active: index === breadcrumbs.length - 1 }"
          :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
        >
          <RouterLink v-if="index !== breadcrumbs.length - 1" :to="crumb.path">
            {{ crumb.label }}
          </RouterLink>
          <span v-else>{{ crumb.label }}</span>
        </li>
      </ol>
    </nav>

    <!-- Hero main info section -->
    <div class="d-flex flex-row gap-4 flex-wrap">
      <div class="part-image">
        <img :src="displayData.image" :alt="altName" />
      </div>
      <div class="part-information d-flex flex-column gap-2">
        <div class="d-flex flex-row gap-2 align-items-center">
            <!-- Need to change the svg based on the type of hardware -->
          <div></div>
          <h1>{{ cpuBrandFormatter(displayData.brand) }} {{ formatModel(displayData.model) }}</h1>
        </div>

        <div class="part-tags d-flex gap-2">
          <span class="tag-indi rounded-pill">{{ displayData.tag1 }}</span>
          <span class="tag-indi rounded-pill">{{ displayData.tag2 }}</span>
          <span class="tag-indi rounded-pill">{{ displayData.tag3 }}</span>
          <span class="tag-indi rounded-pill">{{ displayData.tag4 }}</span>
        </div>

        <div class="solid-separation"></div>

        <!-- Stats Section -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">{{ currentLabels.info1.label }}</div>
            <div class="stat-value">{{ currentLabels.info1.result }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ currentLabels.info2.label }}</div>
            <div class="stat-value">{{ currentLabels.info2.result }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ currentLabels.info3.label }}</div>
            <div class="stat-value">{{ currentLabels.info3.result }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">{{ currentLabels.info4.label }}</div>
            <div class="stat-value">{{ currentLabels.info4.result }}</div>
          </div>
        </div>

        <!-- Specs Row
        <div class="specs-row">
          <div class="spec-item">
            <span class="spec-label">Base Clock:</span>
            <span class="spec-value">{{ part.clock?.baseClock }} GHz</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Memory:</span>
            <span class="spec-value">{{ part.memory?.supportedMemory }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Max RAM:</span>
            <span class="spec-value">{{ part.memory?.maxMemory }} GB</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Released:</span>
            <span class="spec-value">{{ part.releaseDate }}</span>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
