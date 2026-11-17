import apiClient from './client'

export const usuariosApi = {
  async getUsuarios() {
    const res = await apiClient.get('/usuarios/')
    return res.data
  },
  async createUsuario(data) {
    const res = await apiClient.post('/usuarios/', data)
    return res.data
  },
  async updateUsuario(id, data) {
    const res = await apiClient.patch(`/usuarios/${id}/`, data)
    return res.data
  },
  async deleteUsuario(id) {
    const res = await apiClient.delete(`/usuarios/${id}/`)
    return res.data
  },
}

export default usuariosApi
