<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import BrandLogo from '@/components/BrandLogo.vue'
import AppButton from '@/components/AppButton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navLinks = [
  { label: 'Funcionalidades', href: '/#funcionalidades' },
  { label: 'Cómo funciona', href: '/#como-funciona' },
  { label: 'Para quién', href: '/#para-quien' },
  { label: 'Preguntas', href: '/#preguntas' },
]

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <div class="relative min-h-screen flex flex-col bg-canvas text-primary">
    <!-- Fondo orgánico con orbes en forma de huevo desenfocados -->
    <div class="ambient-background" aria-hidden="true">
      <div class="egg-orb egg-orb-1" />
      <div class="egg-orb egg-orb-2" />
      <div class="egg-orb egg-orb-3" />
    </div>

    <!-- Barra de navegación fija con cascarón de cristal -->
    <header class="sticky top-0 z-50 w-full glass-navbar transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18 sm:h-20 gap-4">
          <!-- Logo de marca -->
          <BrandLogo size="md" subtitle="Huevo comercial" />

          <!-- Enlaces de navegación de escritorio -->
          <nav
            class="hidden md:flex items-center gap-1.5 lg:gap-2 glass-pill px-4 py-1.5 rounded-full"
            aria-label="Navegación principal"
          >
            <a
              v-for="link in navLinks"
              :key="link.href"
              :href="link.href"
              class="px-3 py-1.5 text-xs lg:text-sm font-medium text-secondary hover:text-primary hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 rounded-full transition-colors"
            >
              {{ link.label }}
            </a>
          </nav>

          <!-- Acciones de escritorio: Tema y Autenticación -->
          <div class="hidden sm:flex items-center gap-2.5">
            <ThemeToggle />

            <AppButton
              variant="ghost"
              size="sm"
              to="/login"
            >
              Iniciar sesión
            </AppButton>

            <AppButton
              variant="primary"
              size="sm"
              to="/registro"
            >
              Registrarse
            </AppButton>
          </div>

          <!-- Botón de menú móvil -->
          <div class="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              type="button"
              class="glass-pill p-2 rounded-xl text-secondary hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500"
              :aria-expanded="isMobileMenuOpen"
              aria-controls="mobile-navigation"
              aria-label="Abrir o cerrar menú de navegación"
              @click="toggleMobileMenu"
            >
              <svg
                v-if="!isMobileMenuOpen"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                v-else
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Menú desplegable móvil -->
      <div
        v-show="isMobileMenuOpen"
        id="mobile-navigation"
        class="sm:hidden glass-panel border-t border-glass-border px-4 pt-3 pb-6 space-y-3 animate-fade-in"
      >
        <nav class="flex flex-col space-y-1" aria-label="Navegación móvil">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="px-4 py-2.5 rounded-xl text-base font-medium text-secondary hover:text-primary hover:bg-emerald-500/10 transition-colors"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </a>
        </nav>
        <div class="pt-3 border-t border-glass-border flex flex-col gap-2.5">
          <AppButton
            variant="secondary"
            size="md"
            full-width
            to="/login"
            @click="closeMobileMenu"
          >
            Iniciar sesión
          </AppButton>
          <AppButton
            variant="primary"
            size="md"
            full-width
            to="/registro"
            @click="closeMobileMenu"
          >
            Registrarse
          </AppButton>
        </div>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="relative z-10 flex-1">
      <slot />
    </main>

    <!-- Pie de página -->
    <footer class="relative z-10 glass-panel border-t border-glass-border mt-20 pt-14 pb-10 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-10 border-b border-glass-border">
          <!-- Columna de marca -->
          <div class="md:col-span-2 space-y-3">
            <BrandLogo size="md" subtitle="Producción de huevo comercial" />
            <p class="text-sm text-secondary max-w-md leading-relaxed">
              Plataforma web para que granjas avícolas de postura comercial registren postura, mortalidad y alimento de forma ágil desde el galpón.
            </p>
            <div class="inline-flex items-center gap-2 text-xs font-medium text-muted glass-pill px-3 py-1 rounded-full">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Gestión técnica y productiva de galpones
            </div>
          </div>

          <!-- Columna enlaces rápidos -->
          <div class="space-y-3">
            <h2 class="text-xs font-semibold text-primary uppercase tracking-wider">
              Navegación
            </h2>
            <ul class="space-y-2 text-sm text-secondary">
              <li>
                <a href="/#funcionalidades" class="hover:text-primary transition-colors">Funcionalidades</a>
              </li>
              <li>
                <a href="/#como-funciona" class="hover:text-primary transition-colors">Cómo funciona</a>
              </li>
              <li>
                <a href="/#para-quien" class="hover:text-primary transition-colors">Para quién es</a>
              </li>
              <li>
                <a href="/#preguntas" class="hover:text-primary transition-colors">Preguntas frecuentes</a>
              </li>
            </ul>
          </div>

          <!-- Columna acceso -->
          <div class="space-y-3">
            <h2 class="text-xs font-semibold text-primary uppercase tracking-wider">
              Plataforma
            </h2>
            <ul class="space-y-2 text-sm text-secondary">
              <li>
                <RouterLink to="/login" class="hover:text-primary transition-colors">
                  Iniciar sesión
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/registro" class="hover:text-primary transition-colors">
                  Crear cuenta de granja
                </RouterLink>
              </li>
            </ul>
            <p class="text-xs text-muted pt-2 leading-relaxed">
              Enfocado 100% en el galpón. Sin nómina, sin facturación electrónica ni contabilidad.
            </p>
          </div>
        </div>

        <!-- Barra inferior de copyright -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2026 HENGEST. Diseñado para el campo colombiano.</p>
          <p class="text-[11px]">
            Desarrollado para avicultores, mayordomos y asesores técnicos.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

