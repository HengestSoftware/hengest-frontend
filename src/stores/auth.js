import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import authApi from '@/api/auth'
import apiClient, { isServerWakingUp } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(null)
  const refreshToken = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Inicialización segura desde localStorage
  try {
    const storedUser = localStorage.getItem('hengest_user')
    if (storedUser) user.value = JSON.parse(storedUser)

    const storedAccess = localStorage.getItem('hengest_access_token')
    if (storedAccess) accessToken.value = storedAccess

    const storedRefresh = localStorage.getItem('hengest_refresh_token')
    if (storedRefresh) refreshToken.value = storedRefresh
  } catch {}

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin = computed(() => user.value?.rol === 'ADMIN')
  const isOperario = computed(() => user.value?.rol === 'OPERARIO')
  const granja = computed(() => user.value?.granja || null)
  const needsTermsAcceptance = computed(() => {
    return isAuthenticated.value && !user.value?.acepto_terminos_en
  })

  async function login(credentials) {
    isLoading.value = true
    error.value = null

    try {
      const data = await authApi.login(credentials)
      accessToken.value = data.access
      refreshToken.value = data.refresh
      user.value = data.user

      try {
        localStorage.setItem('hengest_access_token', data.access)
        localStorage.setItem('hengest_refresh_token', data.refresh)
        localStorage.setItem('hengest_user', JSON.stringify(data.user))
      } catch {}

      // Configurar header por defecto en cliente
      apiClient.defaults.headers.common.Authorization = `Bearer ${data.access}`
      return data.user
    } catch (err) {
      const backendMessage =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.message ||
        'Error de autenticación. Verifique su correo y contraseña.'
      error.value = backendMessage
      throw new Error(backendMessage)
    } finally {
      isLoading.value = false
    }
  }

  async function refreshUser() {
    if (!accessToken.value) return
    try {
      const me = await authApi.getMe()
      user.value = me
      try {
        localStorage.setItem('hengest_user', JSON.stringify(me))
      } catch {}
      return me
    } catch (err) {
      // Si falla, el interceptor ya manejará el 401 si corresponde
    }
  }

  async function acceptTerms() {
    try {
      await authApi.aceptarTerminos()
      if (user.value) {
        user.value.acepto_terminos_en = new Date().toISOString()
        try {
          localStorage.setItem('hengest_user', JSON.stringify(user.value))
        } catch {}
      }
    } catch (err) {
      throw err
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    error.value = null

    try {
      localStorage.removeItem('hengest_access_token')
      localStorage.removeItem('hengest_refresh_token')
      localStorage.removeItem('hengest_user')
    } catch {}

    delete apiClient.defaults.headers.common.Authorization
  }

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    isServerWakingUp,
    isAuthenticated,
    isAdmin,
    isOperario,
    granja,
    needsTermsAcceptance,
    login,
    refreshUser,
    acceptTerms,
    logout,
  }
})
