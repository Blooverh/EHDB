<script setup>
import { Search } from 'lucide-vue-next';
</script>

<template>
<div class="search-bar">
    <input
      type="text"
      v-model="searchTerm"
      @keyup.enter="performSearch"
      placeholder="Search Part..."
    />
    <button @click="performSearch"><Search color="black"/></button>
  </div>
</template>

<style lang="css" scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  max-width: max-content;
}

.search-bar {
  flex-grow: 1;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.search-bar input {
  background: none !important;
  border: none !important;
}
.search-bar input:focus-visible {
  background: none !important;
  border-radius: 8px;
}

.search-bar button {
  padding: 8px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: inherit;
}

</style>