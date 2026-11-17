<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ProductionChart from '@/components/ProductionChart.vue'
import EditorEstandares from '../components/EditorEstandares.vue'
import PlanVacunacion from '../components/PlanVacunacion.vue'
import lotesApi from '@/api/lotes'
import registrosApi from '@/api/registros'
import { formatNumber, formatPercent, formatDate } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const loteId = route.params.id
const activeTab = ref('resumen') // 'resumen' | 'registros' | 'estandares' | 'vacunacion'

const lote = ref(null)
const resumen = ref(null)
const registros = ref([])
const isLoading = ref(true)

async function loadLote() {
  isLoading.value = true
  try {
    const [loteData, resumenData, regData] = await Promise.all([
      lotesApi.getLote(loteId),
      lotesApi.getLoteResumen(loteId).catch(() => null),
      registrosApi.getRegistros({ lote: loteId }).catch(() => []),
    ])
    lote.value = loteData
    resumen.value = resumenData
    registros.value = Array.isArray(regData) ? regData : regData.results || []
  } catch (err) {
    toast.error('Error al cargar detalle del lote')
  } finally {
    isLoading.value = false
  }
}

async function handleCerrarLote() {
  if (!confirm('¿Confirma que desea cerrar y finalizar este lote de aves? Ya no se podrán registrar nuevas recolecciones.')) {
    return
  }
  try {
    await lotesApi.cerrarLote(loteId)
    toast.success('Lote cerrado exitosamente')
    loadLote()
  } catch (err) {
    toast.error('Error al cerrar el lote')
  }
}

onMounted(() => {
  loadLote()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Botón volver -->
    <div>
      <RouterLink to="/lotes" class="text-xs text-muted hover:text-primary transition-colors inline-flex items-center gap-1 font-semibold">
        ← Volver a la lista de lotes
      </RouterLink>
    </div>

    <LoadingSkeleton v-if="isLoading" type="cards" />

    <template v-else-if="lote">
      <!-- Encabezado del Lote -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl glass-panel border border-emerald-500/25">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              :class="lote.estado === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-gray-500/20 text-muted'"
            >
              {{ lote.estado }}
            </span>
            <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Semana {{ lote.semana_vida }} de vida
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
            {{ lote.nombre }}
          </h1>

          <p class="text-xs text-secondary">
            Alojado en: <strong>{{ lote.galpon_nombre || 'Galpón' }}</strong> · Línea: <strong>{{ lote.linea_genetica }}</strong> · Ingreso: {{ formatDate(lote.fecha_ingreso) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <AppButton
            v-if="lote.estado === 'ACTIVO'"
            variant="primary"
            size="sm"
            :to="`/registro?lote=${lote.id}`"
          >
            Registrar hoy
          </AppButton>

          <button
            v-if="authStore.isAdmin && lote.estado === 'ACTIVO'"
            type="button"
            class="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
            @click="handleCerrarLote"
          >
            Cerrar Lote
          </button>
        </div>
      </div>

      <!-- Barra de pestañas -->
      <div class="flex items-center gap-2 border-b border-glass-border overflow-x-auto pb-1 text-xs font-bold">
        <button
          type="button"
          class="px-4 py-2 rounded-xl transition-colors cursor-pointer"
          :class="activeTab === 'resumen' ? 'bg-emerald-600 text-white shadow-xs' : 'text-secondary hover:text-primary glass-pill'"
          @click="activeTab = 'resumen'"
        >
          Resumen e Indicadores
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-xl transition-colors cursor-pointer"
          :class="activeTab === 'registros' ? 'bg-emerald-600 text-white shadow-xs' : 'text-secondary hover:text-primary glass-pill'"
          @click="activeTab = 'registros'"
        >
          Historial de Registros ({{ registros.length }})
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-xl transition-colors cursor-pointer"
          :class="activeTab === 'estandares' ? 'bg-emerald-600 text-white shadow-xs' : 'text-secondary hover:text-primary glass-pill'"
          @click="activeTab = 'estandares'"
        >
          Estándares por Semana
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-xl transition-colors cursor-pointer"
          :class="activeTab === 'vacunacion' ? 'bg-emerald-600 text-white shadow-xs' : 'text-secondary hover:text-primary glass-pill'"
          @click="activeTab = 'vacunacion'"
        >
          Plan de Vacunación
        </button>
      </div>

      <!-- Pestaña 1: Resumen -->
      <div v-if="activeTab === 'resumen'" class="space-y-6">
        <div v-if="resumen" class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <GlassCard padding="md" class="border border-emerald-500/20">
            <span class="text-[10px] text-muted block font-medium">Postura Promedio</span>
            <strong class="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {{ formatPercent(resumen.postura_promedio_pct) }}
            </strong>
            <span class="text-[10px] text-secondary block mt-1">
              {{ resumen.dias_registrados }} días registrados
            </span>
          </GlassCard>

          <GlassCard padding="md" class="border border-emerald-500/20">
            <span class="text-[10px] text-muted block font-medium">Total Cubetas 30</span>
            <strong class="text-2xl font-bold text-primary tabular-nums">
              {{ formatNumber(resumen.cubetas_totales, 0) }}
            </strong>
            <span class="text-[10px] text-secondary block mt-1">
              {{ formatNumber(resumen.huevos_totales, 0) }} huevos en total
            </span>
          </GlassCard>

          <GlassCard padding="md" class="border border-emerald-500/20">
            <span class="text-[10px] text-muted block font-medium">Conversión Docena</span>
            <strong class="text-2xl font-bold text-primary tabular-nums">
              {{ formatNumber(resumen.conversion_alimenticia, 2) }}
            </strong>
            <span class="text-[10px] text-secondary block mt-1">
              {{ formatNumber(resumen.alimento_total_kg, 0) }} kg alimento
            </span>
          </GlassCard>

          <GlassCard padding="md" class="border border-emerald-500/20">
            <span class="text-[10px] text-muted block font-medium">Mortalidad Acumulada</span>
            <strong class="text-2xl font-bold text-rose-600 tabular-nums">
              {{ formatPercent(resumen.mortalidad_acumulada_pct, 2) }}
            </strong>
            <span class="text-[10px] text-secondary block mt-1">
              {{ resumen.mortalidad_acumulada }} aves bajas
            </span>
          </GlassCard>
        </div>

        <!-- Gráfica de los últimos 7 días del lote -->
        <GlassCard
          v-if="resumen && resumen.ultimos_7_dias && resumen.ultimos_7_dias.length > 0"
          padding="lg"
          class="border border-emerald-500/20 space-y-3"
        >
          <h2 class="text-base font-bold text-primary">
            Curva de Producción de los Últimos 7 Días
          </h2>
          <ProductionChart :series="resumen.ultimos_7_dias" :height="260" />
        </GlassCard>
      </div>

      <!-- Pestaña 2: Registros -->
      <div v-else-if="activeTab === 'registros'" class="space-y-4">
        <div v-if="registros.length === 0" class="p-8 text-center text-xs text-muted glass-panel rounded-2xl">
          Aún no hay registros de recolección para este lote.
        </div>
        <div v-else class="overflow-x-auto rounded-2xl glass-panel border border-emerald-500/20">
          <table class="w-full text-left text-xs">
            <thead class="bg-canvas/90 text-muted uppercase tracking-wider font-bold border-b border-glass-border">
              <tr>
                <th class="p-3">Fecha</th>
                <th class="p-3">Huevos</th>
                <th class="p-3">Cubetas</th>
                <th class="p-3">Postura %</th>
                <th class="p-3">Alimento</th>
                <th class="p-3">Bajas</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-glass-border/40 font-mono">
              <tr v-for="r in registros" :key="r.id" class="hover:bg-emerald-500/5">
                <td class="p-3 font-bold font-sans">{{ formatDate(r.fecha) }}</td>
                <td class="p-3">{{ formatNumber(r.total_huevos, 0) }}</td>
                <td class="p-3 font-bold text-emerald-700 dark:text-emerald-400">{{ r.total_cubetas }}</td>
                <td class="p-3 font-bold">{{ formatPercent(r.postura_pct) }}</td>
                <td class="p-3">{{ formatNumber(r.alimento_kg) }} kg</td>
                <td class="p-3 text-rose-600">{{ r.mortalidad || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pestaña 3: Estándares -->
      <div v-else-if="activeTab === 'estandares'">
        <EditorEstandares :lote-id="loteId" />
      </div>

      <!-- Pestaña 4: Vacunación -->
      <div v-else-if="activeTab === 'vacunacion'">
        <PlanVacunacion :lote-id="loteId" />
      </div>
    </template>
  </div>
</template>
