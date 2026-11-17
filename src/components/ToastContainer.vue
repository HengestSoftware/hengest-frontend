<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()
</script>

<template>
  <div
    class="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:w-96 z-50 space-y-2 pointer-events-none"
    role="region"
    aria-label="Notificaciones del sistema"
  >
    <transition-group
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-2 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto p-4 rounded-2xl glass-panel shadow-xl border flex items-start justify-between gap-3 text-xs sm:text-sm font-medium"
        :class="[
          toast.type === 'success'
            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100'
            : toast.type === 'error'
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-950 dark:text-rose-100'
              : 'border-emerald-500/30 bg-canvas text-primary',
        ]"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-start gap-2.5">
          <!-- Icono de éxito -->
          <svg
            v-if="toast.type === 'success'"
            class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!-- Icono de error -->
          <svg
            v-else-if="toast.type === 'error'"
            class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>

          <p class="leading-relaxed">{{ toast.message }}</p>
        </div>

        <button
          type="button"
          class="text-muted hover:text-primary transition-colors p-1 rounded-md"
          aria-label="Cerrar notificación"
          @click="remove(toast.id)"
        >
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>
