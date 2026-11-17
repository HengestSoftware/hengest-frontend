import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import alertasApi from '@/api/alertas'

export const useAlertasStore = defineStore('alertas', () => {
  const alertas = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const unreadCount = computed(() => {
    return alertas.value.filter((a) => !a.leida).length
  })

  async function fetchAlertas(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const data = await alertasApi.getAlertas(params)
      // Soporte para respuesta paginada o lista directa
      alertas.value = Array.isArray(data) ? data : data.results || []
      return alertas.value
    } catch (err) {
      error.value = err.message || 'Error al cargar alertas'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function marcarLeida(id) {
    try {
      await alertasApi.marcarLeida(id)
      const found = alertas.value.find((a) => a.id === id)
      if (found) found.leida = true
    } catch (err) {
      throw err
    }
  }

  async function marcarTodasLeidas() {
    try {
      await alertasApi.marcarTodasLeidas()
      alertas.value.forEach((a) => {
        a.leida = true
      })
    } catch (err) {
      throw err
    }
  }

  return {
    alertas,
    unreadCount,
    isLoading,
    error,
    fetchAlertas,
    marcarLeida,
    marcarTodasLeidas,
  }
})
