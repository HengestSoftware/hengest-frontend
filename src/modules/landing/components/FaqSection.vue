<script setup>
import { ref } from 'vue'
import GlassCard from '@/components/GlassCard.vue'

const openIndex = ref(0) // La primera abierta por defecto

function toggleFaq(index) {
  openIndex.value = openIndex.value === index ? -1 : index
}

const faqs = [
  {
    q: '¿Qué categorías de huevo permite clasificar HENGEST?',
    a: 'Permite registrar la recolección en las categorías comerciales estándar de Colombia: AAA, AA, A, B y C. El sistema convierte las unidades sueltas a cubetas completas de 30 huevos e indica el remanente en unidades.',
  },
  {
    q: '¿Qué funciones NO incluye la plataforma?',
    a: 'HENGEST está enfocado con total rigurosidad en el control técnico y productivo del galpón. Expresamente fuera de nuestro alcance y no prometido: facturación electrónica de la DIAN, liquidación de nómina de trabajadores, ventas al consumidor final y contabilidad financiera.',
  },
  {
    q: '¿Puede un mayordomo o galponero sin experiencia digital usar la app?',
    a: 'Sí. El perfil de operario fue concebido para celulares Android en condiciones de campo: cuenta con tipografía de alto contraste, botones amplios y campos directos. Ingresar la recolección y las bajas toma menos de 2 minutos.',
  },
  {
    q: '¿Qué indicadores genera automáticamente la aplicación?',
    a: 'Calcula en tiempo real la tasa de postura diaria y acumulada por lote, el consumo de alimento en gramos por ave al día, la conversión alimenticia y el balance de aves vivas tras restar mortalidad y descartes.',
  },
  {
    q: '¿Se requiere instalar programas pesados en la computadora?',
    a: 'No. HENGEST es una aplicación web moderna que funciona desde el navegador de su teléfono, tableta o computador, sin descargas complejas ni configuraciones técnicas.',
  },
]
</script>

<template>
  <section id="preguntas" class="relative py-16 sm:py-24">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 space-y-3">
        <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
          Claridad total
        </span>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
          Preguntas frecuentes
        </h2>
        <p class="text-base text-secondary">
          Respuestas claras sobre las capacidades y el alcance de HENGEST.
        </p>
      </div>

      <div class="space-y-4">
        <GlassCard
          v-for="(faq, idx) in faqs"
          :key="faq.q"
          padding="none"
          class="border border-emerald-500/20 overflow-hidden transition-all duration-200"
        >
          <button
            type="button"
            class="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-500"
            :aria-expanded="openIndex === idx"
            :aria-controls="`faq-answer-${idx}`"
            @click="toggleFaq(idx)"
          >
            <span class="font-display font-bold text-base sm:text-lg text-primary">
              {{ faq.q }}
            </span>
            <span
              class="w-8 h-8 rounded-full glass-pill flex items-center justify-center shrink-0 text-emerald-600 dark:text-emerald-400 transition-transform duration-300"
              :class="openIndex === idx ? 'rotate-180 bg-emerald-500/20' : 'rotate-0'"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </button>

          <div
            v-show="openIndex === idx"
            :id="`faq-answer-${idx}`"
            class="px-5 sm:px-6 pb-6 pt-1 text-sm text-secondary leading-relaxed border-t border-glass-border/50"
          >
            <p>{{ faq.a }}</p>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

