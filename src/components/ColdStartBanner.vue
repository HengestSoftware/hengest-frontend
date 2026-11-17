<script setup>
import { isServerWakingUp } from '@/api/client'
</script>

<template>
  <div
    v-if="isServerWakingUp"
    class="w-full bg-emerald-600/15 border-b border-emerald-500/30 text-emerald-950 dark:text-emerald-200 px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 shadow-xs animate-pulse"
    role="status"
    aria-live="polite"
  >
    <!-- Spinner artesanal SVG -->
    <svg class="animate-spin w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span>
      <strong>Despertando el servidor…</strong> El backend en Render se está activando tras un periodo de inactividad. Esto puede tomar unos segundos.
    </span>
  </div>
</template>
