<script setup>
import { Database, Server, Cpu, HardDrive, Search, DollarSign, Package, EthernetPort } from 'lucide-vue-next'
</script>

<template>
  <div class="about-page container-xl py-4">
    <nav class="breadcrumb-nav" aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><RouterLink to="/">Home</RouterLink></li>
        <li class="breadcrumb-item active" aria-current="page">About</li>
      </ol>
    </nav>

    <div class="about-header text-center mb-5">
      <h1 class="fw-bold mb-3">About EHDB</h1>
      <p class="lead text-muted">Enterprise Hardware Database</p>
    </div>

    <div class="row justify-content-center mb-5">
      <div class="col-lg-10">
        <div class="about-intro p-5 rounded-4">
          <div class="intro-accent mb-3"></div>
          <p class="mb-0 fs-5 text-center">
            EHDB is a comprehensive database dedicated to enterprise hardware, providing detailed
            specifications and pricing information for servers and server components. Our goal is to
            help IT professionals, system administrators, and hardware enthusiasts make informed
            decisions when purchasing enterprise equipment.
          </p>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12 text-center mb-4">
        <h2 class="fw-bold">What We Offer</h2>
      </div>

      <div class="col-md-4 mb-3">
        <div class="feature-card h-100 p-4 border rounded-3 text-center">
          <div class="icon-wrapper mb-3">
            <Database :size="48" class="text-primary" />
          </div>
          <h3 class="h5 fw-bold">Comprehensive Data</h3>
          <p class="text-muted mb-0">
            Detailed specifications for servers, processors, and hardware components all in one
            place.
          </p>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="feature-card h-100 p-4 border rounded-3 text-center">
          <div class="icon-wrapper mb-3">
            <DollarSign :size="48" class="text-success" />
          </div>
          <h3 class="h5 fw-bold">Price Tracking</h3>
          <p class="text-muted mb-0">
            Real-time pricing from multiple enterprise hardware vendors to help you find the best
            deals.
          </p>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="feature-card h-100 p-4 border rounded-3 text-center">
          <div class="icon-wrapper mb-3">
            <Search :size="48" class="text-info" />
          </div>
          <h3 class="h5 fw-bold">Easy Comparison</h3>
          <p class="text-muted mb-0">
            Compare specifications and prices across different vendors quickly and easily.
          </p>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-12 text-center mb-4">
        <h2 class="fw-bold">Hardware Categories</h2>
      </div>

      <div class="col-md-6 mb-3">
        <div class="hardware-card h-100 p-4 border rounded-3 d-flex align-items-center gap-3">
          <div class="hardware-icon">
            <Cpu :size="40" class="text-primary" />
          </div>
          <div>
            <h3 class="h5 fw-bold mb-1">Processors</h3>
            <p class="text-muted mb-0">
              CPU specifications including clock speeds, core counts, cache sizes, and memory
              support.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div class="hardware-card h-100 p-4 border rounded-3 d-flex align-items-center gap-3">
          <div class="hardware-icon">
            <Server :size="40" class="text-primary" />
          </div>
          <div>
            <h3 class="h5 fw-bold mb-1">Servers</h3>
            <p class="text-muted mb-0">
              Complete server specifications including form factors, expansion slots, and
              compatibility info.
            </p>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div
          class="hardware-card h-100 p-4 border rounded-3 d-flex align-items-center gap-3 coming-soon"
        >
          <div class="hardware-icon">
            <HardDrive :size="40" />
          </div>
          <div>
            <h3 class="h5 fw-bold mb-1">Storage (SSDs & HDDs)</h3>
            <p class="text-muted mb-0">
              Enterprise-grade solid state drives and hard disk drives specifications.
            </p>
            <span class="badge bg-secondary mt-2">Coming Soon</span>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div
          class="hardware-card h-100 p-4 border rounded-3 d-flex align-items-center gap-3 coming-soon"
        >
          <div class="hardware-icon">
            <Package :size="40" />
          </div>
          <div>
            <h3 class="h5 fw-bold mb-1">Memory (RAM)</h3>
            <p class="text-muted mb-0">
              DDR4, DDR5 memory modules with speed and capacity specifications.
            </p>
            <span class="badge bg-secondary mt-2">Coming Soon</span>
          </div>
        </div>
      </div>

      <div class="col-md-6 mb-3">
        <div
          class="hardware-card h-100 p-4 border rounded-3 d-flex align-items-center gap-3 coming-soon"
        >
          <div class="hardware-icon">
            <EthernetPort :size="40" />
          </div>
          <div>
            <h3 class="h5 fw-bold mb-1">Network Cards</h3>
            <p class="text-muted mb-0">NICs, converged adapters, and networking expansion cards.</p>
            <span class="badge bg-secondary mt-2">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="contact-card p-4 border rounded-3 text-center">
          <h3 class="fw-bold mb-3">Want to Contribute?</h3>
          <p class="text-muted mb-0">
            EHDB is continuously growing. If you're a vendor or have suggestions for improvements,
            we'd love to hear from you. Contact us to learn how you can help make this resource even
            better.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  min-height: 80vh;
}

.breadcrumb-nav {
  --bs-breadcrumb-divider: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='black'/%3E%3C/svg%3E");
}

.breadcrumb {
  background: transparent;
  padding: 0;
  margin-bottom: 30px;
}

.breadcrumb-item a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
}

.breadcrumb-item a:hover {
  color: var(--primary-color);
  opacity: 50%;
  font-weight: bold;
}

.breadcrumb-item.active {
  color: gray;
  font-weight: bold;
}

.feature-card,
.hardware-card,
.contact-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.feature-card:hover,
.hardware-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  display: inline-flex;
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.hardware-icon {
  flex-shrink: 0;
}

.about-intro {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid var(--primary-color);
}

.intro-accent {
  width: 60px;
  height: 4px;
  background: var(--primary-color);
  margin: 0 auto;
  border-radius: 2px;
}

.coming-soon {
  opacity: 0.7;
  background: #fafafa;
}

.coming-soon:hover {
  transform: none;
  box-shadow: none;
}
</style>
