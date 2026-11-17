<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Collapse, Dropdown } from 'bootstrap'
import { ChevronDown, Search } from 'lucide-vue-next'
import '../assets/css/header.css'

const route = useRoute()
const router = useRouter()

const navCollapse = ref(null)
const scrolled = ref(false)

const hardwareSections = [
  {
    key: 'cpus',
    label: 'Processors',
    path: '/cpus',
    links: [
      { label: 'All processors', to: '/cpus' },
      { label: 'AMD processors', to: '/cpus/amd' },
      { label: 'Intel processors', to: '/cpus/intel' },
    ],
  },
  {
    key: 'servers',
    label: 'Servers',
    path: '/servers',
    links: [
      { label: 'All servers', to: '/servers' },
      { label: 'Dell', to: '/servers/dell' },
      { label: 'HPE', to: '/servers/hpe' },
      { label: 'Supermicro', to: '/servers/supermicro' },
      { label: 'Gigabyte', to: '/servers/gigabyte' },
      { label: 'Asus', to: '/servers/asus' },
      { label: 'Cloud Ninjas', to: '/servers/cloud-ninjas' },
    ],
  },
  {
    key: 'gpus',
    label: 'GPUs',
    path: '/gpus',
    links: [
      { label: 'All GPUs', to: '/gpus' },
      { label: 'NVIDIA', to: '/gpus/nvidia' },
      { label: 'AMD', to: '/gpus/amd' },
      { label: 'Intel', to: '/gpus/intel' },
    ],
  },
]

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)
const isDesktop = () => window.matchMedia('(min-width: 992px)').matches

/* ---------- Sticky shadow on scroll ---------- */
const onScroll = () => {
  scrolled.value = window.scrollY > 8
}

/* ---------- "/" keyboard shortcut for search ---------- */
const onKeydown = (event) => {
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return

  const target = event.target
  const isTyping =
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  if (isTyping) return

  event.preventDefault()
  router.push('/search')
}

/* ---------- Close menus after navigating ---------- */
const closeDropdowns = () => {
  navCollapse.value
    ?.querySelectorAll('.dropdown-toggle[aria-expanded="true"]')
    .forEach((toggle) => Dropdown.getOrCreateInstance(toggle).hide())
}

watch(
  () => route.fullPath,
  () => {
    closeDropdowns()
    if (!isDesktop() && navCollapse.value?.classList.contains('show')) {
      Collapse.getOrCreateInstance(navCollapse.value, { toggle: false }).hide()
    }
  },
)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <nav
    class="site-navbar navbar navbar-expand-lg sticky-top"
    :class="{ 'is-scrolled': scrolled }"
    aria-label="Main navigation"
  >
    <div class="navbar-inner">
      <RouterLink
        class="brand navbar-brand"
        to="/"
        aria-label="EHDB — Enterprise Hardware Database"
      >
        <img
          class="brand-logo"
          src="../assets/images/EHDB-logo.png"
          alt="EHDB logo"
          width="44"
          height="44"
        />
        <span class="brand-wordmark">
          <span class="brand-name">EHDB</span>
          <span class="brand-tagline">Enterprise Hardware Database</span>
        </span>
      </RouterLink>

      <button
        class="nav-toggle navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="nav-toggle-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      <div id="mainNav" ref="navCollapse" class="collapse navbar-collapse">
        <ul class="navbar-nav nav-main">
          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ 'is-active': isActive('/') }" to="/">
              Home
            </RouterLink>
          </li>

          <li v-for="section in hardwareSections" :key="section.key" class="nav-item dropdown">
            <button
              class="nav-link dropdown-toggle"
              :class="{ 'is-active': isActive(section.path) }"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              {{ section.label }}
              <ChevronDown class="nav-chevron" :size="14" aria-hidden="true" />
            </button>

            <ul class="dropdown-menu">
              <li v-for="link in section.links" :key="link.to">
                <RouterLink class="dropdown-item" :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" :class="{ 'is-active': isActive('/about') }" to="/about">
              About
            </RouterLink>
          </li>
        </ul>

        <RouterLink class="search-btn" to="/search" title="Search hardware" aria-keyshortcuts="/">
          <Search :size="16" aria-hidden="true" />
          <span>Search Hardware</span>
          <kbd class="search-kbd" aria-hidden="true">/</kbd>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
