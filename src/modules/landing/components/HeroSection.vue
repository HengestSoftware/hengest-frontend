<script setup>
import { ref, onMounted } from 'vue'
import AppButton from '@/components/AppButton.vue'
import GlassCard from '@/components/GlassCard.vue'

// Estado para la animación de la cubeta de 30 huevos
const isEggTrayFilled = ref(false)
const filledEggsCount = ref(0)
const animationKey = ref(0)

function runTrayAnimation() {
  filledEggsCount.value = 0
  isEggTrayFilled.value = false
  animationKey.value++

  let current = 0
  const interval = setInterval(() => {
    current++
    filledEggsCount.value = current
    if (current >= 30) {
      clearInterval(interval)
      isEggTrayFilled.value = true
    }
  }, 45)
}

onMounted(() => {
  // Pequeña espera para una entrada suave tras el render inicial
  setTimeout(() => {
    runTrayAnimation()
  }, 300)
})
</script>

<template>
  <section class="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- Columna de texto (Hero) -->
        <div class="lg:col-span-6 space-y-6 text-left">
          <!-- Pastilla de contexto sectorial -->
          <div class="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Avicultura de huevo comercial · Control integral de galpones</span>
          </div>

          <!-- Titular potente con carácter -->
          <h1 class="text-3xl sm:text-5xl lg:text-[3.25rem] font-display font-bold text-primary tracking-tight leading-[1.12]">
            Deje el cuaderno del galpón en el pasado.
            <span class="block text-emerald-700 dark:text-emerald-400 mt-2">
              Controle su producción desde el celular.
            </span>
          </h1>

          <!-- Subtítulo de una frase clara -->
          <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-xl">
            La plataforma web creada para que avicultores, mayordomos y asesores técnicos registren postura diaria, mortalidad y consumo de alimento sin perder datos ni horas haciendo cuentas a mano.
          </p>

          <!-- Botones de llamado a la acción -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <AppButton
              variant="primary"
              size="lg"
              to="/registro"
            >
              <span>Registrar mi granja</span>
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </AppButton>

            <AppButton
              variant="secondary"
              size="lg"
              to="/login"
            >
              Iniciar sesión
            </AppButton>
          </div>

          <!-- Micro-garantías orientadas al campo -->
          <div class="pt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Conversión automática a cubetas de 30</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Manejo de mortalidad y vacunación</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span>Diseñado para celular Android</span>
            </div>
          </div>
        </div>

        <!-- Columna visual: Tarjeta-panel de cristal que simula el sistema real -->
        <div class="lg:col-span-6">
          <div class="relative mx-auto max-w-lg lg:max-w-none">
            <!-- Resplandor exterior orgánico -->
            <div
              class="absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 to-lime-400/20 rounded-3xl blur-2xl pointer-events-none"
              aria-hidden="true"
            />

            <GlassCard
              elevated
              padding="lg"
              class="relative border border-emerald-500/30 shadow-2xl backdrop-blur-xl"
            >
              <!-- Cabecera del panel simulado -->
              <div class="flex items-center justify-between pb-4 border-b border-glass-border">
                <div class="flex items-center gap-2.5">
                  <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <h2 class="text-xs sm:text-sm font-semibold text-primary">
                      Panel de Galpón · Lote 04 (Isa Brown)
                    </h2>
                    <p class="text-[11px] text-muted">
                      Semana 34 de vida · 5,200 aves alojadas
                    </p>
                  </div>
                </div>
                <span class="glass-pill text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full text-emerald-800 dark:text-emerald-300">
                  Ejemplo en vivo
                </span>
              </div>

              <!-- Fila de métricas clave con estilo tabular -->
              <div class="grid grid-cols-3 gap-2.5 sm:gap-3 py-4">
                <div class="glass-pill p-2.5 sm:p-3 rounded-xl">
                  <p class="text-[10px] sm:text-xs text-muted font-medium">Tasa de postura</p>
                  <p class="text-lg sm:text-2xl font-bold text-primary tabular-nums">
                    88.4%
                  </p>
                  <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    ▲ +1.8% hoy
                  </span>
                </div>

                <div class="glass-pill p-2.5 sm:p-3 rounded-xl">
                  <p class="text-[10px] sm:text-xs text-muted font-medium">Mortalidad</p>
                  <p class="text-lg sm:text-2xl font-bold text-primary tabular-nums">
                    2 <span class="text-xs font-normal text-muted">aves</span>
                  </p>
                  <span class="text-[10px] font-medium text-muted">
                    0.04% normal
                  </span>
                </div>

                <div class="glass-pill p-2.5 sm:p-3 rounded-xl">
                  <p class="text-[10px] sm:text-xs text-muted font-medium">Alimento diario</p>
                  <p class="text-lg sm:text-2xl font-bold text-primary tabular-nums">
                    112 <span class="text-xs font-normal text-muted">g/ave</span>
                  </p>
                  <span class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    582 kg totales
                  </span>
                </div>
              </div>

              <!-- Detalle memorable: Cubeta real de 30 huevos que se llena al cargar -->
              <div class="py-4 border-t border-b border-glass-border">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-primary">
                      Simulación de cubeta comercial de 30 huevos
                    </span>
                    <span class="glass-pill text-[10px] px-2 py-0.5 rounded-full font-bold text-emerald-700 dark:text-emerald-300">
                      Categoría AA
                    </span>
                  </div>
                  <button
                    type="button"
                    class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    title="Reiniciar animación de la cubeta"
                    @click="runTrayAnimation"
                  >
                    Repetir llenado
                  </button>
                </div>

                <!-- Grilla 5x6 que representa la cubeta física de 30 unidades -->
                <div
                  :key="animationKey"
                  class="grid grid-cols-6 gap-1.5 sm:gap-2 p-3 rounded-2xl bg-emerald-950/5 dark:bg-emerald-950/40 border border-emerald-500/20"
                  role="img"
                  :aria-label="`Cubeta de 30 huevos con ${filledEggsCount} huevos llenos`"
                >
                  <div
                    v-for="index in 30"
                    :key="index"
                    class="relative aspect-[3/4] rounded-[45%_45%_50%_50%/55%_55%_45%_45%] border transition-all duration-300 flex items-center justify-center overflow-hidden"
                    :class="[
                      index <= filledEggsCount
                        ? 'bg-gradient-to-b from-amber-100 to-amber-200 dark:from-emerald-300/90 dark:to-emerald-400 border-amber-300/80 dark:border-emerald-200 shadow-xs scale-100 opacity-100'
                        : 'bg-emerald-500/5 dark:bg-emerald-500/10 border-dashed border-emerald-600/20 dark:border-emerald-400/20 scale-95 opacity-40',
                    ]"
                  >
                    <!-- Reflejo curvo del huevo -->
                    <span
                      v-if="index <= filledEggsCount"
                      class="absolute top-1 left-1.5 w-1.5 h-2 bg-white/70 rounded-full blur-[0.5px]"
                      aria-hidden="true"
                    />
                    <span
                      class="text-[9px] font-mono tabular-nums select-none"
                      :class="index <= filledEggsCount ? 'text-amber-900/60 dark:text-emerald-950/70 font-bold' : 'text-muted/40'"
                    >
                      {{ index }}
                    </span>
                  </div>
                </div>

                <!-- Contador y estado de la cubeta -->
                <div class="mt-2.5 flex items-center justify-between text-xs text-muted">
                  <span class="tabular-nums font-medium">
                    {{ filledEggsCount }} / 30 huevos empacados
                  </span>
                  <span
                    class="font-semibold transition-colors"
                    :class="isEggTrayFilled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'"
                  >
                    {{ isEggTrayFilled ? '✓ Cubeta completa lista para bodega' : 'Llenando cubeta...' }}
                  </span>
                </div>
              </div>

              <!-- Alerta visual de ejemplo -->
              <div class="mt-4 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/30 flex items-start gap-2.5">
                <svg class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <div class="text-xs">
                  <p class="font-semibold text-amber-900 dark:text-amber-200">
                    Alerta preventiva de ejemplo: Variación de postura
                  </p>
                  <p class="text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                    Galpón 2 superó la curva estimada (+1.8%). Verifique recolección de la tarde.
                  </p>
                </div>
              </div>

              <!-- Nota transparente de ejemplo ficticio -->
              <p class="mt-3 text-center text-[10px] text-muted/80 uppercase tracking-widest">
                — Datos simulados para demostración de la interfaz —
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

