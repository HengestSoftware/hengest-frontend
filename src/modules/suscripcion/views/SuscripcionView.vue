<script setup>
import { ref, computed, onMounted } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import suscripcionApi from '@/api/suscripcion'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const suscripcion = ref(null)
const pagos = ref([])
const isLoading = ref(true)
const isCheckingOut = ref(false)

const selectedPlan = ref('MENSUAL') // 'MENSUAL' | 'TRIMESTRAL' | 'ANUAL'
const referralCode = ref('')

const planes = [
  {
    id: 'MENSUAL',
    nombre: 'Plan Mensual',
    meses: 1,
    precioBase: 60000,
    descuentoPct: 0,
    precioFinal: 60000,
    ahorro: 0,
    destacado: false,
  },
  {
    id: 'TRIMESTRAL',
    nombre: 'Plan Trimestral',
    meses: 3,
    precioBase: 180000,
    descuentoPct: 5,
    precioFinal: 171000,
    ahorro: 9000,
    destacado: true,
  },
  {
    id: 'ANUAL',
    nombre: 'Plan Anual',
    meses: 12,
    precioBase: 720000,
    descuentoPct: 10,
    precioFinal: 648000,
    ahorro: 72000,
    destacado: false,
  },
]

const currentPlanCalculado = computed(() => {
  const base = planes.find((p) => p.id === selectedPlan.value) || planes[0]
  if (referralCode.value.trim().length >= 3) {
    // Si hay código de referido, aplica 15% (el mayor)
    const desc = 0.15
    const final = Math.round(base.precioBase * (1 - desc))
    return {
      ...base,
      descuentoPct: 15,
      precioFinal: final,
      ahorro: base.precioBase - final,
      conReferido: true,
    }
  }
  return base
})

async function loadData() {
  isLoading.value = true
  try {
    const [subData, pagosData] = await Promise.all([
      suscripcionApi.getSuscripcion().catch(() => null),
      suscripcionApi.getHistorialPagos().catch(() => []),
    ])
    suscripcion.value = subData
    pagos.value = Array.isArray(pagosData) ? pagosData : []
  } catch (err) {
    toast.error('Error al cargar datos de suscripción')
  } finally {
    isLoading.value = false
  }
}

// Cargar script oficial de Wompi de manera asíncrona
function loadWompiScript() {
  return new Promise((resolve) => {
    if (window.WidgetCheckout) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.wompi.co/widget.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

async function handleCheckout() {
  isCheckingOut.value = true
  try {
    await loadWompiScript()

    const checkoutParams = await suscripcionApi.createCheckout({
      plan: selectedPlan.value,
      codigo_referido: referralCode.value.trim() || undefined,
    })

    if (window.WidgetCheckout) {
      const checkout = new window.WidgetCheckout({
        currency: checkoutParams.currency || 'COP',
        amountInCents: checkoutParams.amount_in_cents,
        reference: checkoutParams.reference,
        publicKey: checkoutParams.public_key,
        signature: {
          integrity: checkoutParams.signature_integrity,
        },
        redirectUrl: checkoutParams.redirect_url || `${window.location.origin}/suscripcion/resultado`,
      })
      checkout.open((result) => {
        const transaction = result?.transaction
        if (transaction?.status === 'APPROVED') {
          toast.success('¡Pago aprobado exitosamente!')
          loadData()
        }
      })
    } else {
      toast.info('Modo de prueba de checkout Wompi (Redirección simulada a resultado)')
      window.location.href = `/suscripcion/resultado?id=${checkoutParams.reference || 'simulado'}&status=APPROVED`
    }
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Error al iniciar checkout de Wompi')
  } finally {
    isCheckingOut.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
        Suscripción y Facturación
      </h1>
      <p class="text-xs sm:text-sm text-secondary">
        Planes mensuales, pagos seguros mediante Wompi y control de membresía
      </p>
    </div>

    <LoadingSkeleton v-if="isLoading" type="cards" />

    <template v-else>
      <!-- Estado de suscripción actual -->
      <GlassCard padding="lg" class="border border-emerald-500/25">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span
                class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                :class="suscripcion?.estado === 'ACTIVA' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-700'"
              >
                {{ suscripcion?.estado || 'PENDIENTE DE ACTIVACIÓN' }}
              </span>
              <span class="text-xs font-bold text-primary">
                {{ suscripcion?.plan || 'Plan por activar' }}
              </span>
            </div>

            <h2 class="text-xl font-display font-bold text-primary">
              Membresía HENGEST Granja
            </h2>

            <p class="text-xs text-secondary">
              Próximo cobro: <strong>{{ formatDate(suscripcion?.fecha_proximo_cobro) }}</strong>
              (Días de gracia tras vencimiento: {{ suscripcion?.dias_gracia ?? 5 }} días)
            </p>
          </div>

          <div class="text-right">
            <span class="text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {{ formatCurrency(suscripcion?.precio_cop || 60000) }}
            </span>
            <p class="text-[10px] text-muted">/ por mes facturado</p>
          </div>
        </div>
      </GlassCard>

      <!-- Selector de Planes -->
      <div class="space-y-4">
        <h2 class="text-lg font-display font-bold text-primary">
          Seleccione su periodo de renovación
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="p in planes"
            :key="p.id"
            class="relative p-5 rounded-3xl transition-all cursor-pointer border flex flex-col justify-between"
            :class="[
              selectedPlan === p.id
                ? 'glass-panel-elevated border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                : 'glass-panel border-emerald-500/20 hover:border-emerald-500/40',
            ]"
            @click="selectedPlan = p.id"
          >
            <span
              v-if="p.destacado"
              class="absolute -top-3 right-4 px-3 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm"
            >
              Más popular
            </span>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-base text-primary">{{ p.nombre }}</h3>
                <span v-if="p.descuentoPct > 0" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  {{ p.descuentoPct }}% DCTO
                </span>
              </div>

              <div>
                <p class="text-2xl font-display font-bold text-primary tabular-nums">
                  {{ formatCurrency(p.precioFinal) }}
                </p>
                <p class="text-[11px] text-muted">
                  {{ p.meses === 1 ? 'Facturación mensual' : `Pago único cada ${p.meses} meses` }}
                </p>
              </div>

              <p v-if="p.ahorro > 0" class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Ahorra {{ formatCurrency(p.ahorro) }}
              </p>
            </div>

            <div class="pt-4 mt-4 border-t border-glass-border">
              <span
                class="block w-full py-2 rounded-xl text-xs font-bold text-center"
                :class="selectedPlan === p.id ? 'bg-emerald-600 text-white' : 'glass-pill text-secondary'"
              >
                {{ selectedPlan === p.id ? 'Seleccionado' : 'Elegir plan' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cupón de referido y Checkout con Wompi -->
      <GlassCard padding="lg" class="border border-emerald-500/30 max-w-xl mx-auto space-y-4 text-center">
        <h3 class="text-base font-bold text-primary">
          Confirmar y Pagar de forma Segura
        </h3>

        <!-- Campo código de referido -->
        <div class="space-y-1.5 text-left max-w-sm mx-auto">
          <label class="block text-xs font-semibold text-primary">
            ¿Tiene un código de referido de otro avicultor?
          </label>
          <div class="flex gap-2">
            <input
              v-model="referralCode"
              type="text"
              placeholder="Ej: GRANJA-15"
              class="flex-1 h-11 px-3 rounded-xl glass-pill bg-canvas text-sm font-mono uppercase text-primary border border-emerald-500/30"
            >
          </div>
          <span v-if="currentPlanCalculado.conReferido" class="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block">
            ✓ ¡Código aplicado! 15% de descuento en el primer pago.
          </span>
        </div>

        <div class="p-4 rounded-2xl bg-canvas border border-emerald-500/20 text-xs flex items-center justify-between">
          <span class="text-muted">Total a pagar ahora:</span>
          <span class="text-xl font-bold text-primary tabular-nums">
            {{ formatCurrency(currentPlanCalculado.precioFinal) }} COP
          </span>
        </div>

        <div class="pt-2">
          <AppButton
            variant="primary"
            size="lg"
            full-width
            :disabled="isCheckingOut"
            @click="handleCheckout"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            <span>{{ isCheckingOut ? 'Cargando pasarela...' : 'Pagar con Wompi (Bancolombia, Nequi, Tarjetas, PSE)' }}</span>
          </AppButton>
        </div>

        <p class="text-[11px] text-muted">
          Pagos procesados de forma segura con cifrado bancario a través de Wompi Colombia.
        </p>
      </GlassCard>

      <!-- Historial de Pagos -->
      <div v-if="pagos.length > 0" class="space-y-3">
        <h2 class="text-base font-bold text-primary">Historial de Pagos</h2>
        <div class="overflow-x-auto rounded-2xl glass-panel border border-emerald-500/20">
          <table class="w-full text-left text-xs">
            <thead class="bg-canvas/90 text-muted uppercase font-bold border-b border-glass-border">
              <tr>
                <th class="p-3">Referencia</th>
                <th class="p-3">Fecha</th>
                <th class="p-3">Monto</th>
                <th class="p-3">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-glass-border/40 font-mono">
              <tr v-for="p in pagos" :key="p.id">
                <td class="p-3 font-bold">{{ p.referencia }}</td>
                <td class="p-3 font-sans">{{ formatDate(p.fecha) }}</td>
                <td class="p-3 font-bold text-primary">{{ formatCurrency(p.monto) }}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold" :class="p.estado === 'APROBADO' ? 'bg-emerald-500/20 text-emerald-800' : 'bg-amber-500/20 text-amber-800'">
                    {{ p.estado }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>
