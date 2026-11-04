<script setup>
import GlassCard from '@/components/GlassCard.vue'

const painPoints = [
  {
    title: 'Hojas mojadas, rotas o manchadas',
    desc: 'El ambiente del galpón deteriora los cuadernos. Se borran conteos de postura y se pierden semanas enteras de historial.',
    icon: 'document-lost',
  },
  {
    title: 'Cuentas a mano que se hacen tarde',
    desc: 'Calcular la tasa de postura los domingos por la noche no sirve de nada si las gallinas empezaron a caer el martes.',
    icon: 'clock-late',
  },
  {
    title: 'Descuadres en las cubetas comerciales',
    desc: 'Sumar huevos sueltos a ojo genera diferencias con el comerciante al momento de entregar las cubetas de 30 unidades.',
    icon: 'egg-math',
  },
]
</script>

<template>
  <section class="relative py-16 sm:py-24">
    <!-- Contenedor con borde superior orgánico curvo -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
        <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
          El problema en el campo
        </span>
        <h2 class="text-2xl sm:text-4xl font-display font-bold text-primary tracking-tight">
          El papel no avisa cuando algo va mal en el galpón
        </h2>
        <p class="text-base text-secondary leading-relaxed">
          Durante años, el cuaderno de notas ha sido el estándar en las granjas avícolas. Pero en un negocio de márgenes ajustados, los datos tardíos cuestan millones de pesos.
        </p>
      </div>

      <!-- Tarjetas asimétricas de cristal -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard
          v-for="point in painPoints"
          :key="point.title"
          padding="lg"
          hoverable
          class="border border-emerald-500/15 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Ícono SVG inline hecho a mano -->
            <div class="w-12 h-12 rounded-2xl glass-pill flex items-center justify-center text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
              <svg
                v-if="point.icon === 'document-lost'"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <svg
                v-else-if="point.icon === 'clock-late'"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg
                v-else
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>

            <h3 class="text-lg font-bold text-primary font-display">
              {{ point.title }}
            </h3>

            <p class="text-sm text-secondary leading-relaxed">
              {{ point.desc }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-glass-border">
            <span class="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Riesgo para la rentabilidad de la parvada
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

