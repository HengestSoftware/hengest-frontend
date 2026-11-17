<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import NumericInput from '@/components/NumericInput.vue'
import SeverityBadge from '@/components/SeverityBadge.vue'
import lotesApi from '@/api/lotes'
import galponesApi from '@/api/galpones'
import registrosApi from '@/api/registros'
import { calcularCubetas, formatearCubetasTexto, calcularTotalesCategorias } from '@/utils/cubetas'
import { getTodayBogota, formatNumber, formatPercent } from '@/utils/formatters'
import { generateClientUuid } from '@/utils/offlineQueue'
import { useOfflineStore } from '@/stores/offline'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const offlineStore = useOfflineStore()
const toast = useToast()

const lotes = ref([])
const galpones = ref([])
const isLoadingLotes = ref(true)
const isSubmitting = ref(false)
const existingRecordId = ref(null)
const backendCalculation = ref(null)

const form = reactive({
  lote: null,
  fecha: getTodayBogota(),
  aaa: 0,
  aa: 0,
  a: 0,
  b: 0,
  c: 0,
  alimento_kg: 0,
  mortalidad: 0,
  causa_mortalidad: '',
  descarte: 0,
  motivo_descarte: '',
  observaciones: '',
})

// Cálculo reactivo en vivo de cubetas y sueltos en cliente
const calculosEnVivo = computed(() => {
  return calcularTotalesCategorias({
    aaa: form.aaa,
    aa: form.aa,
    a: form.a,
    b: form.b,
    c: form.c,
  })
})

const selectedLoteObj = computed(() => {
  return lotes.value.find((l) => l.id === form.lote) || null
})

// Verificar si ya existe registro para ese lote y fecha
async function checkExistingRecord() {
  if (!form.lote || !form.fecha) return
  try {
    const res = await registrosApi.getRegistros({
      lote: form.lote,
      fecha_desde: form.fecha,
      fecha_hasta: form.fecha,
    })
    const list = Array.isArray(res) ? res : res.results || []
    if (list.length > 0) {
      const rec = list[0]
      existingRecordId.value = rec.id
      form.aaa = rec.aaa || 0
      form.aa = rec.aa || 0
      form.a = rec.a || 0
      form.b = rec.b || 0
      form.c = rec.c || 0
      form.alimento_kg = rec.alimento_kg || 0
      form.mortalidad = rec.mortalidad || 0
      form.causa_mortalidad = rec.causa_mortalidad || ''
      form.descarte = rec.descarte || 0
      form.motivo_descarte = rec.motivo_descarte || ''
      form.observaciones = rec.observaciones || ''
      toast.info('Se cargó el registro existente de esta fecha para edición')
    } else {
      existingRecordId.value = null
    }
  } catch (err) {
    // Si estamos offline o falla la red, no bloqueamos el formulario
  }
}

watch(() => [form.lote, form.fecha], () => {
  checkExistingRecord()
})

async function handleSubmit(e) {
  e.preventDefault()
  if (!form.lote) {
    toast.error('Seleccione un lote de aves')
    return
  }

  isSubmitting.value = true
  backendCalculation.value = null

  const client_uuid = generateClientUuid()
  const payload = {
    lote: form.lote,
    fecha: form.fecha,
    aaa: parseInt(form.aaa, 10) || 0,
    aa: parseInt(form.aa, 10) || 0,
    a: parseInt(form.a, 10) || 0,
    b: parseInt(form.b, 10) || 0,
    c: parseInt(form.c, 10) || 0,
    alimento_kg: parseFloat(form.alimento_kg) || 0,
    mortalidad: parseInt(form.mortalidad, 10) || 0,
    causa_mortalidad: form.causa_mortalidad || '',
    descarte: parseInt(form.descarte, 10) || 0,
    motivo_descarte: form.motivo_descarte || '',
    observaciones: form.observaciones || '',
    client_uuid,
  }

  // Si no hay red, guardar en cola local offline
  if (!offlineStore.isOnline) {
    offlineStore.queueRecord(payload)
    toast.success('✓ Guardado en el celular sin conexión. Se sincronizará automáticamente.')
    isSubmitting.value = false
    return
  }

  try {
    let result
    if (existingRecordId.value) {
      result = await registrosApi.updateRegistro(existingRecordId.value, payload)
      toast.success('Registro actualizado exitosamente')
    } else {
      result = await registrosApi.createRegistro(payload)
      toast.success('Registro guardado exitosamente')
    }
    backendCalculation.value = result
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    const errorMsg =
      err.response?.data?.detail ||
      err.response?.data?.non_field_errors?.[0] ||
      (err.response?.data && typeof err.response.data === 'object' ? Object.values(err.response.data).flat().join(', ') : null) ||
      'No fue posible guardar el registro. Se ha guardado en la cola local.'

    // Fallback a cola offline si hay error de red o timeout
    if (!err.response || err.code === 'ECONNABORTED') {
      offlineStore.queueRecord(payload)
      toast.info('Sin conexión con el servidor. Registro guardado en la cola local.')
    } else {
      toast.error(errorMsg)
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const [lotesRes, galponesRes] = await Promise.all([
      lotesApi.getLotes({ estado: 'ACTIVO' }),
      galponesApi.getGalpones(),
    ])
    lotes.value = Array.isArray(lotesRes) ? lotesRes : lotesRes.results || []
    galpones.value = Array.isArray(galponesRes) ? galponesRes : galponesRes.results || []

    // F-20: Soporte QR de Galpón /registro?galpon=<id> o ?lote=<id>
    const qrGalponId = route.query.galpon ? parseInt(route.query.galpon, 10) : null
    const qrLoteId = route.query.lote ? parseInt(route.query.lote, 10) : null

    if (qrLoteId) {
      form.lote = qrLoteId
    } else if (qrGalponId) {
      const loteGalpon = lotes.value.find((l) => l.galpon === qrGalponId)
      if (loteGalpon) {
        form.lote = loteGalpon.id
      }
    } else if (lotes.value.length > 0) {
      form.lote = lotes.value[0].id
    }
  } catch (err) {
    toast.error('Error al cargar la lista de lotes')
  } finally {
    isLoadingLotes.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Encabezado de la pantalla estrella -->
    <div>
      <div class="inline-flex items-center gap-2 glass-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
        <span>Pantalla de Galpón</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
        {{ existingRecordId ? 'Modificar Registro Diario' : 'Registro Diario Rápido' }}
      </h1>
      <p class="text-xs sm:text-sm text-secondary">
        Ingrese los huevos recolectados, alimento y bajas de hoy.
      </p>
    </div>

    <!-- Confirmación de cálculo del Backend tras guardar -->
    <GlassCard
      v-if="backendCalculation"
      elevated
      padding="lg"
      class="border border-emerald-500/40 bg-emerald-500/10 space-y-4 animate-fade-in"
    >
      <div class="flex items-center justify-between pb-3 border-b border-glass-border">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <h2 class="text-sm font-bold text-primary">
            ✓ Cálculo oficial confirmado por HENGEST
          </h2>
        </div>
        <button
          type="button"
          class="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
          @click="backendCalculation = null"
        >
          Ocultar
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="glass-pill p-2.5 rounded-xl">
          <p class="text-[10px] text-muted font-bold">Postura del día</p>
          <p class="text-lg font-bold text-primary tabular-nums">
            {{ formatPercent(backendCalculation.postura_pct) }}
          </p>
        </div>
        <div class="glass-pill p-2.5 rounded-xl">
          <p class="text-[10px] text-muted font-bold">Total cubetas 30</p>
          <p class="text-lg font-bold text-primary tabular-nums">
            {{ backendCalculation.total_cubetas }}
          </p>
        </div>
        <div class="glass-pill p-2.5 rounded-xl">
          <p class="text-[10px] text-muted font-bold">Consumo/Ave</p>
          <p class="text-lg font-bold text-primary tabular-nums">
            {{ formatNumber(backendCalculation.consumo_g_ave) }} g
          </p>
        </div>
        <div class="glass-pill p-2.5 rounded-xl">
          <p class="text-[10px] text-muted font-bold">Conversión docena</p>
          <p class="text-lg font-bold text-primary tabular-nums">
            {{ formatNumber(backendCalculation.conversion_alimenticia, 2) }}
          </p>
        </div>
      </div>

      <!-- Alertas generadas por este registro -->
      <div v-if="backendCalculation.alertas && backendCalculation.alertas.length > 0" class="space-y-2 pt-2">
        <p class="text-xs font-bold text-amber-800 dark:text-amber-300">
          Alertas detectadas en este registro:
        </p>
        <div
          v-for="alerta in backendCalculation.alertas"
          :key="alerta.id"
          class="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs flex items-center justify-between"
        >
          <span>{{ alerta.mensaje }}</span>
          <SeverityBadge :severity="alerta.severidad" size="sm" />
        </div>
      </div>
    </GlassCard>

    <!-- Formulario rápido móvil -->
    <form novalidate class="space-y-6" @submit="handleSubmit">
      <!-- Sección 1: Selección de Lote y Fecha -->
      <GlassCard padding="lg" class="border border-emerald-500/25 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Selector de Lote -->
          <div class="space-y-1.5">
            <label for="reg-lote" class="block text-xs font-semibold text-primary">
              Lote de aves *
            </label>
            <select
              id="reg-lote"
              v-model="form.lote"
              required
              class="w-full h-12 px-4 rounded-xl glass-pill bg-canvas text-primary font-semibold text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option :value="null" disabled>Seleccione un lote</option>
              <option v-for="l in lotes" :key="l.id" :value="l.id">
                {{ l.nombre }} ({{ l.galpon_nombre || 'Galpón' }}) · {{ l.aves_vivas }} aves
              </option>
            </select>
          </div>

          <!-- Selector de Fecha -->
          <div class="space-y-1.5">
            <label for="reg-fecha" class="block text-xs font-semibold text-primary">
              Fecha de recolección *
            </label>
            <input
              id="reg-fecha"
              v-model="form.fecha"
              type="date"
              required
              class="w-full h-12 px-4 rounded-xl glass-pill bg-canvas text-primary font-semibold text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none transition-colors"
            >
          </div>
        </div>

        <div v-if="selectedLoteObj" class="p-3 rounded-xl bg-emerald-500/10 text-xs flex items-center justify-between">
          <span>Línea genética: <strong>{{ selectedLoteObj.linea_genetica }}</strong></span>
          <span>Semana de vida: <strong>{{ selectedLoteObj.semana_vida }}</strong></span>
        </div>
      </GlassCard>

      <!-- Sección 2: Recolección de Huevos por Categoría (AAA, AA, A, B, C) -->
      <GlassCard padding="lg" class="border border-emerald-500/25 space-y-5">
        <div class="flex items-center justify-between border-b border-glass-border pb-3">
          <div>
            <h2 class="text-base font-display font-bold text-primary">
              Huevos Recolectados
            </h2>
            <p class="text-xs text-muted">
              Ingrese las unidades por categoría. HENGEST calculará las cubetas.
            </p>
          </div>
          <span class="glass-pill text-xs font-bold px-3 py-1 rounded-full text-emerald-800 dark:text-emerald-300">
            Cubetas de 30
          </span>
        </div>

        <!-- Categoría AAA -->
        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 space-y-1.5">
          <NumericInput
            v-model="form.aaa"
            label="Categoría AAA"
            :sublabel="formatearCubetasTexto(form.aaa)"
            :step="10"
            unit="huevos"
          />
        </div>

        <!-- Categoría AA (Principal) -->
        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/35 ring-1 ring-emerald-500/20 space-y-1.5">
          <NumericInput
            v-model="form.aa"
            label="Categoría AA (Principal)"
            :sublabel="formatearCubetasTexto(form.aa)"
            :step="30"
            unit="huevos"
          />
        </div>

        <!-- Categoría A -->
        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 space-y-1.5">
          <NumericInput
            v-model="form.a"
            label="Categoría A"
            :sublabel="formatearCubetasTexto(form.a)"
            :step="10"
            unit="huevos"
          />
        </div>

        <!-- Categoría B -->
        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 space-y-1.5">
          <NumericInput
            v-model="form.b"
            label="Categoría B"
            :sublabel="formatearCubetasTexto(form.b)"
            :step="10"
            unit="huevos"
          />
        </div>

        <!-- Categoría C -->
        <div class="p-3 rounded-2xl glass-pill border border-emerald-500/20 space-y-1.5">
          <NumericInput
            v-model="form.c"
            label="Categoría C"
            :sublabel="formatearCubetasTexto(form.c)"
            :step="5"
            unit="huevos"
          />
        </div>

        <!-- RESUMEN EN VIVO DE CUBETAS CALCULADAS -->
        <div class="p-4 rounded-2xl bg-emerald-950/10 dark:bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-primary">Vista previa de cubetas completas:</p>
            <p class="text-xs text-muted">
              {{ calculosEnVivo.total_sueltos }} huevo(s) suelto(s) restante(s)
            </p>
          </div>
          <div class="text-right">
            <p class="text-2xl font-display font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {{ calculosEnVivo.total_cubetas }} <span class="text-xs font-normal">cubetas</span>
            </p>
            <span class="text-[11px] font-semibold text-secondary">
              {{ calculosEnVivo.total_huevos }} huevos totales
            </span>
          </div>
        </div>
      </GlassCard>

      <!-- Sección 3: Alimento, Mortalidad y Descarte -->
      <GlassCard padding="lg" class="border border-emerald-500/25 space-y-5">
        <h2 class="text-base font-display font-bold text-primary border-b border-glass-border pb-3">
          Alimento y Manejo del Lote
        </h2>

        <!-- Alimento servido (kg) -->
        <div class="space-y-1.5">
          <label for="reg-alimento" class="block text-xs font-semibold text-primary">
            Alimento concentrado servido hoy (kg) *
          </label>
          <div class="relative">
            <input
              id="reg-alimento"
              v-model="form.alimento_kg"
              type="number"
              step="0.5"
              min="0"
              required
              inputmode="decimal"
              class="w-full h-12 px-4 rounded-xl glass-pill bg-canvas text-primary font-bold text-lg font-mono tabular-nums border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted pointer-events-none">
              kilogramos
            </span>
          </div>
        </div>

        <!-- Mortalidad -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericInput
            v-model="form.mortalidad"
            label="Mortalidad (Aves muertas hoy)"
            :step="1"
            unit="aves"
          />
          <div class="space-y-1.5">
            <label for="reg-causa-mortalidad" class="block text-xs font-semibold text-primary">
              Causa de mortalidad (opcional)
            </label>
            <input
              id="reg-causa-mortalidad"
              v-model="form.causa_mortalidad"
              type="text"
              placeholder="Ej: calor, asfixia, prolapso"
              class="w-full h-12 px-4 rounded-xl glass-pill bg-canvas text-primary text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
            >
          </div>
        </div>

        <!-- Descarte -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumericInput
            v-model="form.descarte"
            label="Descarte (Aves retiradas hoy)"
            :step="1"
            unit="aves"
          />
          <div class="space-y-1.5">
            <label for="reg-motivo-descarte" class="block text-xs font-semibold text-primary">
              Motivo de descarte (opcional)
            </label>
            <input
              id="reg-motivo-descarte"
              v-model="form.motivo_descarte"
              type="text"
              placeholder="Ej: no postura, fractura"
              class="w-full h-12 px-4 rounded-xl glass-pill bg-canvas text-primary text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
            >
          </div>
        </div>

        <!-- Observaciones -->
        <div class="space-y-1.5">
          <label for="reg-observaciones" class="block text-xs font-semibold text-primary">
            Observaciones del galpón
          </label>
          <textarea
            id="reg-observaciones"
            v-model="form.observaciones"
            rows="2"
            placeholder="Novedades de tolvas, bebederos, clima o comportamiento de las aves"
            class="w-full p-3 rounded-xl glass-pill bg-canvas text-primary text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </GlassCard>

      <!-- Botón de guardado fijo o visible -->
      <div class="pt-2">
        <AppButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="isSubmitting"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span>{{ isSubmitting ? 'Guardando registro...' : (existingRecordId ? 'Actualizar registro del día' : 'Guardar recolección diaria') }}</span>
        </AppButton>
      </div>
    </form>
  </div>
</template>
