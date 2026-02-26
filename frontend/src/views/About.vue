<script setup>
  import { Database, Server, Cpu, HardDrive, Search, DollarSign, Package, EthernetPort, Gpu } from 'lucide-vue-next';
  import '../assets/css/about.css';
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
            <strong>EHDB</strong> is a comprehensive database dedicated to enterprise hardware, providing detailed
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
            Detailed specifications for servers, processors, and most hardware components all in one
            place. If you have a infrastrucuture or a homelab we provide the specs for your study.
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
            deals. Every week we check vendors pricing to show you. We track all prices over a period of time (Coming Soon...)
          </p>
        </div>
      </div>

      <div class="col-md-4 mb-3">
        <div class="feature-card h-100 p-4 border rounded-3 text-center">
          <div class="icon-wrapper mb-3">
            <Search :size="48" class="text-primary" />
          </div>
          <h3 class="h5 fw-bold">Easy Comparison</h3>
          <p class="text-muted mb-0">
            Compare prices across different vendors quickly and check where you can get the best prices, we try our best to include all vendors that offer each component.
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

      <div class="col-md-6 mb-3">
        <div
          class="hardware-card h-100 p-4 border rounded-3 d-flex align-items-center gap-3 coming-soon"
        >
          <div class="hardware-icon">
            <Gpu :size="40" />
          </div>
          <div>
            <h3 class="h5 fw-bold mb-1">GPUs</h3>
            <p class="text-muted mb-0">GPUs from NVIDIA, AMD and Intel, we have the information.</p>
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
            EHDB is continuously growing. If you have suggestions for improvements,
            We'd love to hear from you. Contact us to learn how you can help make this resource even
            better.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

