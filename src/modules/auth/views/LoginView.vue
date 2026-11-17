<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import BrandLogo from '@/components/BrandLogo.vue'
import ColdStartBanner from '@/components/ColdStartBanner.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errors = ref({})

async function handleLogin(event) {
  event.preventDefault()
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'Ingrese su correo electrónico'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Ingrese un correo electrónico válido'
  }

  if (!password.value) {
    errors.value.password = 'Ingrese su contraseña'
  }

  if (Object.keys(errors.value).length > 0) return

  try {
    await authStore.login({
      email: email.value.trim(),
      password: password.value,
    })

    // Redirigir a la ruta solicitada o al dashboard
    const redirectTarget = route.query.redirect || '/dashboard'
    router.push(redirectTarget)
  } catch (err) {
    // El store ya asigna error.value
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 sm:px-6">
    <div class="w-full max-w-md space-y-4">
      <ColdStartBanner />

      <GlassCard
        elevated
        padding="lg"
        class="border border-emerald-500/25 shadow-2xl relative"
      >
        <!-- Logo y cabecera -->
        <div class="text-center space-y-3 mb-8">
          <div class="flex justify-center">
            <BrandLogo size="lg" :show-text="false" />
          </div>
          <h1 class="text-2xl font-display font-bold text-primary">
            Ingresar a HENGEST
          </h1>
          <p class="text-xs sm:text-sm text-secondary">
            Gestión y control diario de sus galpones de postura
          </p>
        </div>

        <!-- Error global de autenticación -->
        <div
          v-if="authStore.error"
          class="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-950 dark:text-rose-200 text-xs sm:text-sm animate-fade-in"
          role="alert"
        >
          <div class="flex items-start gap-2.5">
            <svg class="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p>{{ authStore.error }}</p>
          </div>
        </div>

        <!-- Formulario accesible -->
        <form novalidate class="space-y-4" @submit="handleLogin">
          <!-- Campo Correo -->
          <div class="space-y-1.5">
            <label for="login-email" class="block text-xs font-semibold text-primary">
              Correo electrónico
            </label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              placeholder="avicultor@granja.com"
              class="w-full px-4 py-2.5 rounded-xl glass-pill bg-canvas/60 text-primary placeholder:text-muted/60 text-sm border transition-colors focus:border-emerald-500 focus:outline-none"
              :class="errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-emerald-500/20'"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'login-email-error' : undefined"
            >
            <p
              v-if="errors.email"
              id="login-email-error"
              class="text-[11px] font-medium text-rose-600 dark:text-rose-400"
            >
              {{ errors.email }}
            </p>
          </div>

          <!-- Campo Contraseña con Mostrar/Ocultar -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="login-password" class="block text-xs font-semibold text-primary">
                Contraseña
              </label>
            </div>
            <div class="relative">
              <input
                id="login-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-2.5 pr-11 rounded-xl glass-pill bg-canvas/60 text-primary placeholder:text-muted/60 text-sm border transition-colors focus:border-emerald-500 focus:outline-none"
                :class="errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-emerald-500/20'"
                :aria-invalid="!!errors.password"
                :aria-describedby="errors.password ? 'login-password-error' : undefined"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors cursor-pointer p-1"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPassword = !showPassword"
              >
                <!-- Ojo tachado -->
                <svg v-if="showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                <!-- Ojo normal -->
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p
              v-if="errors.password"
              id="login-password-error"
              class="text-[11px] font-medium text-rose-600 dark:text-rose-400"
            >
              {{ errors.password }}
            </p>
          </div>

          <div class="pt-2">
            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              full-width
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? 'Iniciando sesión…' : 'Ingresar a la plataforma' }}
            </AppButton>
          </div>
        </form>

        <div class="mt-6 pt-4 border-t border-glass-border text-center">
          <RouterLink
            to="/"
            class="text-[11px] text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            ← Volver a la página principal
          </RouterLink>
        </div>
      </GlassCard>
    </div>
  </div>
</template>
