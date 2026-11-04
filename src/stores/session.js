import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * Store de sesión (Placeholder).
 * Preparado para la futura autenticación con backend.
 */
export const useSessionStore = defineStore('session', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const role = computed(() => user.value?.role || 'invitado')

  /**
   * Placeholder para simulación de inicio de sesión.
   * Asocia la sesión y sincroniza la preferencia de tema de la cuenta de usuario.
   * @param {Object} userData
   * @param {string} authToken
   */
  function setSession(userData, authToken) {
    user.value = userData
    token.value = authToken

    // Si el perfil del usuario trae su preferencia guardada, se aplica
    if (userData?.theme) {
      try {
        localStorage.setItem('hengest_user_theme', userData.theme)
        if (userData.theme === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch {}
    }
  }

  /**
   * Cierra la sesión y limpia la preferencia de usuario asociada, regresando al modo claro por defecto.
   */
  function clearSession() {
    user.value = null
    token.value = null
    try {
      localStorage.removeItem('hengest_user_theme')
      document.documentElement.classList.remove('dark')
    } catch {}
  }

  return {
    user,
    token,
    isAuthenticated,
    role,
    setSession,
    clearSession,
  }
})
