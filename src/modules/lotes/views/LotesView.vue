<script setup>
import { ref, reactive, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import lotesApi from '@/api/lotes'
import galponesApi from '@/api/galpones'
import { formatDate, formatNumber } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const lotes = ref([])
const galpones = ref([])
const isLoading = ref(true)
const showCreateModal = ref(false)

const filters = reactive({
  estado: '',
  galpon: '',
})

const createForm = reactive({
  galpon: null,
  nombre: '',
  linea_genetica: 'Hy-Line Brown',
  fecha_ingreso: new Date().toISOString().split('T')[0],
  edad_inicial_semanas: 18,
  aves_iniciales: 2000,
  peso_promedio_huevo_g: null,
})

async function loadData() {
  isLoading.value = true
  try {
    const params = {}
    if (filters.estado) params.estado = filters.estado
    if (filters.galpon) params.galpon = filters.galpon

    const [lotesRes, galponesRes] = await Promise.all([
      lotesApi.getLotes(params),
      galponesApi.getGalpones(),
    ])
    lotes.value = Array.isArray(lotesRes) ? lotesRes : lotesRes.results || []
    galpones.value = Array.isArray(galponesRes) ? galponesRes : galponesRes.results || []
  } catch (err) {
    toast.error('Error al cargar lotes')
  } finally {
    isLoading.value = false
  }
}

async function handleCreateLote() {
  if (!createForm.nombre.trim() || !createForm.galpon) {
    toast.error('Complete el nombre del lote y seleccione el galpón')
    return
  }

  try {
    await lotesApi.createLote({
      galpon: createForm.galpon,
      nombre: createForm.nombre.trim(),
      linea_genetica: createForm.linea_genetica,
      fecha_ingreso: createForm.fecha_ingreso,
      edad_inicial_semanas: parseInt(createForm.edad_inicial_semanas, 10) || 18,
      aves_iniciales: parseInt(createForm.aves_iniciales, 10) || 0,
      peso_promedio_huevo_g: createForm.peso_promedio_huevo_g ? parseFloat(createForm.peso_promedio_huevo_g) : null,
      estado: 'ACTIVO',
    })
    toast.success('Lote de aves creado exitosamente')
    showCreateModal.value = false
    loadData()
  } catch (err) {
    toast.error(err.response?.data?.nombre?.[0] || 'Error al crear el lote')
  }
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
          Lotes de Gallinas Ponedoras
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Control de parvadas, edad en semanas, censo y seguimiento sanitario
        </p>
      </div>

      <AppButton
        v-if="authStore.isAdmin"
        variant="primary"
        size="md"
        @click="showCreateModal = true"
      >
        + Nuevo Lote
      </AppButton>
    </div>

    <!-- Filtros de lotes -->
    <GlassCard padding="md" class="border border-emerald-500/20">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label class="block font-semibold mb-1">Filtrar por Estado</label>
          <select
            v-model="filters.estado"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activos</option>
            <option value="CERRADO">Cerrados / Finalizados</option>
          </select>
        </div>

        <div>
          <label class="block font-semibold mb-1">Filtrar por Galpón</label>
          <select
            v-model="filters.galpon"
            class="w-full h-10 px-3 rounded-xl glass-pill bg-canvas text-primary border border-emerald-500/30"
            @change="loadData"
          >
            <option value="">Todos los galpones</option>
            <option v-for="g in galpones" :key="g.id" :value="g.id">{{ g.nombre }}</option>
          </select>
        </div>
      </div>
    </GlassCard>

    <LoadingSkeleton v-if="isLoading" type="cards" />

    <EmptyState
      v-else-if="lotes.length === 0"
      title="No hay lotes de aves registrados"
      description="Cree el primer lote para registrar recolección diaria de huevos, mortalidad y consumo de alimento."
      :action-text="authStore.isAdmin ? 'Crear primer lote' : ''"
      @action="showCreateModal = true"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard
        v-for="l in lotes"
        :key="l.id"
        padding="lg"
        hoverable
        class="border border-emerald-500/20 flex flex-col justify-between space-y-4"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              :class="l.estado === 'ACTIVO' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-gray-500/20 text-muted'"
            >
              {{ l.estado }}
            </span>
            <span class="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Semana {{ l.semana_vida }}
            </span>
          </div>

          <div>
            <RouterLink :to="`/lotes/${l.id}`" class="text-xl font-display font-bold text-primary hover:underline">
              {{ l.nombre }}
            </RouterLink>
            <p class="text-xs text-muted">{{ l.galpon_nombre || 'Galpón' }} · {{ l.linea_genetica }}</p>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <div class="glass-pill p-2 rounded-xl text-center">
              <span class="text-[10px] text-muted block">Aves Vivas</span>
              <strong class="text-sm font-bold">{{ formatNumber(l.aves_vivas, 0) }}</strong>
            </div>
            <div class="glass-pill p-2 rounded-xl text-center">
              <span class="text-[10px] text-muted block">Iniciales</span>
              <strong class="text-sm font-bold">{{ formatNumber(l.aves_iniciales, 0) }}</strong>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-glass-border flex items-center justify-between text-xs">
          <RouterLink
            :to="`/lotes/${l.id}`"
            class="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            Ver detalle completo →
          </RouterLink>

          <RouterLink
            v-if="l.estado === 'ACTIVO'"
            :to="`/registro?lote=${l.id}`"
            class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-[11px]"
          >
            Registrar hoy
          </RouterLink>
        </div>
      </GlassCard>
    </div>

    <!-- Modal Crear Lote -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-lg p-6 rounded-3xl glass-panel-elevated border border-emerald-500/30 space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between pb-2 border-b border-glass-border">
          <h2 class="text-lg font-bold text-primary">Crear Nuevo Lote de Aves</h2>
          <button type="button" class="text-muted hover:text-primary" @click="showCreateModal = false">✕</button>
        </div>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold mb-1">Nombre o código del lote *</label>
            <input
              v-model="createForm.nombre"
              type="text"
              placeholder="Ej: Lote 2026-A, Ponedoras Galpón 2"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold mb-1">Galpón asignado *</label>
              <select
                v-model="createForm.galpon"
                class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
              >
                <option :value="null" disabled>Seleccionar galpón</option>
                <option v-for="g in galpones" :key="g.id" :value="g.id">{{ g.nombre }}</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold mb-1">Línea genética</label>
              <input
                v-model="createForm.linea_genetica"
                type="text"
                placeholder="Ej: Hy-Line Brown, Isa Brown"
                class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block font-semibold mb-1">Fecha ingreso</label>
              <input
                v-model="createForm.fecha_ingreso"
                type="date"
                class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
              >
            </div>
            <div>
              <label class="block font-semibold mb-1">Edad inicial (sem)</label>
              <input
                v-model="createForm.edad_inicial_semanas"
                type="number"
                min="1"
                class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary font-mono"
              >
            </div>
            <div>
              <label class="block font-semibold mb-1">Aves iniciales</label>
              <input
                v-model="createForm.aves_iniciales"
                type="number"
                min="10"
                class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary font-mono"
              >
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-glass-border flex justify-end gap-2">
          <button type="button" class="px-3 py-1.5 text-xs text-muted" @click="showCreateModal = false">
            Cancelar
          </button>
          <AppButton variant="primary" size="sm" @click="handleCreateLote">
            Guardar Lote
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
