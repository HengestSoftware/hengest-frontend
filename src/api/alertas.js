import apiClient from './client'

export const alertasApi = {
  async getAlertas(params = {}) {
    const res = await apiClient.get('/alertas/', { params })
    return res.data
  },
  async marcarLeida(id) {
    const res = await apiClient.patch(`/alertas/${id}/`, { leida: true })
    return res.data
  },
  async marcarTodasLeidas() {
    const res = await apiClient.post('/alertas/marcar-todas-leidas/')
    return res.data
  },
}

export default alertasApi
