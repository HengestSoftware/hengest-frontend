import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useOnline } from '@vueuse/core'
import {
  enqueueDailyRecord,
  getQueuedRecords,
  getPendingCount,
  syncOfflineQueue,
} from '@/utils/offlineQueue'
import registrosApi from '@/api/registros'

export const useOfflineStore = defineStore('offline', () => {
  const isOnline = useOnline()
  const pendingRecords = ref(getQueuedRecords())
  const isSyncing = ref(false)
  const lastSyncResult = ref(null)

  const pendingCount = computed(() => pendingRecords.value.length)

  function refreshPending() {
    pendingRecords.value = getQueuedRecords()
  }

  function queueRecord(record) {
    const enqueued = enqueueDailyRecord(record)
    refreshPending()
    return enqueued
  }

  async function syncQueue() {
    if (!isOnline.value || isSyncing.value || pendingCount.value === 0) return

    isSyncing.value = true
    try {
      const result = await syncOfflineQueue(async (record) => {
        // Enviar registro al endpoint correspondiente
        return await registrosApi.createRegistro(record)
      })
      lastSyncResult.value = result
      refreshPending()
      return result
    } finally {
      isSyncing.value = false
    }
  }

  // Si estamos en el navegador, escuchar cuando vuelva la red para sincronizar automáticamente
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      syncQueue()
    })
  }

  return {
    isOnline,
    pendingRecords,
    pendingCount,
    isSyncing,
    lastSyncResult,
    refreshPending,
    queueRecord,
    syncQueue,
  }
})
