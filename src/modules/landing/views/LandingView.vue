<script setup>
import HeroSection from '../components/HeroSection.vue'
import ProblemSection from '../components/ProblemSection.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import HowItWorksSection from '../components/HowItWorksSection.vue'
import AudienceSection from '../components/AudienceSection.vue'
import FaqSection from '../components/FaqSection.vue'
import FinalCtaSection from '../components/FinalCtaSection.vue'
</script>

<template>
  <div class="landing-page space-y-4">
    <!-- 1. Hero: titular, subtítulo, botones y panel simulado interactivo -->
    <HeroSection />

    <!-- 2. El problema: cuadernos de campo, cuentas tardías, pérdidas -->
    <ProblemSection />

    <!-- 3. Funcionalidades: Bento grid con los 6 módulos exactos -->
    <FeaturesSection />

    <!-- 4. Cómo funciona: 3 pasos simples en galpón -->
    <HowItWorksSection />

    <!-- 5. Para quién: avicultor, mayordomo, asesor, asociaciones -->
    <AudienceSection />

    <!-- 6. Preguntas frecuentes: acordeón accesible y límites de alcance -->
    <FaqSection />

    <!-- 7. Llamado final a la acción -->
    <FinalCtaSection />
  </div>
</template>

