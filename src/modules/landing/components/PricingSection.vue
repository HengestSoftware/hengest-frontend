<script setup>
import { computed } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+573001234567'

const whatsappUrl = computed(() => {
  const clean = whatsappNumber.replace(/[^0-9]/g, '')
  const text = encodeURIComponent('Hola HENGEST, me interesa conocer más sobre la plataforma para mi granja avícola.')
  return `https://wa.me/${clean}?text=${text}`
})
</script>

<template>
  <section id="precios" class="relative py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
        <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
          Planes y Tarifas
        </span>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight">
          Inversión clara y accesible para su granja
        </h2>
        <p class="text-base text-secondary leading-relaxed">
          Sin costos ocultos ni cobros por galponero. Una sola suscripción mensual por granja avícola.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        <!-- Plan Mensual -->
        <GlassCard
          padding="lg"
          hoverable
          class="border border-emerald-500/20 flex flex-col justify-between space-y-6"
        >
          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold font-display text-primary">Plan Mensual</h3>
              <p class="text-xs text-muted mt-1">Flexibilidad mes a mes para su granja</p>
            </div>

            <div>
              <p class="text-3xl sm:text-4xl font-bold text-primary tabular-nums font-display">
                $ 60.000
              </p>
              <span class="text-xs text-muted">COP / mes por granja</span>
            </div>

            <ul class="space-y-2.5 text-xs text-secondary border-t border-glass-border pt-4">
              <li class="flex items-center gap-2">✓ Galpones y lotes ilimitados</li>
              <li class="flex items-center gap-2">✓ Usuarios operarios ilimitados</li>
              <li class="flex items-center gap-2">✓ Cubetas automáticas de 30 unidades</li>
              <li class="flex items-center gap-2">✓ Semáforo y alertas sanitarias</li>
              <li class="flex items-center gap-2">✓ Registro offline desde el celular</li>
            </ul>
          </div>

          <div class="pt-2">
            <AppButton variant="secondary" size="md" full-width to="/login">
              Ingresar a la plataforma
            </AppButton>
          </div>
        </GlassCard>

        <!-- Plan Trimestral (Destacado) -->
        <GlassCard
          elevated
          padding="lg"
          hoverable
          class="border border-emerald-500/40 ring-2 ring-emerald-500/30 flex flex-col justify-between space-y-6 relative"
        >
          <span class="absolute -top-3.5 right-6 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
            5% de Descuento
          </span>

          <div class="space-y-4">
            <div>
              <h3 class="text-xl font-bold font-display text-primary">Plan Trimestral</h3>
              <p class="text-xs text-muted mt-1">3 meses de trazabilidad continua</p>
            </div>

            <div>
              <p class="text-3xl sm:text-4xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums font-display">
                $ 171.000
              </p>
              <span class="text-xs text-muted">COP por 3 meses (Ahorra $ 9.000)</span>
            </div>

            <ul class="space-y-2.5 text-xs text-secondary border-t border-glass-border pt-4">
              <li class="flex items-center gap-2 font-bold text-primary">✓ Todo lo del plan mensual</li>
              <li class="flex items-center gap-2">✓ Descuento del 5% aplicado</li>
              <li class="flex items-center gap-2">✓ Reportes exportables en CSV</li>
              <li class="flex items-center gap-2">✓ Soporte prioritario por WhatsApp</li>
            </ul>
          </div>

          <div class="pt-2">
            <AppButton variant="primary" size="md" full-width to="/login">
              Ingresar a la plataforma
            </AppButton>
          </div>
        </GlassCard>

        <!-- Plan Anual -->
        <GlassCard
          padding="lg"
          hoverable
          class="border border-emerald-500/20 flex flex-col justify-between space-y-6"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold font-display text-primary">Plan Anual</h3>
                <p class="text-xs text-muted mt-1">Mayor ahorro para productores establecidos</p>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                10% DCTO
              </span>
            </div>

            <div>
              <p class="text-3xl sm:text-4xl font-bold text-primary tabular-nums font-display">
                $ 648.000
              </p>
              <span class="text-xs text-muted">COP al año (Ahorra $ 72.000)</span>
            </div>

            <ul class="space-y-2.5 text-xs text-secondary border-t border-glass-border pt-4">
              <li class="flex items-center gap-2 font-bold text-primary">✓ Todo lo del plan trimestral</li>
              <li class="flex items-center gap-2">✓ Descuento del 10% anual</li>
              <li class="flex items-center gap-2">✓ Trazabilidad histórica completa del lote</li>
              <li class="flex items-center gap-2">✓ Acompañamiento en configuración</li>
            </ul>
          </div>

          <div class="pt-2">
            <AppButton variant="secondary" size="md" full-width to="/login">
              Ingresar a la plataforma
            </AppButton>
          </div>
        </GlassCard>
      </div>

      <!-- Botón de contacto por WhatsApp (F-01) -->
      <div class="mt-12 text-center space-y-3">
        <p class="text-xs sm:text-sm text-secondary">
          ¿Desea asesoría directa o tiene dudas sobre cómo HENGEST funciona en su granja?
        </p>
        <div>
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <span>💬 Chatear por WhatsApp con un Asesor</span>
            <span class="text-xs opacity-80">({{ whatsappNumber }})</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
