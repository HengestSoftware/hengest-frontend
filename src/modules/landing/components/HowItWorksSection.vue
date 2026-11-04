<script setup>
import GlassCard from '@/components/GlassCard.vue'

const steps = [
  {
    number: '01',
    title: 'Registra en el galpón',
    desc: 'El mayordomo o galponero ingresa la recolección por categorías, las bajas del día y los bultos o kilos de alimento servidos. Se hace en 2 minutos desde cualquier celular Android.',
    tag: 'Registro móvil directo',
  },
  {
    number: '02',
    title: 'HENGEST calcula',
    desc: 'La plataforma procesa las cubetas comerciales de 30 huevos, calcula la tasa de postura del día, actualiza el censo de aves vivas y mide la conversión de alimento.',
    tag: 'Cálculo instantáneo',
  },
  {
    number: '03',
    title: 'Actúa a tiempo',
    desc: 'Si la postura cae o la mortalidad sube, el sistema muestra alertas visuales directas. El avicultor y el asesor toman decisiones sanitarias o nutricionales antes de que cueste dinero.',
    tag: 'Decisión preventiva',
  },
]
</script>

<template>
  <section id="como-funciona" class="relative py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
        <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
          Flujo de trabajo simple
        </span>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
          Cómo funciona HENGEST en su granja
        </h2>
        <p class="text-base text-secondary leading-relaxed">
          Tres pasos sencillos para transformar el desorden de hojas sueltas en control técnico diario.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        <GlassCard
          v-for="(step, idx) in steps"
          :key="step.number"
          padding="lg"
          hoverable
          class="relative flex flex-col justify-between border border-emerald-500/20"
        >
          <div>
            <!-- Número de paso con tipografía tabular destacada -->
            <div class="flex items-center justify-between mb-6">
              <span class="text-3xl sm:text-4xl font-display font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {{ step.number }}
              </span>
              <span class="glass-pill text-[10px] font-bold px-2.5 py-1 rounded-full text-muted">
                {{ step.tag }}
              </span>
            </div>

            <h3 class="text-xl font-display font-bold text-primary mb-3">
              {{ step.title }}
            </h3>

            <p class="text-sm text-secondary leading-relaxed">
              {{ step.desc }}
            </p>
          </div>

          <div class="mt-8 pt-4 border-t border-glass-border flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Paso {{ idx + 1 }} de 3 en el galpón</span>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

