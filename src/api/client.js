/**
 * Wrapper liviano sobre la API Fetch nativa para HENGEST.
 * Sin dependencias externas (sin axios).
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Realiza una petición HTTP con fetch y procesa la respuesta en JSON.
 * @param {string} endpoint - Ruta relativa del endpoint (ej. '/auth/login')
 * @param {RequestInit} [options={}] - Opciones de fetch (método, cuerpo, cabeceras, etc.)
 * @returns {Promise<any>}
 */
export async function apiClient(endpoint, options = {}) {
  const { headers = {}, body, ...customConfig } = options

  const config = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    ...customConfig,
  }

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    config.body = JSON.stringify(body)
  }

  const cleanBase = BASE_URL.replace(/\/$/, '')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${cleanBase}${cleanEndpoint}`

  try {
    const response = await fetch(url, config)

    // Manejo de respuestas sin contenido (204 No Content)
    if (response.status === 204) {
      return null
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const error = new Error(data.message || `Error HTTP ${response.status}: Petición no completada`)
      error.status = response.status
      error.data = data
      throw error
    }

    return data
  } catch (err) {
    // Si ya es un error con status, lo relanzamos
    if (err.status) {
      throw err
    }
    // Error de red o conexión caída
    const networkError = new Error('No fue posible conectar con el servidor. Verifique su conexión a internet.')
    networkError.original = err
    throw networkError
  }
}

export const api = {
  get: (endpoint, options) => apiClient(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => apiClient(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => apiClient(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => apiClient(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => apiClient(endpoint, { ...options, method: 'DELETE' }),
}

export default apiClient

