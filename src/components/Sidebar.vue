<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAlertasStore } from '@/stores/alertas'
import BrandLogo from '@/components/BrandLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const alertasStore = useAlertasStore()

const navLinks = computed(() => {
  const base = [
    { label: 'Dashboard', path: '/dashboard', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
    { label: 'Registro Diario', path: '/registro', icon: 'M12 4.5v15m7.5-7.5h-15' },
    { label: 'Historial', path: '/registros', icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
    { label: 'Galpones', path: '/galpones', icon: 'M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545' },
    { label: 'Lotes de Aves', path: '/lotes', icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' },
    { label: 'Alertas', path: '/alertas', icon: 'M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0', badge: alertasStore.unreadCount },
  ]

  if (authStore.isAdmin) {
    base.push(
      { label: 'Reportes', path: '/reportes', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
      { label: 'Usuarios', path: '/usuarios', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
      { label: 'Config. Granja', path: '/granja', icon: 'M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75' },
      { label: 'Suscripción', path: '/suscripcion', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z' }
    )
  }

  base.push({ label: 'Mi Perfil', path: '/perfil', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' })

  return base
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="hidden md:flex flex-col w-64 lg:w-72 fixed inset-y-0 z-30 glass-panel border-r border-glass-border">
    <!-- Encabezado de marca y granja -->
    <div class="p-5 border-b border-glass-border flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <BrandLogo size="md" />
        <ThemeToggle />
      </div>

      <!-- Pastilla con datos de la granja y usuario -->
      <div class="mt-2 p-3 rounded-2xl glass-pill flex items-center justify-between gap-2">
        <div class="overflow-hidden">
          <p class="text-xs font-bold text-primary truncate">
            {{ authStore.granja?.nombre || 'Granja' }}
          </p>
          <p class="text-[11px] text-muted truncate">
            {{ authStore.user?.nombre || 'Usuario' }}
          </p>
        </div>
        <span
          class="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
          :class="authStore.isAdmin ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'"
        >
          {{ authStore.user?.rol }}
        </span>
      </div>
    </div>

    <!-- Navegación principal -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Navegación de escritorio">
      <RouterLink
        v-for="item in navLinks"
        :key="item.path"
        :to="item.path"
        class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-colors"
        :class="route.path === item.path ? 'bg-emerald-600 text-white shadow-sm' : 'text-secondary hover:text-primary hover:bg-emerald-500/10'"
      >
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
          </svg>
          <span>{{ item.label }}</span>
        </div>

        <span
          v-if="item.badge > 0"
          class="px-2 py-0.5 text-[10px] font-bold rounded-full"
          :class="route.path === item.path ? 'bg-white text-emerald-700' : 'bg-rose-600 text-white'"
        >
          {{ item.badge > 9 ? '9+' : item.badge }}
        </span>
      </RouterLink>
    </nav>

    <!-- Botón de cierre de sesión -->
    <div class="p-4 border-t border-glass-border">
      <button
        type="button"
        class="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        @click="handleLogout"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
        </svg>
        <span>Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>
