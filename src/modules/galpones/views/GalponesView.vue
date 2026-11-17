<script setup>
import { ref, reactive, onMounted } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import galponesApi from '@/api/galpones'
import { formatNumber } from '@/utils/formatters'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const galpones = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const editingId = ref(null)

const form = reactive({
  nombre: '',
  capacidad: 3000,
  activo: true,
})

async function loadGalpones() {
  isLoading.value = true
  try {
    const res = await galponesApi.getGalpones()
    galpones.value = Array.isArray(res) ? res : res.results || []
  } catch (err) {
    toast.error('Error al cargar galpones')
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  editingId.value = null
  form.nombre = ''
  form.capacidad = 3000
  form.activo = true
  showModal.value = true
}

function openEditModal(galpon) {
  editingId.value = galpon.id
  form.nombre = galpon.nombre
  form.capacidad = galpon.capacidad
  form.activo = galpon.activo
  showModal.value = true
}

async function handleSave() {
  if (!form.nombre.trim()) {
    toast.error('Ingrese el nombre del galpón')
    return
  }

  try {
    if (editingId.value) {
      await galponesApi.updateGalpon(editingId.value, {
        nombre: form.nombre.trim(),
        capacidad: parseInt(form.capacidad, 10) || 0,
        activo: form.activo,
      })
      toast.success('Galpón actualizado')
    } else {
      await galponesApi.createGalpon({
        nombre: form.nombre.trim(),
        capacidad: parseInt(form.capacidad, 10) || 0,
        activo: true,
      })
      toast.success('Galpón creado exitosamente')
    }
    showModal.value = false
    loadGalpones()
  } catch (err) {
    toast.error(err.response?.data?.nombre?.[0] || 'Error al guardar el galpón')
  }
}

async function handleToggleActivo(galpon) {
  if (!authStore.isAdmin) return
  const accion = galpon.activo ? 'desactivar' : 'activar'
  if (!confirm(`¿Desea ${accion} el ${galpon.nombre}?`)) return

  try {
    await galponesApi.updateGalpon(galpon.id, { activo: !galpon.activo })
    toast.success(`Galpón ${galpon.activo ? 'desactivado' : 'activado'}`)
    loadGalpones()
  } catch (err) {
    toast.error('Error al cambiar el estado del galpón')
  }
}

onMounted(() => {
  loadGalpones()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
          Gestión de Galpones
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Infraestructura física y capacidad de alojamiento de aves
        </p>
      </div>

      <AppButton
        v-if="authStore.isAdmin"
        variant="primary"
        size="md"
        @click="openCreateModal"
      >
        + Nuevo Galpón
      </AppButton>
    </div>

    <LoadingSkeleton v-if="isLoading" type="cards" />

    <EmptyState
      v-else-if="galpones.length === 0"
      title="Aún no hay galpones registrados"
      description="Configure los galpones de su granja para poder alojar los lotes de aves ponedoras."
      :action-text="authStore.isAdmin ? 'Crear primer galpón' : ''"
      @action="openCreateModal"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard
        v-for="g in galpones"
        :key="g.id"
        padding="lg"
        hoverable
        class="border border-emerald-500/20 flex flex-col justify-between space-y-4"
      >
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              :class="g.activo ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-gray-500/20 text-muted'"
            >
              {{ g.activo ? 'Activo' : 'Inactivo' }}
            </span>

            <RouterLink
              :to="`/registro?galpon=${g.id}`"
              class="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              title="Enlace para QR adhesivo"
            >
              <span>QR Galpón</span>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM14.625 3.75h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5c0-.621.504-1.125 1.125-1.125z" />
              </svg>
            </RouterLink>
          </div>

          <h2 class="text-xl font-display font-bold text-primary">
            {{ g.nombre }}
          </h2>

          <p class="text-xs text-secondary">
            Capacidad: <strong>{{ formatNumber(g.capacidad, 0) }} aves</strong>
          </p>
        </div>

        <div v-if="authStore.isAdmin" class="pt-3 border-t border-glass-border flex items-center justify-between text-xs">
          <button
            type="button"
            class="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            @click="openEditModal(g)"
          >
            Editar datos
          </button>

          <button
            type="button"
            class="text-rose-600 dark:text-rose-400 font-medium hover:underline"
            @click="handleToggleActivo(g)"
          >
            {{ g.activo ? 'Desactivar' : 'Activar' }}
          </button>
        </div>
      </GlassCard>
    </div>

    <!-- Modal Crear / Editar Galpón -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-md">
        <GlassCard elevated padding="lg" class="border border-emerald-500/30 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-glass-border">
            <h2 class="text-lg font-bold text-primary">
              {{ editingId ? 'Editar Galpón' : 'Nuevo Galpón' }}
            </h2>
            <button type="button" class="text-muted hover:text-primary" @click="showModal = false">✕</button>
          </div>

          <div class="space-y-4 text-xs">
            <div class="space-y-1">
              <label class="block font-semibold text-primary">Nombre del galpón *</label>
              <input
                v-model="form.nombre"
                type="text"
                placeholder="Ej: Galpón 1, Galpón Norte"
                class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-sm text-primary border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
              >
            </div>

            <div class="space-y-1">
              <label class="block font-semibold text-primary">Capacidad máxima de aves *</label>
              <input
                v-model="form.capacidad"
                type="number"
                min="100"
                step="100"
                class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-sm text-primary font-mono tabular-nums border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
              >
            </div>

            <div v-if="editingId" class="flex items-center gap-2 pt-1">
              <input
                id="modal-galpon-activo"
                v-model="form.activo"
                type="checkbox"
                class="rounded text-emerald-600 focus:ring-emerald-500"
              >
              <label for="modal-galpon-activo" class="font-medium text-primary">Galpón activo y disponible para alojar lotes</label>
            </div>
          </div>

          <div class="pt-4 border-t border-glass-border flex justify-end gap-2">
            <AppButton variant="secondary" size="sm" @click="showModal = false">
              Cancelar
            </AppButton>
            <AppButton variant="primary" size="sm" @click="handleSave">
              Guardar galpón
            </AppButton>
          </div>
        </GlassCard>
      </div>
    </div>
  </div>
</template>
