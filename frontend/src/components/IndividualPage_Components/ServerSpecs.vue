<script setup>
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

  return value
}

const isArrayValue = (key) => {
  const value = getValue(key)
  return Array.isArray(value) && value.length > 0
}

const isLinkProperty = (key) => {
  return key === 'userManual' || key === 'techSpecs'
}
</script>

<template>
  <div class="specs-box container mb-3">
    <h3 class="spec-title fw-bold">{{ props.boxTitle }}</h3>
    <div class="specs-list p-3">
      <div class="spec-item" v-for="prop in properties" :key="prop.key">
        <div class="d-flex flex-column">
          <span class="label-text">{{ prop.label }}</span>
          <!-- if statement for checking whether its an URL property, non array property value, or an array property value -->
          <a
            v-if="isLinkProperty(prop.key)"
            class="fw-bold text-decoration-none"
            :href="getValue(prop.key)"
            target="_blank"
            rel="noopener noreferrer"
          >
            Link
          </a>

          <span class="fw-bold" v-else-if="!isArrayValue(prop.key)">{{ getValue(prop.key) }}</span>

          <ul v-else class="mb-0 ps-1 spec-list">
            <li class="fw-bold" v-for="(item, index) in getValue(prop.key)" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.specs-list {
  column-count: 2;
  column-gap: 1rem;
  list-style: none;
}

.spec-item {
  break-inside: avoid;
}

</style>
