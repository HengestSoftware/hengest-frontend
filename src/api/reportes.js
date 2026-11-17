import apiClient from './client'

export const reportesApi = {
  async getReporteProduccion(params = {}) {
    const res = await apiClient.get('/reportes/produccion/', { params })
    return res.data
  },
  async exportarReporteCsv(params = {}) {
    const res = await apiClient.get('/reportes/produccion/', {
      params: { ...params, formato: 'csv' },
      responseType: 'blob',
    })
    return res.data
  },
}

export default reportesApi
