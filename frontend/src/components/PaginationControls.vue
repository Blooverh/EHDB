<script setup>
import { ArrowBigLeft, ArrowBigRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const goPrev = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const goNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-controls d-flex justify-content-center">
    <button
      @click="goPrev"
      :disabled="currentPage <= 1"
      :class="{ active: currentPage > 1 }"
      class="btn-box-left p-2"
    >
      <ArrowBigLeft />
    </button>
    <span class="p-2 fw-bold">Page {{ currentPage }} of {{ totalPages }}</span>
    <button
      @click="goNext"
      :disabled="currentPage >= totalPages"
      :class="{ active: currentPage < totalPages }"
      class="btn-box-right p-2"
    >
      <ArrowBigRight />
    </button>
  </div>
</template>

<style scoped>
/* Base */
.btn-box-left,
.btn-box-right {
  background: none;
  border: none;
}

.active :deep(svg):hover {
  stroke: #007bff;
}

/* Tablet */
@media (max-width: 992px) {
  .pagination-controls {
    flex-wrap: wrap;
    gap: 10px;
  }

  .pagination-controls span {
    font-size: 0.9rem;
    order: -1;
    width: 100%;
    text-align: center;
  }
}

/* Mobile */
@media (max-width: 576px) {
  .pagination-controls {
    padding: 10px 0;
  }

  .btn-box-left,
  .btn-box-right {
    padding: 8px !important;
  }

  .btn-box-left :deep(svg),
  .btn-box-right :deep(svg) {
    width: 24px;
    height: 24px;
  }
}
</style>
