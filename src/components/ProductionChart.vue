<script setup>
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { formatDate } from '@/utils/formatters'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  series: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
    default: 260,
  },
})

const chartData = computed(() => {
  const labels = props.series.map((s) => formatDate(s.fecha))
  const posture = props.series.map((s) => s.postura_pct || 0)
  const eggs = props.series.map((s) => s.total_huevos || 0)

  return {
    labels,
    datasets: [
      {
        label: 'Tasa de Postura (%)',
        data: posture,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
        yAxisID: 'yPostura',
        pointBackgroundColor: '#059669',
        pointRadius: 4,
      },
      {
        label: 'Huevos Recolectados',
        data: eggs,
        borderColor: '#65a30d',
        backgroundColor: 'rgba(101, 163, 13, 0.1)',
        borderDash: [4, 4],
        tension: 0.2,
        yAxisID: 'yHuevos',
        pointBackgroundColor: '#4d7c0f',
        pointRadius: 3,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12,
        font: { family: 'Manrope', size: 11, weight: '600' },
        color: '#4e725d',
      },
    },
    tooltip: {
      backgroundColor: 'rgba(11, 31, 21, 0.9)',
      titleFont: { family: 'Fraunces', size: 13 },
      bodyFont: { family: 'Manrope', size: 12 },
      padding: 10,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        font: { family: 'Manrope', size: 10 },
        color: '#4e725d',
      },
    },
    yPostura: {
      type: 'linear',
      position: 'left',
      min: 0,
      max: 100,
      ticks: {
        callback: (val) => `${val}%`,
        font: { family: 'Manrope', size: 10 },
        color: '#10b981',
      },
      grid: { color: 'rgba(5, 150, 105, 0.1)' },
    },
    yHuevos: {
      type: 'linear',
      position: 'right',
      grid: { drawOnChartArea: false },
      ticks: {
        font: { family: 'Manrope', size: 10 },
        color: '#65a30d',
      },
    },
  },
}))
</script>

<template>
  <div :style="{ height: `${height}px` }" class="w-full relative">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
