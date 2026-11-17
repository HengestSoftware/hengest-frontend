import apiClient from './client'

export const suscripcionApi = {
  async getSuscripcion() {
    const res = await apiClient.get('/suscripcion/')
    return res.data
  },
  async getHistorialPagos() {
    const res = await apiClient.get('/suscripcion/pagos/')
    return res.data
  },
  async createCheckout(data) {
    const res = await apiClient.post('/suscripcion/checkout/', data)
    return res.data
  },
}

export default suscripcionApi
