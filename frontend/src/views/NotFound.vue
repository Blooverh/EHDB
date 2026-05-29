<script setup>
import { Search, Database, Home } from 'lucide-vue-next'
</script>

<template>
  <div class="notFound-section d-flex justify-content-center align-items-center">
    <div class="notFoundBox d-flex flex-column mb-2 align-items-center">
      <div class="notFound-header d-flex flex-row gap-2 align-items-center">
        <div class="vector-box">
          <div class="vector p-2">
            <Database :size="35" color="#F8FAFC" />
          </div>
        </div>
        <div class="d-flex flex-column">
          <h2 class="header-title">EHDB</h2>
          <span class="sub-title">Enterprise Hardware Database</span>
        </div>
      </div>
      <div class="notFound-alert d-flex flex-column gap-3 align-items-center mb-2">
        <span class="status-code">404</span>
        <span class="status-msg">Page Not Found</span>
        <span class="status-sub-msg"
          >The hardware part you're looking for does not exist in our Database YET!</span
        >
      </div>
      <div class="d-flex flex-row gap-3 notFound-btns">
        <!-- Create 2 buttons: home page buttons and search page button -->
        <RouterLink
          class="d-flex flex-row justify-content-center align-items-center homebutton gap-2"
          to="/"
        >
          <Home :size="25" color="white" />
          <span>Return Home</span>
        </RouterLink>

        <RouterLink
          class="d-flex flex-row justify-content-center align-items-center search-part gap-2"
          to="/search"
        >
          <Search style="stroke: black" />
          <span>Search Database</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.notFound-section {
  height: 100vh;
}

.notFoundBox {
  width: 600px;
}

.vector {
  background: linear-gradient(to right, cyan, blue);
  border-radius: 8px;
}

.header-title {
  font-size: 30px;
  font-weight: 700;
}

.status-code {
  font-size: 10rem;
}

.status-msg {
  font-size: 3rem;
  font-weight: 700;
}

.status-sub-msg {
  font-size: 1.2rem;
  text-align: center;
  color: rgb(128, 128, 128);
}

.notFoundBtns {
  text-decoration: none;
}

.homebutton {
  background: linear-gradient(to right, cyan, blue);
  padding: 10px;
  border-radius: 8px;
}

.search-part {
  padding: 10px;
  border-radius: 8px;
  background: rgba(160, 160, 160, 0.682);
}

.homebutton > span,
.search-part > span {
  color: white;
  font-size: 1.3em;
  font-weight: 700;
}

.search-part > span {
  color: black;
}

.homebutton:hover,
.search-part:hover {
  text-decoration: none !important;
}

.homebutton:hover {
  background: linear-gradient(to right, rgba(0, 255, 255, 0.434), rgba(0, 0, 255, 0.512));
}

.search-part:hover {
  background: rgba(128, 128, 128, 0.88);
}
</style>
