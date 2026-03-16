<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  chassisInfo: {
    type: Array,
    required: true,
  },
  selectedWebsite: {
    type: String,
    required: true,
  },
})

const colorPalette = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#06b6d4',
  '#84cc16',
]

const getColor = (chassis, index) => {
  return colorPalette[index % colorPalette.length]
}

const websiteChassis = computed(() => {
  return props.chassisInfo.filter((item) => item.website === props.selectedWebsite)
})

const chartData = computed(() => {
  const datasets = []
  const allLabels = new Set()

  websiteChassis.value.forEach((listing, index) => {
    const chassisName = listing.chassis || `Chassis ${index + 1}`
    const color = getColor(chassisName, index)

    const dataPoints = []

    if (listing.priceHistory && listing.priceHistory.length > 0) {
      const sortedHistory = [...listing.priceHistory].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      )

      sortedHistory.forEach((p) => {
        const date = new Date(p.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        dataPoints.push({ x: date, y: p.oldPrice })
        allLabels.add(date)
      })
    }

    if (listing.currPrice && listing.currPrice > 0) {
      dataPoints.push({ x: 'Current', y: listing.currPrice })
      allLabels.add('Current')
    }

    if (dataPoints.length > 0) {
      datasets.push({
        label: chassisName,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        fill: false,
      })
    }
  })

  const sortedLabels = Array.from(allLabels).sort((a, b) => {
    if (a === 'Current') return 1
    if (b === 'Current') return -1
    return new Date(a) - new Date(b)
  })

  return {
    labels: sortedLabels,
    datasets,
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      title: {
        display: true,
        text: 'Price ($)',
      },
    },
  },
  parsing: {
    xAxisKey: 'x',
    yAxisKey: 'y',
  },
}

const hasData = computed(() => {
  return websiteChassis.value.some(
    (listing) =>
      (listing.priceHistory && listing.priceHistory.length > 0) ||
      (listing.currPrice && listing.currPrice > 0),
  )
})
</script>

<template>
  <div class="price-history-chart container mb-3">
    <h3 class="spec-title fw-bold">Price History - {{ selectedWebsite }}</h3>
    <div v-if="hasData" class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="no-data p-4 text-center text-muted">No price history available</div>
  </div>
</template>

<style scoped>
.price-history-chart {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.spec-title {
  margin-bottom: 16px;
  color: #333;
}

.chart-container {
  height: 350px;
  position: relative;
}

.no-data {
  background-color: #f9fafb;
  border-radius: 8px;
}
</style>
