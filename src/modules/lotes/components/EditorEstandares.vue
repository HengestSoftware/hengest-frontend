<script setup>
import { ref, onMounted } from 'vue'
import lotesApi from '@/api/lotes'
import AppButton from '@/components/AppButton.vue'
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

const estandares = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const showPasteModal = ref(false)
const pasteText = ref('')

async function loadEstandares() {
  isLoading.value = true
  try {
    const data = await lotesApi.getLoteEstandares(props.loteId)
    estandares.value = Array.isArray(data) ? data : []
    // Si está vacío, generar plantilla base sugerida
    if (estandares.value.length === 0) {
      generarPlantillaBase()
    }
  } catch (err) {
    toast.error('Error al cargar estándares del lote')
  } finally {
    isLoading.value = false
  }
}

function generarPlantillaBase() {
  const base = []
  for (let s = 18; s <= 45; s++) {
    // Estimación progresiva típica para ponedoras
    let postura = 0
    if (s >= 19 && s <= 22) postura = (s - 18) * 20
    else if (s > 22 && s <= 35) postura = 92 - (s - 23) * 0.4
    else if (s > 35) postura = 87 - (s - 35) * 0.5

    base.push({
      semana: s,
      postura_esperada_pct: Math.max(0, Math.min(95, parseFloat(postura.toFixed(1)))),
      mortalidad_max_semanal_pct: 0.15,
      consumo_g_ave_dia: s < 22 ? 100 : 112,
    })
  }
  estandares.value = base
}

function addRow() {
  const lastSemana = estandares.value.length > 0
    ? Math.max(...estandares.value.map((e) => e.semana || 0))
    : 17
  estandares.value.push({
    semana: lastSemana + 1,
    postura_esperada_pct: 90.0,
    mortalidad_max_semanal_pct: 0.15,
    consumo_g_ave_dia: 112.0,
  })
}

function removeRow(index) {
  estandares.value.splice(index, 1)
}

function handleCsvUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    parseDelimitedText(content)
  }
  reader.readAsText(file)
}

function parseDelimitedText(raw) {
  try {
    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0)
    const parsed = []

    for (const line of lines) {
      // Ignorar cabecera si contiene palabras
      if (line.toLowerCase().includes('semana') || line.toLowerCase().includes('postura')) continue

      // Separador coma, punto y coma o tabulación
      const cols = line.split(/[,;\t]/).map((c) => c.trim().replace(',', '.'))
      if (cols.length >= 4) {
        parsed.push({
          semana: parseInt(cols[0], 10) || 0,
          postura_esperada_pct: parseFloat(cols[1]) || 0,
          mortalidad_max_semanal_pct: parseFloat(cols[2]) || 0,
          consumo_g_ave_dia: parseFloat(cols[3]) || 0,
        })
      }
    }

    if (parsed.length > 0) {
      estandares.value = parsed.sort((a, b) => a.semana - b.semana)
      showPasteModal.value = false
      pasteText.value = ''
      toast.success(`Se importaron ${parsed.length} semanas de estándares`)
    } else {
      toast.error('No se detectaron datos válidos en el archivo/texto pegado')
    }
  } catch {
    toast.error('Error al procesar el archivo o texto')
  }
}

async function handleSave() {
  isSaving.value = true
  try {
    // Sanitizar y validar
    const cleanList = estandares.value.map((e) => ({
      semana: parseInt(e.semana, 10),
      postura_esperada_pct: parseFloat(e.postura_esperada_pct) || 0,
      mortalidad_max_semanal_pct: parseFloat(e.mortalidad_max_semanal_pct) || 0,
      consumo_g_ave_dia: parseFloat(e.consumo_g_ave_dia) || 0,
    }))

    await lotesApi.updateLoteEstandares(props.loteId, cleanList)
    toast.success('Curva de estándares guardada exitosamente')
  } catch (err) {
    toast.error('Error al guardar estándares')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadEstandares()
})
</script>

<template>
  <div class="space-y-4">
    <!-- Barra superior de ayuda y acciones -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
      <div>
        <p class="font-bold text-primary">
          Guía técnica de la línea genética
        </p>
        <p class="text-secondary leading-relaxed">
          Los valores por semana deben tomarse del manual de la línea (Hy-Line, Isa Brown, Lohmann) y validarse con el zootecnista para la generación precisa de alertas.
        </p>
      </div>

      <div v-if="authStore.isAdmin" class="flex items-center gap-2 shrink-0">
        <label class="px-3 py-1.5 rounded-xl glass-pill font-bold text-xs text-primary hover:bg-emerald-500/20 cursor-pointer">
          <span>Importar CSV</span>
          <input type="file" accept=".csv,.txt" class="hidden" @change="handleCsvUpload">
        </label>
        <button
          type="button"
          class="px-3 py-1.5 rounded-xl glass-pill font-bold text-xs text-primary hover:bg-emerald-500/20 cursor-pointer"
          @click="showPasteModal = true"
        >
          Pegar de Excel
        </button>
      </div>
    </div>

    <!-- Tabla editable de estándares -->
    <div class="overflow-x-auto rounded-2xl glass-panel border border-emerald-500/20 max-h-96 overflow-y-auto">
      <table class="w-full text-left text-xs">
        <thead class="sticky top-0 bg-canvas/95 backdrop-blur text-muted uppercase tracking-wider font-bold border-b border-glass-border">
          <tr>
            <th class="p-3">Semana de vida</th>
            <th class="p-3">Postura Esperada (%)</th>
            <th class="p-3">Mortalidad Máx. Semanal (%)</th>
            <th class="p-3">Consumo Esperado (g/ave/día)</th>
            <th v-if="authStore.isAdmin" class="p-3 text-right">Quitar</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-glass-border/40 font-mono">
          <tr v-for="(row, idx) in estandares" :key="idx" class="hover:bg-emerald-500/5">
            <td class="p-2.5 font-bold">
              <input
                v-model="row.semana"
                type="number"
                :disabled="!authStore.isAdmin"
                class="w-16 h-8 px-2 rounded-lg bg-canvas border border-emerald-500/20 text-center font-bold text-primary"
              >
            </td>
            <td class="p-2.5">
              <input
                v-model="row.postura_esperada_pct"
                type="number"
                step="0.1"
                min="0"
                max="100"
                :disabled="!authStore.isAdmin"
                class="w-24 h-8 px-2 rounded-lg bg-canvas border border-emerald-500/20 text-center text-primary"
              >
            </td>
            <td class="p-2.5">
              <input
                v-model="row.mortalidad_max_semanal_pct"
                type="number"
                step="0.01"
                min="0"
                max="10"
                :disabled="!authStore.isAdmin"
                class="w-24 h-8 px-2 rounded-lg bg-canvas border border-emerald-500/20 text-center text-primary"
              >
            </td>
            <td class="p-2.5">
              <input
                v-model="row.consumo_g_ave_dia"
                type="number"
                step="0.5"
                min="0"
                max="250"
                :disabled="!authStore.isAdmin"
                class="w-24 h-8 px-2 rounded-lg bg-canvas border border-emerald-500/20 text-center text-primary"
              >
            </td>
            <td v-if="authStore.isAdmin" class="p-2.5 text-right">
              <button
                type="button"
                class="text-rose-600 hover:text-rose-800 p-1 text-sm cursor-pointer"
                title="Quitar semana"
                @click="removeRow(idx)"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Acciones al pie -->
    <div v-if="authStore.isAdmin" class="flex items-center justify-between pt-2">
      <button
        type="button"
        class="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
        @click="addRow"
      >
        + Añadir semana siguiente
      </button>

      <AppButton
        variant="primary"
        size="md"
        :disabled="isSaving"
        @click="handleSave"
      >
        {{ isSaving ? 'Guardando...' : 'Guardar estándares del lote' }}
      </AppButton>
    </div>

    <!-- Modal para pegar desde Excel -->
    <div
      v-if="showPasteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-md p-6 rounded-3xl glass-panel-elevated border border-emerald-500/30 space-y-3">
        <h3 class="text-base font-bold text-primary">Pegar datos desde Excel / Hoja de cálculo</h3>
        <p class="text-xs text-muted">
          Copie 4 columnas: Semana, Postura %, Mortalidad Max %, Consumo g y péguelas aquí:
        </p>
        <textarea
          v-model="pasteText"
          rows="6"
          placeholder="18	60.0	0.15	105&#10;19	80.0	0.15	110"
          class="w-full p-3 rounded-xl bg-canvas text-xs font-mono border border-emerald-500/30"
        />
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-3 py-1.5 text-xs text-muted" @click="showPasteModal = false">
            Cancelar
          </button>
          <AppButton variant="primary" size="sm" @click="parseDelimitedText(pasteText)">
            Procesar columnas
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
