import apiClient from './client'

export const galponesApi = {
  async getGalpones(params = {}) {
    const res = await apiClient.get('/galpones/', { params })
    return res.data
  },
  async getGalpon(id) {
    const res = await apiClient.get(`/galpones/${id}/`)
    return res.data
  },
  async createGalpon(data) {
    const res = await apiClient.post('/galpones/', data)
    return res.data
  },
  async updateGalpon(id, data) {
    const res = await apiClient.patch(`/galpones/${id}/`, data)
    return res.data
  },
  async deleteGalpon(id) {
    const res = await apiClient.delete(`/galpones/${id}/`)
    return res.data
  },
}

export default galponesApi
