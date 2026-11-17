<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'

const route = useRoute()

const transactionId = computed(() => route.query.id || route.query.reference || 'HG-REF')
const status = computed(() => {
  const s = (route.query.status || '').toUpperCase()
  if (s === 'APPROVED' || s === 'APROBADO') return 'APPROVED'
  if (s === 'DECLINED' || s === 'RECHAZADO') return 'DECLINED'
  return 'PENDING'
})
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <GlassCard elevated padding="lg" class="max-w-md w-full text-center space-y-5 border border-emerald-500/30">
      <!-- Icono según estado -->
      <div
        class="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl shadow-lg"
        :class="[
          status === 'APPROVED'
            ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/40'
            : status === 'DECLINED'
              ? 'bg-rose-500/20 text-rose-600 border border-rose-500/40'
              : 'bg-amber-500/20 text-amber-600 border border-amber-500/40',
        ]"
      >
        <span v-if="status === 'APPROVED'">✓</span>
        <span v-else-if="status === 'DECLINED'">✕</span>
        <span v-else>⏳</span>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl font-display font-bold text-primary">
          {{
            status === 'APPROVED'
              ? '¡Pago Aprobado con Éxito!'
              : status === 'DECLINED'
                ? 'Transacción no Aprobada'
                : 'Transacción en Proceso'
          }}
        </h1>

        <p class="text-xs sm:text-sm text-secondary leading-relaxed">
          {{
            status === 'APPROVED'
              ? 'Su suscripción a HENGEST ha sido activada correctamente. Ya tiene habilitado el registro diario y control de todos sus galpones.'
              : status === 'DECLINED'
                ? 'La pasarela no pudo procesar el cobro. Por favor intente con otro método de pago o comuníquese con su entidad bancaria.'
                : 'Estamos esperando la confirmación de la pasarela de pagos. Este proceso puede tardar unos minutos.'
          }}
        </p>

        <p class="text-[11px] font-mono text-muted pt-1">
          Referencia: {{ transactionId }}
        </p>
      </div>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <AppButton variant="primary" size="md" to="/dashboard">
          Ir al Panel de Control
        </AppButton>
        <AppButton v-if="status !== 'APPROVED'" variant="secondary" size="md" to="/suscripcion">
          Volver a Suscripción
        </AppButton>
      </div>
    </GlassCard>
  </div>
</template>
