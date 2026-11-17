<script setup>
import { RouterLink } from 'vue-router'
import { isSubscriptionInactive } from '@/api/client'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div
    v-if="isSubscriptionInactive"
    class="w-full bg-rose-600/15 border-b border-rose-500/40 text-rose-950 dark:text-rose-200 px-4 py-3 text-xs sm:text-sm font-medium flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm"
    role="alert"
    aria-live="assertive"
  >
    <div class="flex items-center gap-2.5">
      <svg class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <div>
        <p class="font-bold">Suscripción inactiva o pendiente de pago</p>
        <p class="text-[11px] sm:text-xs text-rose-900/80 dark:text-rose-300/80">
          Puede consultar sus registros históricos, pero la creación y edición están deshabilitadas hasta reactivar el plan de su granja.
        </p>
      </div>
    </div>

    <div v-if="authStore.isAdmin" class="shrink-0">
      <RouterLink
        to="/suscripcion"
        class="inline-block px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
      >
        Gestionar suscripción
      </RouterLink>
    </div>
  </div>
</template>
