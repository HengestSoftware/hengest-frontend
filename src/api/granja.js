import apiClient from './client'

export const granjaApi = {
  async getGranja() {
    const res = await apiClient.get('/granja/')
    return res.data
  },
  async updateGranja(data) {
    const res = await apiClient.patch('/granja/', data)
    return res.data
  },
}

export default granjaApi
