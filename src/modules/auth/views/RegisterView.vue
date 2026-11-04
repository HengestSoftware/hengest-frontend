<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import BrandLogo from '@/components/BrandLogo.vue'

const fullName = ref('')
const farmName = ref('')
const email = ref('')
const password = ref('')
const showNotice = ref(false)
const errors = ref({})

function handleRegister(event) {
  event.preventDefault()
  errors.value = {}

  if (!fullName.value.trim()) {
    errors.value.fullName = 'Ingrese su nombre completo'
  }

  if (!farmName.value.trim()) {
    errors.value.farmName = 'Ingrese el nombre de la granja'
  }

  if (!email.value) {
    errors.value.email = 'Ingrese su correo electrónico'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Ingrese un correo electrónico válido'
  }

  if (!password.value) {
    errors.value.password = 'Ingrese una contraseña segura'
  } else if (password.value.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (Object.keys(errors.value).length === 0) {
    // Sin llamado a API: aviso informativo de desarrollo
    showNotice.value = true
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-14rem)] flex items-center justify-center px-4 py-12 sm:px-6">
    <div class="w-full max-w-lg">
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
            Crear cuenta de granja
          </h1>
          <p class="text-xs sm:text-sm text-secondary">
            Comience a controlar la postura y los lotes de sus galpones
          </p>
        </div>

        <!-- Banner informativo de "Próximamente" tras enviar -->
        <div
          v-if="showNotice"
          class="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <div class="flex items-start gap-2.5">
            <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <div>
              <p class="font-bold text-primary">Registro en habilitación (Próximamente)</p>
              <p class="mt-1 text-secondary">
                El alta de nuevas granjas se abrirá en la siguiente fase cuando esté conectado el servidor seguro. No se guardaron datos sensibles.
              </p>
            </div>
          </div>
        </div>

        <!-- Formulario accesible -->
        <form novalidate class="space-y-4" @submit="handleRegister">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Campo Nombre Completo -->
            <div class="space-y-1.5">
              <label for="reg-name" class="block text-xs font-semibold text-primary">
                Nombre y apellido
              </label>
              <input
                id="reg-name"
                v-model="fullName"
                type="text"
                name="name"
                autocomplete="name"
                required
                placeholder="Carlos Pérez"
                class="w-full px-4 py-2.5 rounded-xl glass-pill bg-canvas/60 text-primary placeholder:text-muted/60 text-sm border transition-colors focus:border-emerald-500 focus:outline-none"
                :class="errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-emerald-500/20'"
                :aria-invalid="!!errors.fullName"
                :aria-describedby="errors.fullName ? 'reg-name-error' : undefined"
              >
              <p
                v-if="errors.fullName"
                id="reg-name-error"
                class="text-[11px] font-medium text-rose-600 dark:text-rose-400"
              >
                {{ errors.fullName }}
              </p>
            </div>

            <!-- Campo Nombre de la Granja -->
            <div class="space-y-1.5">
              <label for="reg-farm" class="block text-xs font-semibold text-primary">
                Nombre de la granja
              </label>
              <input
                id="reg-farm"
                v-model="farmName"
                type="text"
                name="organization"
                autocomplete="organization"
                required
                placeholder="Granja La Colina"
                class="w-full px-4 py-2.5 rounded-xl glass-pill bg-canvas/60 text-primary placeholder:text-muted/60 text-sm border transition-colors focus:border-emerald-500 focus:outline-none"
                :class="errors.farmName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-emerald-500/20'"
                :aria-invalid="!!errors.farmName"
                :aria-describedby="errors.farmName ? 'reg-farm-error' : undefined"
              >
              <p
                v-if="errors.farmName"
                id="reg-farm-error"
                class="text-[11px] font-medium text-rose-600 dark:text-rose-400"
              >
                {{ errors.farmName }}
              </p>
            </div>
          </div>

          <!-- Campo Correo -->
          <div class="space-y-1.5">
            <label for="reg-email" class="block text-xs font-semibold text-primary">
              Correo electrónico
            </label>
            <input
              id="reg-email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              required
              placeholder="contacto@granjalacolina.com"
              class="w-full px-4 py-2.5 rounded-xl glass-pill bg-canvas/60 text-primary placeholder:text-muted/60 text-sm border transition-colors focus:border-emerald-500 focus:outline-none"
              :class="errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-emerald-500/20'"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'reg-email-error' : undefined"
            >
            <p
              v-if="errors.email"
              id="reg-email-error"
              class="text-[11px] font-medium text-rose-600 dark:text-rose-400"
            >
              {{ errors.email }}
            </p>
          </div>

          <!-- Campo Contraseña -->
          <div class="space-y-1.5">
            <label for="reg-password" class="block text-xs font-semibold text-primary">
              Contraseña
            </label>
            <input
              id="reg-password"
              v-model="password"
              type="password"
              name="password"
              autocomplete="new-password"
              required
              placeholder="Mínimo 6 caracteres"
              class="w-full px-4 py-2.5 rounded-xl glass-pill bg-canvas/60 text-primary placeholder:text-muted/60 text-sm border transition-colors focus:border-emerald-500 focus:outline-none"
              :class="errors.password ? 'border-rose-500 ring-1 ring-rose-500' : 'border-emerald-500/20'"
              :aria-invalid="!!errors.password"
              :aria-describedby="errors.password ? 'reg-password-error' : undefined"
            >
            <p
              v-if="errors.password"
              id="reg-password-error"
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
            >
              Crear cuenta de granja
            </AppButton>
          </div>
        </form>

        <!-- Enlace cruzado a Login -->
        <div class="mt-6 pt-4 border-t border-glass-border text-center text-xs text-secondary">
          <span>¿Ya tiene una cuenta creada?</span>
          <RouterLink
            to="/login"
            class="ml-1.5 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Iniciar sesión aquí
          </RouterLink>
        </div>

        <div class="mt-3 text-center">
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

