import apiClient from './client'

export const vacunacionesApi = {
  async getVacunaciones(params = {}) {
    const res = await apiClient.get('/vacunaciones/', { params })
    return res.data
  },
  async createVacunacion(data) {
    const res = await apiClient.post('/vacunaciones/', data)
    return res.data
  },
  async updateVacunacion(id, data) {
    const res = await apiClient.patch(`/vacunaciones/${id}/`, data)
    return res.data
  },
  async deleteVacunacion(id) {
    const res = await apiClient.delete(`/vacunaciones/${id}/`)
    return res.data
  },
  async marcarAplicada(id, { fecha_aplicada, notas = '' }) {
    const res = await apiClient.post(`/vacunaciones/${id}/aplicar/`, {
      fecha_aplicada,
      notas,
    })
    return res.data
  },
}

export default vacunacionesApi
