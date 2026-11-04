<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    type="button"
    class="glass-pill relative inline-flex items-center justify-center w-10 h-10 rounded-full text-secondary hover:text-primary hover:border-emerald-500/40 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-500"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="toggleTheme"
  >
    <!-- Ícono de Sol (aparece cuando está en modo oscuro para invitar a pasar a claro) -->
    <svg
      v-if="isDark"
      class="w-5 h-5 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
    </svg>

    <!-- Ícono de Luna (aparece cuando está en modo claro para invitar a pasar a oscuro) -->
    <svg
      v-else
      class="w-5 h-5 text-emerald-800 transition-transform duration-300 hover:-rotate-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

