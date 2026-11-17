<script setup>
import { useOfflineStore } from '@/stores/offline'

const offlineStore = useOfflineStore()

function handleSync() {
  offlineStore.syncQueue()
}
</script>

<template>
  <div
    v-if="!offlineStore.isOnline || offlineStore.pendingCount > 0"
    class="w-full bg-amber-500/20 dark:bg-amber-500/30 border-b border-amber-500/40 text-amber-950 dark:text-amber-200 px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-xs"
    role="status"
    aria-live="polite"
  >
    <div class="flex items-center gap-2">
      <!-- Indicador animado de estado offline -->
      <span
        class="w-2.5 h-2.5 rounded-full"
        :class="!offlineStore.isOnline ? 'bg-amber-600 animate-ping' : 'bg-emerald-500'"
      />
      <span v-if="!offlineStore.isOnline">
        <strong>Modo sin conexión:</strong> Sus registros se guardan en el celular y se enviarán automáticamente al volver la señal.
      </span>
      <span v-else>
        <strong>Conexión recuperada:</strong> Hay {{ offlineStore.pendingCount }} registro(s) pendiente(s) de sincronizar.
      </span>
    </div>

    <div v-if="offlineStore.pendingCount > 0 && offlineStore.isOnline" class="shrink-0">
      <button
        type="button"
        class="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
        :disabled="offlineStore.isSyncing"
        @click="handleSync"
      >
        {{ offlineStore.isSyncing ? 'Sincronizando...' : 'Sincronizar ahora' }}
      </button>
    </div>
  </div>
</template>
