<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import SeverityBadge from '@/components/SeverityBadge.vue'
import ProductionChart from '@/components/ProductionChart.vue'
import dashboardApi from '@/api/dashboard'
import vacunacionesApi from '@/api/vacunaciones'
import { formatNumber, formatPercent, formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const toast = useToast()

const data = ref(null)
const isLoading = ref(true)
const error = ref(null)

async function loadDashboard() {
  isLoading.value = true
  error.value = null
  try {
    const res = await dashboardApi.getDashboard()
    data.value = res
  } catch (err) {
    error.value = err.message || 'Error al cargar los datos del dashboard'
  } finally {
    isLoading.value = false
  }
}

async function handleMarcarVacuna(vacunaId) {
  try {
    await vacunacionesApi.marcarAplicada(vacunaId, {
      fecha_aplicada: new Date().toISOString().split('T')[0],
      notas: 'Marcada desde el dashboard',
    })
    toast.success('Vacunación marcada como aplicada exitosamente')
    loadDashboard()
  } catch (err) {
    toast.error('No fue posible actualizar la vacuna')
  }
}

onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Encabezado de bienvenida -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
          Panel de Control
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Resumen operativo de hoy en <strong class="text-primary">{{ authStore.granja?.nombre || 'la granja' }}</strong>
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <AppButton
          variant="primary"
          size="md"
          to="/registro"
        >
          <svg class="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Registrar hoy</span>
        </AppButton>
      </div>
    </div>

    <!-- Estado de carga -->
    <LoadingSkeleton v-if="isLoading" type="cards" />

    <!-- Error con reintento -->
    <GlassCard v-else-if="error" padding="lg" class="border border-rose-500/30 text-center space-y-3">
      <p class="text-rose-600 dark:text-rose-400 font-bold text-sm">{{ error }}</p>
      <AppButton variant="secondary" size="sm" @click="loadDashboard">
        Reintentar carga
      </AppButton>
    </GlassCard>

    <template v-else-if="data">
      <!-- Fila 1: Tarjetas de métricas clave (Aves vivas, Postura hoy, Cubetas hoy, Alertas) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <!-- Aves vivas totales -->
        <GlassCard padding="md" class="border border-emerald-500/20">
          <p class="text-[11px] sm:text-xs text-muted font-medium">Aves vivas censo</p>
          <p class="text-2xl sm:text-3xl font-bold text-primary tabular-nums mt-1">
            {{ formatNumber(data.aves_vivas_total, 0) }}
          </p>
          <span class="text-[10px] text-secondary mt-1 inline-block">
            {{ data.lotes_activos }} lote(s) activo(s)
          </span>
        </GlassCard>

        <!-- Postura hoy -->
        <GlassCard padding="md" class="border border-emerald-500/20">
          <p class="text-[11px] sm:text-xs text-muted font-medium">Tasa de postura hoy</p>
          <p class="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
            {{ formatPercent(data.postura_hoy_pct) }}
          </p>
          <span class="text-[10px] text-secondary mt-1 inline-block">
            {{ formatNumber(data.huevos_hoy, 0) }} huevos recogidos
          </span>
        </GlassCard>

        <!-- Cubetas hoy -->
        <GlassCard padding="md" class="border border-emerald-500/20">
          <p class="text-[11px] sm:text-xs text-muted font-medium">Cubetas de 30 hoy</p>
          <p class="text-2xl sm:text-3xl font-bold text-primary tabular-nums mt-1">
            {{ formatNumber(data.cubetas_hoy, 0) }}
          </p>
          <span class="text-[10px] text-secondary mt-1 inline-block">
            Listas para entrega
          </span>
        </GlassCard>

        <!-- Alertas sin leer -->
        <GlassCard
          padding="md"
          class="border"
          :class="data.alertas_sin_leer > 0 ? 'border-amber-500/30 bg-amber-500/5' : 'border-emerald-500/20'"
        >
          <p class="text-[11px] sm:text-xs text-muted font-medium">Alertas activas</p>
          <p
            class="text-2xl sm:text-3xl font-bold tabular-nums mt-1"
            :class="data.alertas_sin_leer > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-primary'"
          >
            {{ data.alertas_sin_leer }}
          </p>
          <RouterLink
            to="/alertas"
            class="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline mt-1 inline-block"
          >
            Ver detalle →
          </RouterLink>
        </GlassCard>
      </div>

      <!-- Fila 2: Lotes que faltan por registrar hoy (Aviso destacado para operario y admin) -->
      <div
        v-if="data.registros_pendientes_hoy && data.registros_pendientes_hoy.length > 0"
        class="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-950 dark:text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-center gap-2.5">
          <span class="w-3 h-3 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <div>
            <p class="font-bold">Galpones sin registro hoy:</p>
            <p class="text-xs text-amber-900/90 dark:text-amber-300">
              {{ data.registros_pendientes_hoy.map((r) => r.lote_nombre).join(', ') }} aún no tienen recolección ingresada.
            </p>
          </div>
        </div>

        <AppButton
          variant="primary"
          size="sm"
          :to="`/registro?lote=${data.registros_pendientes_hoy[0].lote}`"
        >
          Registrar lote ahora
        </AppButton>
      </div>

      <!-- Fila 3: Gráfica de 7 días y Lista de Lotes con Semáforo -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Gráfica 7 días (8 columnas lg) -->
        <GlassCard padding="lg" class="lg:col-span-7 border border-emerald-500/20 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-display font-bold text-primary">
              Tendencia de Postura y Huevos (Últimos 7 días)
            </h2>
            <span class="text-[11px] text-muted">Curva consolidada</span>
          </div>

          <div v-if="data.series_7d && data.series_7d.length > 0">
            <ProductionChart :series="data.series_7d" :height="250" />
          </div>
          <div v-else class="text-center py-10 text-xs text-muted">
            No hay registros en los últimos 7 días para graficar.
          </div>
        </GlassCard>

        <!-- Semáforo por Lote (5 columnas lg) -->
        <GlassCard padding="lg" class="lg:col-span-5 border border-emerald-500/20 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-display font-bold text-primary">
              Semáforo de Lotes Activos
            </h2>
            <RouterLink to="/lotes" class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
              Ver todos
            </RouterLink>
          </div>

          <div v-if="data.lotes && data.lotes.length > 0" class="space-y-2.5">
            <div
              v-for="lote in data.lotes"
              :key="lote.id"
              class="p-3 rounded-2xl glass-pill flex items-center justify-between border border-glass-border"
            >
              <div class="flex items-center gap-3">
                <!-- Luz del semáforo con color + texto -->
                <span
                  class="w-3.5 h-3.5 rounded-full shrink-0"
                  :class="[
                    lote.semaforo === 'ROJO'
                      ? 'bg-rose-500 ring-2 ring-rose-500/30 animate-pulse'
                      : lote.semaforo === 'AMARILLO'
                        ? 'bg-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-emerald-500 ring-2 ring-emerald-500/30',
                  ]"
                />
                <div>
                  <RouterLink :to="`/lotes/${lote.id}`" class="text-xs font-bold text-primary hover:underline">
                    {{ lote.nombre }}
                  </RouterLink>
                  <p class="text-[10px] text-muted">Semana {{ lote.semana_vida }} de vida</p>
                </div>
              </div>

              <div class="text-right">
                <span class="text-xs font-bold text-primary tabular-nums">
                  {{ formatPercent(lote.postura_pct) }}
                </span>
                <p class="text-[9px] font-bold uppercase tracking-wider" :class="lote.semaforo === 'ROJO' ? 'text-rose-600' : lote.semaforo === 'AMARILLO' ? 'text-amber-600' : 'text-emerald-600'">
                  {{ lote.semaforo }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-xs text-muted text-center py-6">
            No hay lotes activos actualmente.
          </div>
        </GlassCard>
      </div>

      <!-- Fila 4: Alertas recientes y Vacunaciones -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Alertas recientes -->
        <GlassCard padding="lg" class="border border-emerald-500/20 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-display font-bold text-primary">
              Alertas Sanitarias y Productivas
            </h2>
            <RouterLink to="/alertas" class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
              Todas las alertas
            </RouterLink>
          </div>

          <div v-if="data.alertas_recientes && data.alertas_recientes.length > 0" class="space-y-2.5">
            <div
              v-for="alerta in data.alertas_recientes"
              :key="alerta.id"
              class="p-3 rounded-2xl glass-pill flex items-start gap-3 border border-glass-border"
            >
              <SeverityBadge :severity="alerta.severidad" size="sm" class="shrink-0 mt-0.5" />
              <div class="text-xs flex-1">
                <p class="font-bold text-primary">{{ alerta.lote_nombre }} · {{ alerta.tipo }}</p>
                <p class="text-secondary mt-0.5 leading-relaxed">{{ alerta.mensaje }}</p>
                <span class="text-[10px] text-muted">{{ formatDate(alerta.fecha) }}</span>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-muted py-4 text-center">
            ✓ Parvadas en rango normal. Sin alertas recientes.
          </p>
        </GlassCard>

        <!-- Vacunaciones próximas y vencidas -->
        <GlassCard padding="lg" class="border border-emerald-500/20 space-y-4">
          <h2 class="text-base font-display font-bold text-primary">
            Plan de Vacunación
          </h2>

          <!-- Vencidas -->
          <div v-if="data.vacunaciones_vencidas && data.vacunaciones_vencidas.length > 0" class="space-y-2">
            <p class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              ⚠️ Vacunas vencidas (Requieren atención inmediata):
            </p>
            <div
              v-for="v in data.vacunaciones_vencidas"
              :key="v.id"
              class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2"
            >
              <div class="text-xs">
                <p class="font-bold text-rose-900 dark:text-rose-200">{{ v.vacuna }}</p>
                <p class="text-[10px] text-muted">Programada: {{ formatDate(v.fecha_programada) }}</p>
              </div>
              <button
                type="button"
                class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer"
                @click="handleMarcarVacuna(v.id)"
              >
                Marcar aplicada
              </button>
            </div>
          </div>

          <!-- Próximas (<= 7 días) -->
          <div v-if="data.vacunaciones_proximas && data.vacunaciones_proximas.length > 0" class="space-y-2">
            <p class="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              📅 Próximas en 7 días:
            </p>
            <div
              v-for="v in data.vacunaciones_proximas"
              :key="v.id"
              class="p-3 rounded-xl glass-pill flex items-center justify-between gap-2"
            >
              <div class="text-xs">
                <p class="font-bold text-primary">{{ v.vacuna }}</p>
                <p class="text-[10px] text-muted">Fecha: {{ formatDate(v.fecha_programada) }}</p>
              </div>
              <button
                type="button"
                class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs cursor-pointer"
                @click="handleMarcarVacuna(v.id)"
              >
                Marcar aplicada
              </button>
            </div>
          </div>

          <div
            v-if="(!data.vacunaciones_vencidas || data.vacunaciones_vencidas.length === 0) &&
              (!data.vacunaciones_proximas || data.vacunaciones_proximas.length === 0)"
            class="text-xs text-muted py-4 text-center"
          >
            No hay vacunaciones pendientes ni próximas esta semana.
          </div>
        </GlassCard>
      </div>
    </template>
  </div>
</template>
