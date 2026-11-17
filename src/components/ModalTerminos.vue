<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppButton from '@/components/AppButton.vue'
import GlassCard from '@/components/GlassCard.vue'

const authStore = useAuthStore()
const isAccepting = ref(false)
const errorMessage = ref('')

async function handleAccept() {
  isAccepting.value = true
  errorMessage.value = ''
  try {
    await authStore.acceptTerms()
  } catch (err) {
    errorMessage.value = err.message || 'No fue posible registrar la aceptación. Intente nuevamente.'
  } finally {
    isAccepting.value = false
  }
}
</script>

<template>
  <div
    v-if="authStore.needsTermsAcceptance"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-terminos-title"
  >
    <div class="w-full max-w-lg">
      <GlassCard
        elevated
        padding="lg"
        class="border border-emerald-500/40 shadow-2xl space-y-5"
      >
        <div class="space-y-2">
          <div class="inline-flex items-center gap-1.5 glass-pill px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <span class="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Cumplimiento Legal Colombiano</span>
          </div>
          <h2 id="modal-terminos-title" class="text-xl sm:text-2xl font-display font-bold text-primary">
            Términos de Servicio y Tratamiento de Datos Personales
          </h2>
          <p class="text-xs text-muted">
            En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-canvas/70 border border-emerald-500/20 text-xs text-secondary space-y-3 max-h-60 overflow-y-auto leading-relaxed">
          <p>
            <strong>1. Responsable del Tratamiento:</strong> HENGEST recolecta y procesa datos operativos de producción avícola, lotes, registros diarios de postura, consumo de alimento y bajas únicamente para prestar el servicio de trazabilidad y analítica de su granja.
          </p>
          <p>
            <strong>2. Finalidad de la Información:</strong> Los datos se emplean con el fin exclusivo de emitir reportes técnicos, calcular indicadores productivos (conversión, tasa de postura) y notificar alertas sanitarias. No comercializamos sus datos ni los compartimos con terceros.
          </p>
          <p>
            <strong>3. Derechos del Titular:</strong> Como titular de la información, tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales o de su granja en cualquier momento.
          </p>
          <p>
            <strong>4. Uso de la Plataforma:</strong> El usuario se compromete a ingresar información veraz sobre la producción de sus galpones. HENGEST no presta servicios de facturación ni contabilidad.
          </p>
        </div>

        <div v-if="errorMessage" class="text-xs text-rose-600 dark:text-rose-400 font-medium">
          {{ errorMessage }}
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <AppButton
            variant="primary"
            size="md"
            full-width
            :disabled="isAccepting"
            @click="handleAccept"
          >
            {{ isAccepting ? 'Guardando aceptación...' : 'Acepto los términos y el tratamiento de datos' }}
          </AppButton>
        </div>
      </GlassCard>
    </div>
  </div>
</template>
