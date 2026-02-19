<script setup>
import { cpuBrandFormatter, formatModel } from '@/utils/formatCpuTitle'

const props = defineProps({
  part: {
    type: Object,
    required: true,
  },
  boxTitle: {
    type: String,
  },
  properties: {
    type: Array,
    required: true,
  },
})

const getValue = (key) => {
  const keys = key.split('.')
  let value = props.part
  for (const k of keys) {
    value = value?.[k]
  }

  if (value === null || value === undefined) return 'N/A'

  if (Array.isArray(value)) {
    return value.join(', ') || 'N/A'
  }

  return value
}

const getFormattedValue = (key, value) => {
  if (key === 'brand') {
    return cpuBrandFormatter(value)
  }
  if (key === 'model') {
    return formatModel(value)
  }

  if(key === 'eccMemory'){
    if(value == true){
        value = "True";
    }else {
        value = "False";
    }
  }
  return value
}
</script>

<template>
  <div class="specs-box container mb-3">
    <h3 class="spec-title fw-bold">{{ props.boxTitle }}</h3>
    <div class="specs-list row p-3">
      <div class="col-6 p-1" v-for="prop in properties" :key="prop.key">
        <div class="d-flex flex-column">
          <span class="label-text">{{ prop.label }}</span>
          <span class="fw-bold">{{ getFormattedValue(prop.key, getValue(prop.key)) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
