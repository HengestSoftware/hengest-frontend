import { ref } from 'vue'
import { defineStore } from 'pinia'
import granjaApi from '@/api/granja'

export const useGranjaStore = defineStore('granja', () => {
  const granja = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchGranja() {
    isLoading.value = true
    error.value = null
    try {
      const data = await granjaApi.getGranja()
      granja.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Error al cargar datos de la granja'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateGranja(payload) {
    isLoading.value = true
    error.value = null
    try {
      const data = await granjaApi.updateGranja(payload)
      granja.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Error al actualizar configuración'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    granja,
    isLoading,
    error,
    fetchGranja,
    updateGranja,
  }
})
