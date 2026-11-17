import apiClient from './client'

export const authApi = {
  /**
   * Inicia sesión con email y contraseña.
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ access: string, refresh: string, user: Object }>}
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login/', credentials)
    return response.data
  },

  /**
   * Refresca el token de acceso.
   * @param {string} refresh
   */
  async refresh(refresh) {
    const response = await apiClient.post('/auth/refresh/', { refresh })
    return response.data
  },

  /**
   * Obtiene la información del usuario autenticado actual.
   */
  async getMe() {
    const response = await apiClient.get('/auth/me/')
    return response.data
  },

  /**
   * Cambia la contraseña del usuario.
   * @param {{ password_actual: string, password_nueva: string }} data
   */
  async cambiarPassword(data) {
    const response = await apiClient.post('/auth/cambiar-password/', data)
    return response.data
  },

  /**
   * Registra la aceptación de términos y tratamiento de datos (Ley 1581 de 2012).
   */
  async aceptarTerminos() {
    const response = await apiClient.post('/auth/aceptar-terminos/')
    return response.data
  },
}

export default authApi
