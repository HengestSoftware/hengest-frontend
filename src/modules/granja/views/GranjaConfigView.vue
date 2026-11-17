<script setup>
import { reactive, onMounted } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import { useGranjaStore } from '@/stores/granja'
import { useToast } from '@/composables/useToast'

const granjaStore = useGranjaStore()
const toast = useToast()

const form = reactive({
  nombre: '',
  municipio: '',
  dias_edicion_operario: 3,
  umbral_postura_pts: 5,
  umbral_postura_critico_pts: 10,
  umbral_consumo_pct: 15,
  umbral_consumo_critico_pct: 25,
  umbral_mortalidad_diaria_pct: 0.15,
})

async function loadData() {
  try {
    const g = await granjaStore.fetchGranja()
    if (g) {
      form.nombre = g.nombre || ''
      form.municipio = g.municipio || ''
      form.dias_edicion_operario = g.dias_edicion_operario ?? 3
      form.umbral_postura_pts = g.umbral_postura_pts ?? 5
      form.umbral_postura_critico_pts = g.umbral_postura_critico_pts ?? 10
      form.umbral_consumo_pct = g.umbral_consumo_pct ?? 15
      form.umbral_consumo_critico_pct = g.umbral_consumo_critico_pct ?? 25
      form.umbral_mortalidad_diaria_pct = g.umbral_mortalidad_diaria_pct ?? 0.15
    }
  } catch (err) {
    toast.error('Error al cargar configuración de la granja')
  }
}

async function handleSave() {
  try {
    await granjaStore.updateGranja({
      nombre: form.nombre.trim(),
      municipio: form.municipio.trim(),
      dias_edicion_operario: parseInt(form.dias_edicion_operario, 10),
      umbral_postura_pts: parseFloat(form.umbral_postura_pts),
      umbral_postura_critico_pts: parseFloat(form.umbral_postura_critico_pts),
      umbral_consumo_pct: parseFloat(form.umbral_consumo_pct),
      umbral_consumo_critico_pct: parseFloat(form.umbral_consumo_critico_pct),
      umbral_mortalidad_diaria_pct: parseFloat(form.umbral_mortalidad_diaria_pct),
    })
    toast.success('Configuración guardada exitosamente')
  } catch (err) {
    toast.error('Error al actualizar datos de la granja')
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <div>
      <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
        Configuración de la Granja
      </h1>
      <p class="text-xs sm:text-sm text-secondary">
        Parámetros operativos y umbrales para el semáforo y motor de alertas
      </p>
    </div>

    <LoadingSkeleton v-if="granjaStore.isLoading && !granjaStore.granja" type="cards" />

    <form v-else class="space-y-6" @submit.prevent="handleSave">
      <!-- Datos generales de la granja -->
      <GlassCard padding="lg" class="border border-emerald-500/20 space-y-4">
        <h2 class="text-base font-bold text-primary border-b border-glass-border pb-2">
          Datos de la Granja
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="space-y-1">
            <label class="block font-semibold">Nombre de la Granja *</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-sm text-primary border border-emerald-500/30"
            >
          </div>

          <div class="space-y-1">
            <label class="block font-semibold">Municipio / Ubicación</label>
            <input
              v-model="form.municipio"
              type="text"
              class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-sm text-primary border border-emerald-500/30"
            >
          </div>
        </div>

        <div class="space-y-1 text-xs pt-2">
          <label class="block font-semibold">Días permitidos para edición por operario</label>
          <div class="flex items-center gap-3">
            <input
              v-model="form.dias_edicion_operario"
              type="number"
              min="1"
              max="15"
              class="w-24 h-11 px-3 rounded-xl glass-pill bg-canvas text-sm text-primary font-mono text-center border border-emerald-500/30"
            >
            <span class="text-muted leading-tight">
              (Por defecto 3 días. Tras este plazo, solo el administrador puede modificar recolecciones pasadas).
            </span>
          </div>
        </div>
      </GlassCard>

      <!-- Umbrales de Alertas con explicaciones claras -->
      <GlassCard padding="lg" class="border border-emerald-500/20 space-y-5">
        <div>
          <h2 class="text-base font-bold text-primary">
            Umbrales del Motor de Alertas
          </h2>
          <p class="text-xs text-muted">
            Configuran cuándo el sistema genera advertencias o alertas críticas ante variaciones de producción.
          </p>
        </div>

        <!-- Postura -->
        <div class="p-4 rounded-2xl glass-pill space-y-3">
          <h3 class="text-xs font-bold text-primary uppercase tracking-wider">
            1. Desviación en Tasa de Postura
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold mb-1">Advertencia (puntos porcentuales)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="form.umbral_postura_pts"
                  type="number"
                  step="0.5"
                  class="w-24 h-10 px-3 rounded-xl bg-canvas border border-emerald-500/30 font-mono text-center"
                >
                <span class="text-muted">pts (Por defecto: 5)</span>
              </div>
            </div>
            <div>
              <label class="block font-semibold mb-1">Crítica (puntos porcentuales)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="form.umbral_postura_critico_pts"
                  type="number"
                  step="0.5"
                  class="w-24 h-10 px-3 rounded-xl bg-canvas border border-emerald-500/30 font-mono text-center text-rose-600 font-bold"
                >
                <span class="text-muted">pts (Por defecto: 10)</span>
              </div>
            </div>
          </div>
          <p class="text-[11px] text-muted">
            Si la postura real cae estos puntos por debajo de la curva esperada de la semana, se activa la alerta.
          </p>
        </div>

        <!-- Consumo de Alimento -->
        <div class="p-4 rounded-2xl glass-pill space-y-3">
          <h3 class="text-xs font-bold text-primary uppercase tracking-wider">
            2. Variación en Consumo de Alimento
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold mb-1">Advertencia (% de variación)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="form.umbral_consumo_pct"
                  type="number"
                  step="1"
                  class="w-24 h-10 px-3 rounded-xl bg-canvas border border-emerald-500/30 font-mono text-center"
                >
                <span class="text-muted">% (Por defecto: 15%)</span>
              </div>
            </div>
            <div>
              <label class="block font-semibold mb-1">Crítica (% de variación)</label>
              <div class="flex items-center gap-2">
                <input
                  v-model="form.umbral_consumo_critico_pct"
                  type="number"
                  step="1"
                  class="w-24 h-10 px-3 rounded-xl bg-canvas border border-emerald-500/30 font-mono text-center text-rose-600 font-bold"
                >
                <span class="text-muted">% (Por defecto: 25%)</span>
              </div>
            </div>
          </div>
          <p class="text-[11px] text-muted">
            Variación respecto al consumo estimado por ave/día para detectar tolvas vacías o rechazo de concentrado.
          </p>
        </div>

        <!-- Mortalidad -->
        <div class="p-4 rounded-2xl glass-pill space-y-3">
          <h3 class="text-xs font-bold text-primary uppercase tracking-wider">
            3. Mortalidad Diaria Atípica
          </h3>
          <div class="text-xs">
            <label class="block font-semibold mb-1">Umbral crítico de bajas del día (% del censo)</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.umbral_mortalidad_diaria_pct"
                type="number"
                step="0.01"
                class="w-24 h-10 px-3 rounded-xl bg-canvas border border-emerald-500/30 font-mono text-center text-rose-600 font-bold"
              >
              <span class="text-muted">% diario (Por defecto: 0.15% del total de aves vivas)</span>
            </div>
          </div>
          <p class="text-[11px] text-muted">
            En un lote de 5.000 aves, un 0.15% equivale a más de 7 bajas en un solo día, encendiendo el semáforo rojo.
          </p>
        </div>
      </GlassCard>

      <div class="flex justify-end">
        <AppButton variant="primary" size="lg" type="submit" :disabled="granjaStore.isLoading">
          Guardar cambios de configuración
        </AppButton>
      </div>
    </form>
  </div>
</template>
