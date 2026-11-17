<script setup>
import { ref, reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import registrosApi from '@/api/registros'
import lotesApi from '@/api/lotes'
import galponesApi from '@/api/galpones'
import { formatDate, formatNumber, formatPercent } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const registros = ref([])
const lotes = ref([])
const galpones = ref([])
const isLoading = ref(true)
const selectedRegistro = ref(null)

const filters = reactive({
  lote: '',
  galpon: '',
  fecha_desde: '',
  fecha_hasta: '',
})

// Calcula si un registro es editable por el usuario actual
function canEditRecord(registro) {
  if (authStore.isAdmin) return true
  if (!registro?.fecha) return false

  const diasPermitidos = authStore.granja?.dias_edicion_operario || 3
  const fechaReg = new Date(registro.fecha)
  const hoy = new Date()
  const diffDays = Math.floor((hoy - fechaReg) / (1000 * 60 * 60 * 24))

  return diffDays <= diasPermitidos
}

async function loadData() {
  isLoading.value = true
  try {
    const params = {}
    if (filters.lote) params.lote = filters.lote
    if (filters.galpon) params.galpon = filters.galpon
    if (filters.fecha_desde) params.fecha_desde = filters.fecha_desde
    if (filters.fecha_hasta) params.fecha_hasta = filters.fecha_hasta

    const [regRes, lotesRes, galponesRes] = await Promise.all([
      registrosApi.getRegistros(params),
      lotesApi.getLotes(),
      galponesApi.getGalpones(),
    ])

    registros.value = Array.isArray(regRes) ? regRes : regRes.results || []
    lotes.value = Array.isArray(lotesRes) ? lotesRes : lotesRes.results || []
    galpones.value = Array.isArray(galponesRes) ? galponesRes : galponesRes.results || []
  } catch (err) {
    toast.error('Error al cargar historial de registros')
  } finally {
    isLoading.value = false
  }
}

async function handleDelete(id) {
  if (!authStore.isAdmin) {
    toast.error('Solo el administrador puede eliminar registros')
    return
  }
  if (!confirm('¿Confirma que desea eliminar este registro diario? Se recalcularán las alertas.')) {
    return
  }

  try {
    await registrosApi.deleteRegistro(id)
    toast.success('Registro eliminado')
    selectedRegistro.value = null
    loadData()
  } catch (err) {
    toast.error('Error al eliminar registro')
  }
}

function resetFilters() {
  filters.lote = ''
  filters.galpon = ''
  filters.fecha_desde = ''
  filters.fecha_hasta = ''
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
          Historial de Registros
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Consulte la trazabilidad de recolecciones, alimento y mortalidad
        </p>
      </div>

      <AppButton variant="primary" size="md" to="/registro">
        + Nuevo Registro
      </AppButton>
    </div>

    <!-- Barra de Filtros -->
    <GlassCard padding="md" class="border border-emerald-500/20">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label class="block font-semibold text-primary mb-1">Filtrar por Lote</label>
          <select
            v-model="filters.lote"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todos los lotes</option>
            <option v-for="l in lotes" :key="l.id" :value="l.id">{{ l.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-primary mb-1">Filtrar por Galpón</label>
          <select
            v-model="filters.galpon"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todos los galpones</option>
            <option v-for="g in galpones" :key="g.id" :value="g.id">{{ g.nombre }}</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold text-primary mb-1">Fecha Desde</label>
          <input
            v-model="filters.fecha_desde"
            type="date"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
        </div>

        <div>
          <label class="block font-semibold text-primary mb-1">Fecha Hasta</label>
          <div class="flex gap-2">
            <input
              v-model="filters.fecha_hasta"
              type="date"
              class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
              @change="loadData"
            >
            <button
              type="button"
              class="px-2.5 py-1 glass-pill text-xs font-semibold hover:bg-emerald-500/10 rounded-xl"
              title="Limpiar filtros"
              @click="resetFilters"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </GlassCard>

    <!-- Lista / Tabla de registros -->
    <LoadingSkeleton v-if="isLoading" type="table" :lines="6" />

    <EmptyState
      v-else-if="registros.length === 0"
      title="No hay registros encontrados"
      description="No se encontraron registros con los filtros seleccionados o aún no hay recolecciones ingresadas."
      action-text="Crear primer registro"
      action-to="/registro"
    />

    <div v-else class="space-y-3">
      <!-- Tabla responsive en desktop, tarjetas en móvil -->
      <div class="hidden md:block overflow-x-auto rounded-2xl glass-panel border border-emerald-500/20">
        <table class="w-full text-left text-xs">
          <thead class="bg-emerald-950/10 dark:bg-emerald-950/40 text-muted uppercase tracking-wider font-bold border-b border-glass-border">
            <tr>
              <th class="p-3.5">Fecha</th>
              <th class="p-3.5">Lote</th>
              <th class="p-3.5">Huevos Totales</th>
              <th class="p-3.5">Cubetas 30</th>
              <th class="p-3.5">Postura %</th>
              <th class="p-3.5">Alimento</th>
              <th class="p-3.5">Bajas</th>
              <th class="p-3.5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-glass-border/50">
            <tr
              v-for="reg in registros"
              :key="reg.id"
              class="hover:bg-emerald-500/5 transition-colors cursor-pointer"
              @click="selectedRegistro = reg"
            >
              <td class="p-3.5 font-bold text-primary">{{ formatDate(reg.fecha) }}</td>
              <td class="p-3.5 text-secondary font-medium">{{ reg.lote_nombre || `Lote #${reg.lote}` }}</td>
              <td class="p-3.5 font-bold tabular-nums">{{ formatNumber(reg.total_huevos, 0) }}</td>
              <td class="p-3.5 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{{ reg.total_cubetas }} cub</td>
              <td class="p-3.5 font-bold tabular-nums">{{ formatPercent(reg.postura_pct) }}</td>
              <td class="p-3.5 tabular-nums">{{ formatNumber(reg.alimento_kg) }} kg</td>
              <td class="p-3.5 tabular-nums text-rose-600 font-semibold">{{ reg.mortalidad || 0 }}</td>
              <td class="p-3.5 text-right" @click.stop>
                <div class="flex items-center justify-end gap-2">
                  <RouterLink
                    v-if="canEditRecord(reg)"
                    :to="`/registro?lote=${reg.lote}&fecha=${reg.fecha}`"
                    class="px-2.5 py-1 rounded-lg glass-pill font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                  >
                    Editar
                  </RouterLink>
                  <span v-else class="text-[10px] text-muted italic" title="El operario solo edita registros de los últimos días">
                    Solo lectura
                  </span>

                  <button
                    v-if="authStore.isAdmin"
                    type="button"
                    class="text-rose-600 hover:text-rose-800 p-1"
                    title="Eliminar registro"
                    @click="handleDelete(reg.id)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tarjetas móviles -->
      <div class="md:hidden space-y-3">
        <GlassCard
          v-for="reg in registros"
          :key="reg.id"
          padding="md"
          class="border border-emerald-500/20 space-y-2.5"
          @click="selectedRegistro = reg"
        >
          <div class="flex items-center justify-between border-b border-glass-border pb-2">
            <div>
              <p class="font-bold text-sm text-primary">{{ formatDate(reg.fecha) }}</p>
              <p class="text-[11px] text-muted">{{ reg.lote_nombre || `Lote #${reg.lote}` }}</p>
            </div>
            <div class="text-right">
              <span class="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {{ reg.total_cubetas }} cubetas
              </span>
              <p class="text-[10px] text-muted">{{ formatPercent(reg.postura_pct) }} postura</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs">
            <div class="glass-pill p-2 rounded-xl">
              <span class="text-[10px] text-muted block">Huevos</span>
              <strong>{{ formatNumber(reg.total_huevos, 0) }}</strong>
            </div>
            <div class="glass-pill p-2 rounded-xl">
              <span class="text-[10px] text-muted block">Alimento</span>
              <strong>{{ formatNumber(reg.alimento_kg) }} kg</strong>
            </div>
            <div class="glass-pill p-2 rounded-xl">
              <span class="text-[10px] text-muted block">Bajas</span>
              <strong class="text-rose-600">{{ reg.mortalidad || 0 }}</strong>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-glass-border">
            <RouterLink
              v-if="canEditRecord(reg)"
              :to="`/registro?lote=${reg.lote}&fecha=${reg.fecha}`"
              class="text-xs font-bold text-emerald-700 dark:text-emerald-400"
              @click.stop
            >
              Editar registro →
            </RouterLink>
            <span v-else class="text-[10px] text-muted italic">
              Bloqueado (más de 3 días)
            </span>

            <button
              v-if="authStore.isAdmin"
              type="button"
              class="text-xs text-rose-600 font-semibold"
              @click.stop="handleDelete(reg.id)"
            >
              Eliminar
            </button>
          </div>
        </GlassCard>
      </div>
    </div>

    <!-- Modal Detalle de Registro -->
    <div
      v-if="selectedRegistro"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-lg">
        <GlassCard elevated padding="lg" class="border border-emerald-500/30 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-glass-border">
            <div>
              <h2 class="text-lg font-bold text-primary">
                Detalle del Registro · {{ formatDate(selectedRegistro.fecha) }}
              </h2>
              <p class="text-xs text-muted">{{ selectedRegistro.lote_nombre }}</p>
            </div>
            <button
              type="button"
              class="text-muted hover:text-primary p-1"
              @click="selectedRegistro = null"
            >
              ✕
            </button>
          </div>

          <!-- Desglose por categorías -->
          <div class="space-y-2">
            <p class="text-xs font-bold text-primary">Desglose de huevo por categorías:</p>
            <div class="grid grid-cols-5 gap-2 text-center text-xs">
              <div class="glass-pill p-2 rounded-xl">
                <span class="text-[10px] text-muted block font-bold">AAA</span>
                <strong>{{ selectedRegistro.aaa || 0 }}</strong>
              </div>
              <div class="glass-pill p-2 rounded-xl ring-1 ring-emerald-500/30">
                <span class="text-[10px] text-emerald-700 dark:text-emerald-300 block font-bold">AA</span>
                <strong>{{ selectedRegistro.aa || 0 }}</strong>
              </div>
              <div class="glass-pill p-2 rounded-xl">
                <span class="text-[10px] text-muted block font-bold">A</span>
                <strong>{{ selectedRegistro.a || 0 }}</strong>
              </div>
              <div class="glass-pill p-2 rounded-xl">
                <span class="text-[10px] text-muted block font-bold">B</span>
                <strong>{{ selectedRegistro.b || 0 }}</strong>
              </div>
              <div class="glass-pill p-2 rounded-xl">
                <span class="text-[10px] text-muted block font-bold">C</span>
                <strong>{{ selectedRegistro.c || 0 }}</strong>
              </div>
            </div>
          </div>

          <!-- Métricas del día -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
            <div class="p-2 rounded-xl bg-canvas">
              <span class="text-[10px] text-muted block">Cubetas totales</span>
              <strong class="text-sm font-bold">{{ selectedRegistro.total_cubetas }}</strong>
            </div>
            <div class="p-2 rounded-xl bg-canvas">
              <span class="text-[10px] text-muted block">Postura</span>
              <strong class="text-sm font-bold text-emerald-600">{{ formatPercent(selectedRegistro.postura_pct) }}</strong>
            </div>
            <div class="p-2 rounded-xl bg-canvas">
              <span class="text-[10px] text-muted block">Consumo/ave</span>
              <strong class="text-sm font-bold">{{ formatNumber(selectedRegistro.consumo_g_ave) }} g</strong>
            </div>
            <div class="p-2 rounded-xl bg-canvas">
              <span class="text-[10px] text-muted block">Aves vivas</span>
              <strong class="text-sm font-bold">{{ formatNumber(selectedRegistro.aves_vivas, 0) }}</strong>
            </div>
          </div>

          <div v-if="selectedRegistro.observaciones" class="p-3 rounded-xl bg-canvas text-xs space-y-1">
            <strong class="text-muted block">Observaciones:</strong>
            <p>{{ selectedRegistro.observaciones }}</p>
          </div>

          <div class="pt-3 border-t border-glass-border flex justify-end gap-2">
            <AppButton variant="secondary" size="sm" @click="selectedRegistro = null">
              Cerrar
            </AppButton>
            <AppButton
              v-if="canEditRecord(selectedRegistro)"
              variant="primary"
              size="sm"
              :to="`/registro?lote=${selectedRegistro.lote}&fecha=${selectedRegistro.fecha}`"
            >
              Editar este día
            </AppButton>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
