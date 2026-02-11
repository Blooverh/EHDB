<script setup>
import '../../assets/css/individual-parts.css'

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { formatModel } from '@/utils/formatCpuTitle'

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
  },
  server: {
    image: 'featureImg',
    prices: 'chassisInfo',
    model: 'model',
    brand: 'brand',
  },
}

// Computed property to normalize data based on type
const displayData = computed(() => {
  const mapping = fieldMappings[props.type]
  const part = props.part

  return {
    image: part[mapping.image],
    prices: part[mapping.prices],
    model: part[mapping.model],
    brand: part[mapping.brand],
  }
})

// alt name for image
let altName = `${displayData.value.brand} ${displayData.value.model}`;

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
  <div class="hero-individualPart container">
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
    <div class="d-flex flex-row gap-2 flex-wrap">
        <div class="part-image">
            <img :src="displayData.image" :alt="altName">
        </div>
    </div>
  </div>
</template>
