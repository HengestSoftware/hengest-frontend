import axios from 'axios'

// Configuración de base URL
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_BASE_URL = `${rawBase.replace(/\/$/, '')}/api/v1`

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 segundos para tolerar el arranque en frío de Render
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Variables reactivas exportadas para la UI global
import { ref } from 'vue'
export const isServerWakingUp = ref(false)
export const isSubscriptionInactive = ref(false)

// Cola de refresco de token para evitar peticiones duplicadas
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor de Petición: adjunta el JWT access token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('hengest_access_token')
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Ignorar error de localStorage
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de Respuesta: 401 (refresh), 402 (suscripción inactiva), cold-start
apiClient.interceptors.response.use(
  (response) => {
    // Si la petición tuvo éxito, el servidor está despierto
    isServerWakingUp.value = false
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Detección de arranque en frío o error de conexión
    if (
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('Network Error') ||
      (error.response?.status >= 500 && error.response?.status <= 504)
    ) {
      isServerWakingUp.value = true
    } else {
      isServerWakingUp.value = false
    }

    // 402: Suscripción inactiva
    if (error.response?.status === 402 || error.response?.data?.code === 'suscripcion_inactiva') {
      isSubscriptionInactive.value = true
    }

    // 401: Token inválido o expirado -> Intentar refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si la petición era hacia el login o refresh, no reintentamos
      if (originalRequest.url?.includes('/auth/login/') || originalRequest.url?.includes('/auth/refresh/')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('hengest_refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const newAccess = res.data.access
        localStorage.setItem('hengest_access_token', newAccess)

        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccess}`
        originalRequest.headers.Authorization = `Bearer ${newAccess}`

        processQueue(null, newAccess)
        return apiClient(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        try {
          localStorage.removeItem('hengest_access_token')
          localStorage.removeItem('hengest_refresh_token')
          localStorage.removeItem('hengest_user')
        } catch {}
        // Redirigir a login si estamos en el navegador
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
