<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import ProductionChart from '@/components/ProductionChart.vue'
import reportesApi from '@/api/reportes'
import lotesApi from '@/api/lotes'
import galponesApi from '@/api/galpones'
import { formatNumber, formatPercent, formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const toast = useToast()

const reportData = ref(null)
const lotes = ref([])
const galpones = ref([])
const isLoading = ref(true)
const isExporting = ref(false)

const filters = reactive({
  lote: '',
  galpon: '',
  fecha_desde: '',
  fecha_hasta: '',
})

async function loadReport() {
  isLoading.value = true
  try {
    const params = {}
    if (filters.lote) params.lote = filters.lote
    if (filters.galpon) params.galpon = filters.galpon
    if (filters.fecha_desde) params.fecha_desde = filters.fecha_desde
    if (filters.fecha_hasta) params.fecha_hasta = filters.fecha_hasta

    const data = await reportesApi.getReporteProduccion(params)
    reportData.value = data
  } catch (err) {
    toast.error('Error al generar reporte de producción')
  } finally {
    isLoading.value = false
  }
}

async function handleExportCsv() {
  isExporting.value = true
  try {
    const params = {}
    if (filters.lote) params.lote = filters.lote
    if (filters.galpon) params.galpon = filters.galpon
    if (filters.fecha_desde) params.fecha_desde = filters.fecha_desde
    if (filters.fecha_hasta) params.fecha_hasta = filters.fecha_hasta

    const blob = await reportesApi.exportarReporteCsv(params)
    const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `reporte_produccion_hengest_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success('Reporte CSV descargado')
  } catch (err) {
    toast.error('Error al exportar archivo CSV')
  } finally {
    isExporting.value = false
  }
}

function handlePrint() {
  window.print()
}

// Convertir filas para la gráfica de 7d o periodo
const chartSeries = computed(() => {
  if (!reportData.value?.filas) return []
  return reportData.value.filas.map((f) => ({
    fecha: f.fecha,
    postura_pct: f.postura_pct,
    total_huevos: f.total_huevos,
  }))
})

onMounted(async () => {
  try {
    const [lotesRes, galponesRes] = await Promise.all([
      lotesApi.getLotes(),
      galponesApi.getGalpones(),
    ])
    lotes.value = Array.isArray(lotesRes) ? lotesRes : lotesRes.results || []
    galpones.value = Array.isArray(galponesRes) ? galponesRes : galponesRes.results || []
  } catch {}
  loadReport()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado con botones de acción -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
          Reportes Técnicos de Producción
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Consolidado para análisis zootécnico, curvas de postura y rendimiento
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="px-3.5 py-2 rounded-xl glass-pill font-bold text-xs text-primary hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          :disabled="isExporting"
          @click="handleExportCsv"
        >
          <span>📥</span> {{ isExporting ? 'Exportando...' : 'Exportar CSV' }}
        </button>

        <button
          type="button"
          class="px-3.5 py-2 rounded-xl glass-pill font-bold text-xs text-primary hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          @click="handlePrint"
        >
          <span>🖨️</span> Imprimir / PDF
        </button>
      </div>
    </div>

    <!-- Encabezado exclusivo para impresión -->
    <div class="hidden print:block mb-6 border-b pb-4">
      <h1 class="text-2xl font-bold">HENGEST — Reporte Consolidado de Producción</h1>
      <p class="text-xs text-gray-600">
        Granja: {{ authStore.granja?.nombre }} · Fecha de emisión: {{ new Date().toLocaleDateString('es-CO') }}
      </p>
    </div>

    <!-- Filtros de búsqueda (ocultos en impresión) -->
    <GlassCard padding="md" class="border border-emerald-500/20 print:hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label class="block font-semibold mb-1">Filtrar por Lote</label>
          <select
            v-model="filters.lote"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadReport"
          >
            <option value="">Todos los lotes</option>
            <option v-for="l in lotes" :key="l.id" :value="l.id">{{ l.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold mb-1">Filtrar por Galpón</label>
          <select
            v-model="filters.galpon"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadReport"
          >
            <option value="">Todos los galpones</option>
            <option v-for="g in galpones" :key="g.id" :value="g.id">{{ g.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold mb-1">Fecha Desde</label>
          <input
            v-model="filters.fecha_desde"
            type="date"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadReport"
          >
        </div>

        <div>
          <label class="block font-semibold mb-1">Fecha Hasta</label>
          <input
            v-model="filters.fecha_hasta"
            type="date"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadReport"
          >
        </div>
      </div>
    </GlassCard>

    <LoadingSkeleton v-if="isLoading" type="table" :lines="6" />

    <template v-else-if="reportData">
      <!-- Tarjetas de Totales del Periodo -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 text-center">
          <span class="text-[10px] text-muted block font-bold">Huevos Totales</span>
          <strong class="text-lg sm:text-xl font-bold tabular-nums text-primary">
            {{ formatNumber(reportData.totales?.huevos, 0) }}
          </strong>
        </div>

        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 text-center">
          <span class="text-[10px] text-muted block font-bold">Cubetas de 30</span>
          <strong class="text-lg sm:text-xl font-bold tabular-nums text-emerald-700 dark:text-emerald-400">
            {{ formatNumber(reportData.totales?.cubetas, 0) }}
          </strong>
        </div>

        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 text-center">
          <span class="text-[10px] text-muted block font-bold">Postura Promedio</span>
          <strong class="text-lg sm:text-xl font-bold tabular-nums text-primary">
            {{ formatPercent(reportData.totales?.postura_promedio_pct) }}
          </strong>
        </div>

        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 text-center">
          <span class="text-[10px] text-muted block font-bold">Alimento Total</span>
          <strong class="text-lg sm:text-xl font-bold tabular-nums text-primary">
            {{ formatNumber(reportData.totales?.alimento_kg, 0) }} kg
          </strong>
        </div>

        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 text-center">
          <span class="text-[10px] text-muted block font-bold">Conversión</span>
          <strong class="text-lg sm:text-xl font-bold tabular-nums text-primary">
            {{ formatNumber(reportData.totales?.conversion_alimenticia, 2) }}
          </strong>
        </div>

        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 text-center">
          <span class="text-[10px] text-muted block font-bold">Mortalidad</span>
          <strong class="text-lg sm:text-xl font-bold tabular-nums text-rose-600">
            {{ formatNumber(reportData.totales?.mortalidad, 0) }} aves
          </strong>
        </div>
      </div>

      <!-- Gráfica de evolución (oculta al imprimir si no se desea) -->
      <GlassCard v-if="chartSeries.length > 0" padding="lg" class="border border-emerald-500/20 space-y-3">
        <h2 class="text-base font-bold text-primary">
          Evolución de Tasa de Postura y Recolección
        </h2>
        <ProductionChart :series="chartSeries" :height="250" />
      </GlassCard>

      <!-- Tabla detallada de registros -->
      <div class="overflow-x-auto rounded-2xl glass-panel border border-emerald-500/20">
        <table class="w-full text-left text-xs">
          <thead class="bg-canvas/90 text-muted uppercase tracking-wider font-bold border-b border-glass-border">
            <tr>
              <th class="p-3">Fecha</th>
              <th class="p-3">Lote</th>
              <th class="p-3">AAA</th>
              <th class="p-3">AA</th>
              <th class="p-3">A</th>
              <th class="p-3">B</th>
              <th class="p-3">C</th>
              <th class="p-3">Total Huevos</th>
              <th class="p-3">Cubetas 30</th>
              <th class="p-3">Postura %</th>
              <th class="p-3">Alimento (kg)</th>
              <th class="p-3">Bajas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-glass-border/40 font-mono">
            <tr v-for="f in reportData.filas" :key="f.id" class="hover:bg-emerald-500/5">
              <td class="p-3 font-sans font-bold">{{ formatDate(f.fecha) }}</td>
              <td class="p-3 font-sans">{{ f.lote_nombre }}</td>
              <td class="p-3">{{ f.aaa || 0 }}</td>
              <td class="p-3 font-bold">{{ f.aa || 0 }}</td>
              <td class="p-3">{{ f.a || 0 }}</td>
              <td class="p-3">{{ f.b || 0 }}</td>
              <td class="p-3">{{ f.c || 0 }}</td>
              <td class="p-3 font-bold text-primary">{{ formatNumber(f.total_huevos, 0) }}</td>
              <td class="p-3 font-bold text-emerald-700 dark:text-emerald-400">{{ f.total_cubetas }}</td>
              <td class="p-3 font-bold">{{ formatPercent(f.postura_pct) }}</td>
              <td class="p-3">{{ formatNumber(f.alimento_kg) }}</td>
              <td class="p-3 text-rose-600">{{ f.mortalidad || 0 }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
@media print {
  body {
    background: white !important;
    color: black !important;
  }
}
</style>
