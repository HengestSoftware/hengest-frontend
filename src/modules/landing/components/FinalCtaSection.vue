<script setup>
import AppButton from '@/components/AppButton.vue'
import GlassCard from '@/components/GlassCard.vue'
</script>

<template>
  <section class="relative py-16 sm:py-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative">
        <!-- Resplandor de fondo -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-lime-500/20 to-emerald-600/20 rounded-3xl blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <GlassCard
          elevated
          padding="lg"
          class="relative text-center border border-emerald-500/35 overflow-hidden"
        >
          <div class="max-w-3xl mx-auto space-y-6">
            <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Control avícola profesional
            </span>

            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary tracking-tight">
              Tome el control de su producción de huevo hoy mismo
            </h2>

            <p class="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
              Comience a registrar las cubetas, la mortalidad y el alimento de sus lotes desde el celular con la tranquilidad de no perder ningún dato.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <AppButton
                variant="primary"
                size="lg"
                to="/registro"
              >
                <span>Crear cuenta de granja</span>
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

            <p class="text-xs text-muted pt-2">
              Sin tarjeta de crédito · Configuración guiada en minutos
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

