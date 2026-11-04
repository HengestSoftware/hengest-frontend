import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useSessionStore } from './session'

export const useThemeStore = defineStore('theme', () => {
  // Inicializamos leyendo la clase 'dark' que index.html ya evaluó (modo claro por defecto)
  const isDark = ref(
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false
  )

  /**
   * Sincroniza la clase 'dark' en el elemento raíz <html> y persiste según corresponda.
   */
  function syncDocumentClass() {
    if (typeof document === 'undefined') return

    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    try {
      const sessionStore = useSessionStore()
      const themeValue = isDark.value ? 'dark' : 'light'

      // Si el usuario tiene una sesión iniciada, guardamos su preferencia permanente de usuario
      if (sessionStore.isAuthenticated) {
        localStorage.setItem('hengest_user_theme', themeValue)
        if (sessionStore.user) {
          sessionStore.user.theme = themeValue
        }
      } else {
        // En navegación pública sin sesión, guardamos solo en sessionStorage para la pestaña actual
        sessionStorage.setItem('hengest_guest_theme', themeValue)
      }
    } catch {
      // Manejo silencioso ante bloqueos de almacenamiento
    }
  }

  /**
   * Alterna entre modo claro y oscuro.
   */
  function toggleTheme() {
    isDark.value = !isDark.value
    syncDocumentClass()
  }

  /**
   * Asigna un modo específico.
   * @param {'dark' | 'light'} theme
   */
  function setTheme(theme) {
    isDark.value = theme === 'dark'
    syncDocumentClass()
  }

  /**
   * Aplica la preferencia del usuario tras iniciar sesión en su cuenta.
   * @param {'dark' | 'light'} userPreference
   */
  function applyUserPreference(userPreference) {
    if (userPreference) {
      isDark.value = userPreference === 'dark'
      syncDocumentClass()
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    applyUserPreference,
  }
})
