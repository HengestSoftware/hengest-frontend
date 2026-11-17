import apiClient from './client'

export const lotesApi = {
  async getLotes(params = {}) {
    const res = await apiClient.get('/lotes/', { params })
    return res.data
  },
  async getLote(id) {
    const res = await apiClient.get(`/lotes/${id}/`)
    return res.data
  },
  async createLote(data) {
    const res = await apiClient.post('/lotes/', data)
    return res.data
  },
  async updateLote(id, data) {
    const res = await apiClient.patch(`/lotes/${id}/`, data)
    return res.data
  },
  async deleteLote(id) {
    const res = await apiClient.delete(`/lotes/${id}/`)
    return res.data
  },
  async cerrarLote(id, fechaCierre = null) {
    const payload = {
      estado: 'CERRADO',
      fecha_cierre: fechaCierre || new Date().toISOString().split('T')[0],
    }
    const res = await apiClient.patch(`/lotes/${id}/`, payload)
    return res.data
  },
  async getLoteResumen(id) {
    const res = await apiClient.get(`/lotes/${id}/resumen/`)
    return res.data
  },
  async getLoteEstandares(id) {
    const res = await apiClient.get(`/lotes/${id}/estandares/`)
    return res.data
  },
  async updateLoteEstandares(id, estandaresList) {
    const res = await apiClient.put(`/lotes/${id}/estandares/`, estandaresList)
    return res.data
  },
}

export default lotesApi
