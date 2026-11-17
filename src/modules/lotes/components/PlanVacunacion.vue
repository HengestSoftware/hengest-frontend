<script setup>
import { ref, reactive, onMounted } from 'vue'
import vacunacionesApi from '@/api/vacunaciones'
import AppButton from '@/components/AppButton.vue'
import { formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  loteId: {
    type: [Number, String],
    required: true,
  },
})

const authStore = useAuthStore()
const toast = useToast()

const vacunaciones = ref([])
const isLoading = ref(true)
const showCreateModal = ref(false)
const showApplyModal = ref(false)
const selectedVacuna = ref(null)

const applyForm = reactive({
  fecha_aplicada: new Date().toISOString().split('T')[0],
  notas: '',
})

const createForm = reactive({
  vacuna: '',
  fecha_programada: '',
  notas: '',
})

async function loadVacunaciones() {
  isLoading.value = true
  try {
    const res = await vacunacionesApi.getVacunaciones({ lote: props.loteId })
    vacunaciones.value = Array.isArray(res) ? res : res.results || []
  } catch (err) {
    toast.error('Error al cargar plan de vacunación')
  } finally {
    isLoading.value = false
  }
}

function openApplyModal(vacuna) {
  selectedVacuna.value = vacuna
  applyForm.fecha_aplicada = new Date().toISOString().split('T')[0]
  applyForm.notas = ''
  showApplyModal.value = true
}

async function handleApply() {
  if (!selectedVacuna.value) return
  try {
    await vacunacionesApi.marcarAplicada(selectedVacuna.value.id, {
      fecha_aplicada: applyForm.fecha_aplicada,
      notas: applyForm.notas,
    })
    toast.success('Vacuna marcada como aplicada')
    showApplyModal.value = false
    loadVacunaciones()
  } catch (err) {
    toast.error('Error al marcar aplicación de vacuna')
  }
}

async function handleCreate() {
  if (!createForm.vacuna.trim() || !createForm.fecha_programada) {
    toast.error('Complete el nombre de la vacuna y la fecha programada')
    return
  }

  try {
    await vacunacionesApi.createVacunacion({
      lote: props.loteId,
      vacuna: createForm.vacuna.trim(),
      fecha_programada: createForm.fecha_programada,
      notas: createForm.notas,
    })
    toast.success('Vacuna programada con éxito')
    showCreateModal.value = false
    createForm.vacuna = ''
    createForm.fecha_programada = ''
    createForm.notas = ''
    loadVacunaciones()
  } catch (err) {
    toast.error('Error al programar vacuna')
  }
}

onMounted(() => {
  loadVacunaciones()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-bold text-primary">
        Plan Sanitario y Calendario de Vacunación
      </h3>

      <AppButton
        v-if="authStore.isAdmin"
        variant="primary"
        size="sm"
        @click="showCreateModal = true"
      >
        + Programar Vacuna
      </AppButton>
    </div>

    <div v-if="vacunaciones.length === 0 && !isLoading" class="p-8 text-center text-xs text-muted glass-panel rounded-2xl">
      No hay vacunas registradas para este lote.
    </div>

    <div v-else class="space-y-2.5">
      <div
        v-for="v in vacunaciones"
        :key="v.id"
        class="p-4 rounded-2xl glass-panel border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        :class="[
          v.estado === 'APLICADA'
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : v.estado === 'VENCIDA'
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-emerald-500/20',
        ]"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              :class="[
                v.estado === 'APLICADA'
                  ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : v.estado === 'VENCIDA'
                    ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
              ]"
            >
              {{ v.estado }}
            </span>
            <p class="text-sm font-bold text-primary">{{ v.vacuna }}</p>
          </div>

          <p class="text-xs text-secondary">
            Programada: <strong>{{ formatDate(v.fecha_programada) }}</strong>
            <span v-if="v.fecha_aplicada" class="ml-2 text-emerald-700 dark:text-emerald-300">
              · Aplicada: <strong>{{ formatDate(v.fecha_aplicada) }}</strong>
            </span>
          </p>

          <p v-if="v.notas" class="text-[11px] text-muted italic">
            Nota: {{ v.notas }}
          </p>
        </div>

        <div v-if="v.estado !== 'APLICADA'" class="shrink-0">
          <button
            type="button"
            class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
            @click="openApplyModal(v)"
          >
            Marcar aplicada
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Marcar Aplicada -->
    <div
      v-if="showApplyModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-md p-6 rounded-3xl glass-panel-elevated border border-emerald-500/30 space-y-4">
        <h3 class="text-base font-bold text-primary">
          Registrar Aplicación de Vacuna
        </h3>
        <p class="text-xs text-muted">{{ selectedVacuna?.vacuna }}</p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold mb-1">Fecha de aplicación *</label>
            <input
              v-model="applyForm.fecha_aplicada"
              type="date"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
          <div>
            <label class="block font-semibold mb-1">Observaciones o lote de frasco</label>
            <input
              v-model="applyForm.notas"
              type="text"
              placeholder="Ej: lote de biológico, cepa, vía ocular"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-3 py-1.5 text-xs text-muted" @click="showApplyModal = false">
            Cancelar
          </button>
          <AppButton variant="primary" size="sm" @click="handleApply">
            Confirmar aplicación
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Modal Crear Vacunación -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-md p-6 rounded-3xl glass-panel-elevated border border-emerald-500/30 space-y-4">
        <h3 class="text-base font-bold text-primary">
          Programar Nueva Vacunación
        </h3>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold mb-1">Nombre de la vacuna / biológico *</label>
            <input
              v-model="createForm.vacuna"
              type="text"
              placeholder="Ej: Newcastle + Bronquitis, Gumboro"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
          <div>
            <label class="block font-semibold mb-1">Fecha programada *</label>
            <input
              v-model="createForm.fecha_programada"
              type="date"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
          <div>
            <label class="block font-semibold mb-1">Notas técnicas</label>
            <input
              v-model="createForm.notas"
              type="text"
              placeholder="Vía de administración, laboratorio"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-3 py-1.5 text-xs text-muted" @click="showCreateModal = false">
            Cancelar
          </button>
          <AppButton variant="primary" size="sm" @click="handleCreate">
            Guardar en calendario
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
