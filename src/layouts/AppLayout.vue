<script setup>
import { onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import BottomNav from '@/components/BottomNav.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import OfflineBanner from '@/components/OfflineBanner.vue'
import SubscriptionBanner from '@/components/SubscriptionBanner.vue'
import ColdStartBanner from '@/components/ColdStartBanner.vue'
import ModalTerminos from '@/components/ModalTerminos.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useAuthStore } from '@/stores/auth'
import { useAlertasStore } from '@/stores/alertas'
import { useOfflineStore } from '@/stores/offline'

const authStore = useAuthStore()
const alertasStore = useAlertasStore()
const offlineStore = useOfflineStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    alertasStore.fetchAlertas({ leida: false }).catch(() => {})
    offlineStore.refreshPending()
  }
})
</script>

<template>
  <div class="relative min-h-screen flex flex-col md:flex-row bg-canvas text-primary">
    <!-- Orbes orgánicos de fondo translúcido -->
    <div class="ambient-background" aria-hidden="true">
      <div class="egg-orb egg-orb-1" />
      <div class="egg-orb egg-orb-2" />
      <div class="egg-orb egg-orb-3" />
    </div>

    <!-- Barra lateral en escritorio -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col md:pl-64 lg:pl-72 min-h-screen">
      <!-- Banners de estado globales -->
      <header class="sticky top-0 z-30 flex flex-col">
        <ColdStartBanner />
        <SubscriptionBanner />
        <OfflineBanner />

        <!-- Encabezado superior en móvil -->
        <div class="md:hidden glass-navbar px-4 py-3 flex items-center justify-between border-b border-glass-border">
          <BrandLogo size="sm" />
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-primary max-w-[120px] truncate">
              {{ authStore.granja?.nombre || 'Granja' }}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <!-- Vista de página autenticada -->
      <main class="relative z-10 flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>

      <!-- Navegación inferior fija en móvil -->
      <BottomNav />
    </div>

    <!-- Modal obligatorio de cumplimiento Ley 1581 -->
    <ModalTerminos />

    <!-- Notificaciones flotantes globales -->
    <ToastContainer />
  </div>
</template>
