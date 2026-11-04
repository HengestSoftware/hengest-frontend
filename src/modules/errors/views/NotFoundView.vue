<script setup>
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import BrandLogo from '@/components/BrandLogo.vue'
</script>

<template>
  <div class="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-16">
    <GlassCard
      elevated
      padding="lg"
      class="max-w-md w-full text-center border border-emerald-500/25 relative space-y-6"
    >
      <div class="flex justify-center">
        <BrandLogo size="lg" :show-text="false" />
      </div>

      <div class="space-y-2">
        <span class="text-5xl sm:text-6xl font-display font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          404
        </span>
        <h1 class="text-2xl font-display font-bold text-primary">
          Página no encontrada
        </h1>
        <p class="text-sm text-secondary leading-relaxed">
          La ruta que intenta consultar no existe o ha sido movida. Regrese a la pantalla principal para continuar gestionando su granja.
        </p>
      </div>

      <div class="pt-2 flex justify-center">
        <AppButton
          variant="primary"
          size="md"
          to="/"
        >
          <span>Volver al inicio</span>
          <svg class="w-4 h-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </AppButton>
      </div>
    </GlassCard>
  </div>
</template>

