<script setup>
import GlassCard from '@/components/GlassCard.vue'

const audiences = [
  {
    role: 'Avicultor y Propietario',
    focus: 'Control y tranquilidad',
    desc: 'Sepa exactamente cuántas cubetas de huevo se produjeron hoy, cómo va la mortalidad de cada lote y cuál es la conversión sin depender de cuadernos ajenos.',
    points: ['Supervisión remota desde el celular', 'Historial claro por lote', 'Alertas tempranas de anomalías'],
  },
  {
    role: 'Mayordomo y Galponero',
    focus: 'Facilidad y rapidez en campo',
    desc: 'Una interfaz pensada para el teléfono Android en el galpón. Letras legibles, botones grandes y registro en 2 minutos sin complicarse con tecnología difícil.',
    points: ['Registro directo sin enredos', 'Calculadora de cubetas automática', 'Ahorro de tiempo en la tarde'],
  },
  {
    role: 'Asesor Zootecnista y Veterinario',
    focus: 'Datos técnicos confiables',
    desc: 'Llegue a la granja y encuentre curvas de postura reales, mortalidad acumulada y consumo de alimento al día para ajustar raciones o recomendar tratamientos con sustento.',
    points: ['Historial técnico continuo', 'Curvas de postura estandarizadas', 'Detección oportuna de bajas'],
  },
  {
    role: 'Asociaciones y Cooperativas',
    focus: 'Estandarización gremial',
    desc: 'Para agremiaciones y cooperativas avícolas que buscan tecnificar y homogeneizar los registros productivos de sus productores afiliados.',
    points: ['Formato común de registro', 'Comparativa técnica de lotes', 'Mayor valor comercial del huevo'],
  },
]
</script>

<template>
  <section id="para-quien" class="relative py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
        <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
          Enfoque especializado
        </span>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
          Diseñado para el día a día de la granja avícola
        </h2>
        <p class="text-base text-secondary leading-relaxed">
          Cada rol en la producción de huevo comercial tiene necesidades distintas; HENGEST responde a cada uno sin rodeos.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <GlassCard
          v-for="aud in audiences"
          :key="aud.role"
          padding="lg"
          hoverable
          class="border border-emerald-500/20 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-xl font-display font-bold text-primary">
                {{ aud.role }}
              </h3>
              <span class="glass-pill text-[11px] font-bold px-3 py-1 rounded-full text-emerald-700 dark:text-emerald-300">
                {{ aud.focus }}
              </span>
            </div>

            <p class="text-sm text-secondary leading-relaxed mb-6">
              {{ aud.desc }}
            </p>

            <ul class="space-y-2.5">
              <li
                v-for="pt in aud.points"
                :key="pt"
                class="flex items-center gap-2.5 text-xs text-primary"
              >
                <span class="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                <span>{{ pt }}</span>
              </li>
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

