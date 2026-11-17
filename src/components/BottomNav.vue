<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAlertasStore } from '@/stores/alertas'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const alertasStore = useAlertasStore()
const authStore = useAuthStore()

const isMoreMenuOpen = ref(false)

function toggleMore() {
  isMoreMenuOpen.value = !isMoreMenuOpen.value
}

function closeMore() {
  isMoreMenuOpen.value = false
}

function handleLogout() {
  closeMore()
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- Menú desplegable "Más" para móvil -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="isMoreMenuOpen"
        class="fixed inset-x-4 bottom-20 z-50 rounded-3xl glass-panel-elevated p-4 border border-emerald-500/30 shadow-2xl space-y-2 md:hidden"
      >
        <div class="flex items-center justify-between pb-3 border-b border-glass-border">
          <div>
            <p class="text-xs font-bold text-primary">{{ authStore.user?.nombre || 'Usuario' }}</p>
            <p class="text-[10px] text-muted">{{ authStore.granja?.nombre || 'Granja' }} · {{ authStore.user?.rol }}</p>
          </div>
          <button
            type="button"
            class="text-muted hover:text-primary p-1"
            @click="closeMore"
          >
            ✕
          </button>
        </div>

        <nav class="grid grid-cols-2 gap-2 text-xs font-semibold py-1">
          <RouterLink
            to="/registros"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>📋</span> Historial
          </RouterLink>
          <RouterLink
            to="/galpones"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>🏠</span> Galpones
          </RouterLink>
          <RouterLink
            to="/lotes"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>🐔</span> Lotes
          </RouterLink>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/reportes"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>📊</span> Reportes
          </RouterLink>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/usuarios"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>👥</span> Usuarios
          </RouterLink>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/granja"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>⚙️</span> Granja
          </RouterLink>
          <RouterLink
            v-if="authStore.isAdmin"
            to="/suscripcion"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>💳</span> Suscripción
          </RouterLink>
          <RouterLink
            to="/perfil"
            class="p-2.5 rounded-xl glass-pill flex items-center gap-2 text-secondary hover:text-primary"
            @click="closeMore"
          >
            <span>👤</span> Mi Perfil
          </RouterLink>
        </nav>

        <div class="pt-2 border-t border-glass-border">
          <button
            type="button"
            class="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            @click="handleLogout"
          >
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Barra de navegación fija en móvil (48px touch targets) -->
    <nav
      class="md:hidden fixed bottom-0 inset-x-0 z-40 glass-navbar bg-canvas/90 border-t border-glass-border px-3 py-1 flex items-center justify-around h-16 shadow-lg"
      aria-label="Navegación móvil inferior"
    >
      <!-- Inicio / Dashboard -->
      <RouterLink
        to="/dashboard"
        class="flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors"
        :class="route.path === '/dashboard' || route.path === '/' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-muted hover:text-primary'"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        <span class="text-[10px] mt-0.5">Inicio</span>
      </RouterLink>

      <!-- Botón central destacado: Registrar -->
      <RouterLink
        to="/registro"
        class="flex flex-col items-center justify-center w-16 h-14 -mt-3 rounded-2xl bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-700/30 transition-transform active:scale-95"
      >
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span class="text-[10px] font-bold">Registrar</span>
      </RouterLink>

      <!-- Alertas con badge -->
      <RouterLink
        to="/alertas"
        class="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors"
        :class="route.path === '/alertas' ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-muted hover:text-primary'"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <span
          v-if="alertasStore.unreadCount > 0"
          class="absolute top-2 right-2 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
        >
          {{ alertasStore.unreadCount > 9 ? '9+' : alertasStore.unreadCount }}
        </span>
        <span class="text-[10px] mt-0.5">Alertas</span>
      </RouterLink>

      <!-- Botón Más -->
      <button
        type="button"
        class="flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-colors text-muted hover:text-primary cursor-pointer"
        :class="isMoreMenuOpen ? 'text-emerald-700 dark:text-emerald-400' : ''"
        @click="toggleMore"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <span class="text-[10px] mt-0.5">Más</span>
      </button>
    </nav>
  </div>
</template>
