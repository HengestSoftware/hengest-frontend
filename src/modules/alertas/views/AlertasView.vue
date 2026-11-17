<script setup>
import { ref, reactive, onMounted } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import SeverityBadge from '@/components/SeverityBadge.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useAlertasStore } from '@/stores/alertas'
import lotesApi from '@/api/lotes'
import { formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'

const alertasStore = useAlertasStore()
const toast = useToast()

const lotes = ref([])
const filters = reactive({
  lote: '',
  tipo: '',
  severidad: '',
  leida: '',
})

async function loadData() {
  const params = {}
  if (filters.lote) params.lote = filters.lote
  if (filters.tipo) params.tipo = filters.tipo
  if (filters.severidad) params.severidad = filters.severidad
  if (filters.leida !== '') params.leida = filters.leida === 'true'

  try {
    await alertasStore.fetchAlertas(params)
  } catch (err) {
    toast.error('Error al cargar alertas')
  }
}

async function handleMarcarLeida(id) {
  try {
    await alertasStore.marcarLeida(id)
    toast.success('Alerta marcada como leída')
  } catch (err) {
    toast.error('Error al actualizar alerta')
  }
}

async function handleMarcarTodas() {
  try {
    await alertasStore.marcarTodasLeidas()
    toast.success('Todas las alertas marcadas como leídas')
  } catch (err) {
    toast.error('Error al marcar todas las alertas')
  }
}

function getRecomendacionCampo(tipo) {
  switch (tipo) {
    case 'POSTURA':
      return 'Qué mirar en el galpón: Verifique recolección en nidos, horas de luz artificial, calidad y pesaje del concentrado, y posible estrés por temperatura.'
    case 'MORTALIDAD':
      return 'Qué mirar en el galpón: Revise síntomas respiratorios, ventilación, cama húmeda, prolapso o asfixia en tolvas. Si supera el umbral crítico, alerte al zootecnista o veterinario.'
    case 'CONSUMO':
      return 'Qué mirar en el galpón: Inspeccione bebederos (suministro de agua tapado o con sarro), palatabilidad del alimento, tolvas atascadas o calor excesivo.'
    default:
      return 'Qué mirar en el galpón: Inspeccione el estado general de las aves y verifique los registros de los últimos 3 días.'
  }
}

onMounted(async () => {
  try {
    const lotesRes = await lotesApi.getLotes()
    lotes.value = Array.isArray(lotesRes) ? lotesRes : lotesRes.results || []
  } catch {}
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
          Centro de Alertas
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Detección preventiva de caídas de postura, picos de bajas y consumo anormal
        </p>
      </div>

      <div v-if="alertasStore.unreadCount > 0">
        <AppButton variant="secondary" size="sm" @click="handleMarcarTodas">
          Marcar todas como leídas ({{ alertasStore.unreadCount }})
        </AppButton>
      </div>
    </div>

    <!-- Filtros -->
    <GlassCard padding="md" class="border border-emerald-500/20">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label class="block font-semibold mb-1">Filtrar por Lote</label>
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
          <label class="block font-semibold mb-1">Tipo de Desviación</label>
          <select
            v-model="filters.tipo"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todos los tipos</option>
            <option value="POSTURA">Caída de Postura</option>
            <option value="MORTALIDAD">Pico de Mortalidad</option>
            <option value="CONSUMO">Consumo Anormal</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold mb-1">Severidad</label>
          <select
            v-model="filters.severidad"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todas</option>
            <option value="CRITICA">Crítica</option>
            <option value="ADVERTENCIA">Advertencia</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold mb-1">Estado de Lectura</label>
          <select
            v-model="filters.leida"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todas</option>
            <option value="false">Solo No Leídas</option>
            <option value="true">Solo Leídas</option>
          </select>
        </div>
      </div>
    </GlassCard>

    <!-- Lista de Alertas -->
    <LoadingSkeleton v-if="alertasStore.isLoading" type="cards" />

    <EmptyState
      v-else-if="alertasStore.alertas.length === 0"
      title="Sin alertas activas"
      description="Los galpones y lotes se encuentran operando dentro de los rangos de producción esperados."
    />

    <div v-else class="space-y-3">
      <GlassCard
        v-for="alerta in alertasStore.alertas"
        :key="alerta.id"
        padding="lg"
        class="border transition-all duration-200 space-y-3"
        :class="[
          !alerta.leida ? 'border-amber-500/40 bg-amber-500/5 shadow-md' : 'border-emerald-500/15 opacity-80',
        ]"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-glass-border pb-2.5">
          <div class="flex items-center gap-2.5">
            <SeverityBadge :severity="alerta.severidad" size="md" />
            <h2 class="text-sm font-bold text-primary">
              {{ alerta.lote_nombre }} · Desviación en {{ alerta.tipo }}
            </h2>
          </div>

          <div class="flex items-center gap-3 text-xs text-muted">
            <span>Fecha del registro: <strong>{{ formatDate(alerta.fecha) }}</strong></span>
            <span
              class="w-2 h-2 rounded-full"
              :class="!alerta.leida ? 'bg-amber-500 animate-pulse' : 'bg-transparent'"
            />
          </div>
        </div>

        <!-- Mensaje principal descriptivo -->
        <p class="text-sm text-primary font-medium leading-relaxed">
          {{ alerta.mensaje }}
        </p>

        <!-- Resumen tipo 'qué pasó y qué mirar' para el galponero -->
        <div class="p-3 rounded-2xl bg-canvas/70 border border-emerald-500/20 text-xs space-y-1">
          <p class="font-bold text-emerald-800 dark:text-emerald-300">
            🔍 Guía de inspección en el galpón:
          </p>
          <p class="text-secondary leading-relaxed">
            {{ getRecomendacionCampo(alerta.tipo) }}
          </p>
        </div>

        <!-- Acciones -->
        <div class="flex items-center justify-between pt-1">
          <RouterLink
            :to="`/lotes/${alerta.lote}`"
            class="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Ver lote afectado →
          </RouterLink>

          <button
            v-if="!alerta.leida"
            type="button"
            class="text-xs font-semibold text-secondary hover:text-primary glass-pill px-3 py-1 rounded-full cursor-pointer"
            @click="handleMarcarLeida(alerta.id)"
          >
            ✓ Marcar como leída
          </button>
        </div>
      </GlassCard>
    </div>
  </div>
</template>
