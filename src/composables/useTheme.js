import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

/**
 * Composable para interactuar con el tema activo de la aplicación.
 * Modo claro predeterminado al entrar; editable manualmente o guardado en sesión de usuario.
 */
export function useTheme() {
  const themeStore = useThemeStore()
  const { isDark } = storeToRefs(themeStore)

  return {
    isDark,
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
    applyUserPreference: themeStore.applyUserPreference,
  }
}
