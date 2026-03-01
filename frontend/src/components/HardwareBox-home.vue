<script setup>
import { ArrowRight, Cpu, Server } from 'lucide-vue-next'

const props = defineProps({
  hardware: Number,
  hardwareType: String,
  subText: String,
  collectionLink: String,
  svgTypeClass: String,
})
</script>

<template>
  <div class="custom-box mb-5">
    <div class="d-flex flex-row justify-content-between flex-wrap">
      <!-- Contains SVG and arrow with link -->
      <div :class="`${svgTypeClass}`">
        <Cpu v-if="hardwareType == 'Processors'" />
        <Server v-else-if="hardwareType == 'Servers'" />
      </div>
      <RouterLink :to="`/${collectionLink}`"><ArrowRight color="gray" /> </RouterLink>
    </div>
    <h4 class="fw-bold">{{ hardwareType }}</h4>
    <p class="sub-text">{{ subText }}</p>
    <div class="d-flex justify-content-between">
      <span class="items">{{ hardware }} items</span>
      <RouterLink :to="`/${collectionLink}`" class="browse-link">Browse</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.custom-box {
  width: 440px;
  background-color: #f3f3f3d0;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 0px 4px 2px #aaaaaad0;
}
.sub-text {
  color: gray;
}

.browse-link {
  color: #007bff;
}

.svg-box-servers {
  background: linear-gradient(to right, #10b981, #0d9488);
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.svg-box-cpu {
  background: linear-gradient(to right, #3b82f6, #4f46e5);
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.svg-box-servers :deep(svg),
.svg-box-cpu :deep(svg) {
  stroke: white;
  stroke-width: 1.5;
}

.lucide-arrow-right:hover {
  stroke: #007bff !important;
}

/* Tablet (max-width: 992px) */
@media (max-width: 992px) {
  .custom-box {
    width: 350px;
    padding: 12px;
  }

  .svg-box-servers,
  .svg-box-cpu {
    width: 45px;
    height: 45px;
  }

  .svg-box-servers :deep(svg),
  .svg-box-cpu :deep(svg) {
    width: 28px;
    height: 28px;
  }

  h4 {
    font-size: 1.1rem;
  }

  .sub-text {
    font-size: 0.9rem;
  }

  .items {
    font-size: 0.85rem;
  }
  .d-flex.flex-row.justify-content-between {
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center;
    gap: 10px;
  }
}

/* Mobile (max-width: 576px) */
@media (max-width: 576px) {
  .custom-box {
    width: 100%;
    max-width: 340px;
    padding: 15px;
    margin-bottom: 15px !important;
  }

  .d-flex.flex-row.justify-content-between {
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center;
    gap: 10px;
  }

  .svg-box-servers,
  .svg-box-cpu {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
  }

  .svg-box-servers :deep(svg),
  .svg-box-cpu :deep(svg) {
    width: 28px;
    height: 28px;
  }

  h4 {
    font-size: 1.15rem;
    margin-bottom: 5px;
  }

  .sub-text {
    font-size: 0.85rem;
    margin-bottom: 10px;
  }

  .d-flex.justify-content-between {
    gap: 10px;
  }

  .items {
    font-size: 0.85rem;
  }

  .browse-link {
    font-size: 0.9rem;
  }
}
</style>
