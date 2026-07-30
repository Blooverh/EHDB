<script setup>
import '../../assets/css/individualPageSkeleton.css'
import '../../assets/css/individual-parts.css'
</script>

<template>
  <div>
    <!-- Hero section skeleton -->
    <div class="hero-individualPart container-xl">
      <nav class="breadcrumb-nav">
        <ol class="breadcrumb">
          <li class="skeleton-block skeleton-breadcrumb" />
        </ol>
      </nav>

      <div class="d-flex flex-row gap-4 flex-wrap">
        <div class="skeleton-block skeleton-hero-image" />

        <div class="part-information d-flex flex-column gap-2">
          <div class="skeleton-title-row">
            <div class="skeleton-block skeleton-title-icon" />
            <div class="skeleton-block skeleton-title-text" />
          </div>

          <div class="part-tags d-flex gap-2">
            <span class="skeleton-block skeleton-tag" />
            <span class="skeleton-block skeleton-tag" />
            <span class="skeleton-block skeleton-tag" />
            <span class="skeleton-block skeleton-tag" />
          </div>

          <div class="skeleton-block skeleton-separator" />

          <div class="stats-grid">
            <div class="skeleton-block skeleton-stat" />
            <div class="skeleton-block skeleton-stat" />
            <div class="skeleton-block skeleton-stat" />
            <div class="skeleton-block skeleton-stat" />
          </div>

          <div class="specs-row">
            <div class="skeleton-block skeleton-spec-item" />
            <div class="skeleton-block skeleton-spec-item" />
            <div class="skeleton-block skeleton-spec-item" />
          </div>
        </div>
      </div>
    </div>

    <!-- Where to Buy skeleton -->
    <div class="container d-flex flex-column gap-2 mt-3 mb-3">
      <div class="d-flex flex-row align-items-center gap-2 justify-content-center">
        <div class="skeleton-block" style="width: 30px; height: 30px; border-radius: 6px" />
        <div class="skeleton-block skeleton-section-header" />
      </div>

      <ol class="d-flex flex-row gap-3 p-0 justify-content-start">
        <li v-for="n in 4" :key="n" class="skeleton-block skeleton-buy-card" />
      </ol>
    </div>

    <!-- Price history chart skeleton -->
    <div class="container mb-3">
      <div class="d-flex align-items-center justify-content-center gap-2 mb-3">
        <div class="skeleton-block" style="width: 30px; height: 30px; border-radius: 6px" />
        <div class="skeleton-block skeleton-section-header" />
      </div>
      <div class="skeleton-block skeleton-chart-area" />
    </div>

    <!-- Specs boxes skeleton -->
    <div class="container mb-3 skeleton-specs-box">
      <div class="skeleton-block skeleton-specs-title" />
      <div class="specs-list" style="column-count: 2; column-gap: 1rem">
        <div v-for="n in 8" :key="n" class="skeleton-spec-row">
          <div class="skeleton-block skeleton-spec-label" />
          <div class="skeleton-block skeleton-spec-value" />
        </div>
      </div>
    </div>

    <div class="container mb-3 skeleton-specs-box">
      <div class="skeleton-block skeleton-specs-title" />
      <div class="specs-list" style="column-count: 2; column-gap: 1rem">
        <div v-for="n in 6" :key="n" class="skeleton-spec-row">
          <div class="skeleton-block skeleton-spec-label" />
          <div class="skeleton-block skeleton-spec-value" />
        </div>
      </div>
    </div>
  </div>
</template>
