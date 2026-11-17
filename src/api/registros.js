import apiClient from './client'

export const registrosApi = {
  async getRegistros(params = {}) {
    const res = await apiClient.get('/registros-diarios/', { params })
    return res.data
  },
  async getRegistro(id) {
    const res = await apiClient.get(`/registros-diarios/${id}/`)
    return res.data
  },
  async createRegistro(data) {
    const res = await apiClient.post('/registros-diarios/', data)
    return res.data
  },
  async updateRegistro(id, data) {
    const res = await apiClient.put(`/registros-diarios/${id}/`, data)
    return res.data
  },
  async patchRegistro(id, data) {
    const res = await apiClient.patch(`/registros-diarios/${id}/`, data)
    return res.data
  },
  async deleteRegistro(id) {
    const res = await apiClient.delete(`/registros-diarios/${id}/`)
    return res.data
  },
}

export default registrosApi
