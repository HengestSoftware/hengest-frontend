<script setup>
import { reactive, ref } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import { useAuthStore } from '@/stores/auth'
import authApi from '@/api/auth'
import { formatDate } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const isChangingPassword = ref(false)
const passwordForm = reactive({
  password_actual: '',
  password_nueva: '',
  password_confirmar: '',
})

async function handleChangePassword() {
  if (!passwordForm.password_actual || !passwordForm.password_nueva) {
    toast.error('Complete todos los campos de contraseña')
    return
  }
  if (passwordForm.password_nueva !== passwordForm.password_confirmar) {
    toast.error('La nueva contraseña y su confirmación no coinciden')
    return
  }
  if (passwordForm.password_nueva.length < 6) {
    toast.error('La nueva contraseña debe tener al menos 6 caracteres')
    return
  }

  isChangingPassword.value = true
  try {
    await authApi.cambiarPassword({
      password_actual: passwordForm.password_actual,
      password_nueva: passwordForm.password_nueva,
    })
    toast.success('Contraseña actualizada con éxito')
    passwordForm.password_actual = ''
    passwordForm.password_nueva = ''
    passwordForm.password_confirmar = ''
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Error al cambiar la contraseña. Verifique su clave actual.')
  } finally {
    isChangingPassword.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
        Mi Perfil y Cumplimiento
      </h1>
      <p class="text-xs sm:text-sm text-secondary">
        Datos de acceso a la cuenta y estado legal de protección de datos
      </p>
    </div>

    <!-- Tarjeta de información del usuario -->
    <GlassCard padding="lg" class="border border-emerald-500/25 space-y-4">
      <div class="flex items-center justify-between border-b border-glass-border pb-3">
        <h2 class="text-base font-bold text-primary">Información de la Cuenta</h2>
        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
          {{ authStore.user?.rol }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <span class="text-muted block">Nombre completo</span>
          <strong class="text-sm font-bold text-primary">{{ authStore.user?.nombre }}</strong>
        </div>
        <div>
          <span class="text-muted block">Correo electrónico</span>
          <strong class="text-sm font-bold text-primary">{{ authStore.user?.email }}</strong>
        </div>
        <div>
          <span class="text-muted block">Granja asociada</span>
          <strong class="text-sm font-bold text-primary">{{ authStore.granja?.nombre }}</strong>
        </div>
        <div>
          <span class="text-muted block">Municipio / Sede</span>
          <strong class="text-sm font-bold text-primary">{{ authStore.granja?.municipio || 'Colombia' }}</strong>
        </div>
      </div>

      <!-- Estado Ley 1581 -->
      <div class="pt-3 border-t border-glass-border">
        <div class="p-3 rounded-2xl glass-pill flex items-center justify-between text-xs">
          <div class="space-y-0.5">
            <span class="font-bold text-primary block">Términos y Tratamiento de Datos (Ley 1581)</span>
            <span class="text-muted text-[11px]">
              Aceptados el: {{ formatDate(authStore.user?.acepto_terminos_en) }}
            </span>
          </div>
          <span class="text-emerald-700 dark:text-emerald-300 font-bold text-xs">✓ Vigente</span>
        </div>
      </div>
    </GlassCard>

    <!-- Cambio de contraseña -->
    <GlassCard padding="lg" class="border border-emerald-500/25 space-y-4">
      <h2 class="text-base font-bold text-primary border-b border-glass-border pb-3">
        Cambiar Contraseña
      </h2>

      <form class="space-y-4 text-xs" @submit.prevent="handleChangePassword">
        <div class="space-y-1">
          <label class="block font-semibold">Contraseña actual *</label>
          <input
            v-model="passwordForm.password_actual"
            type="password"
            required
            autocomplete="current-password"
            class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-primary text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
          >
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block font-semibold">Nueva contraseña *</label>
            <input
              v-model="passwordForm.password_nueva"
              type="password"
              required
              autocomplete="new-password"
              placeholder="Mínimo 6 caracteres"
              class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-primary text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
            >
          </div>

          <div class="space-y-1">
            <label class="block font-semibold">Confirmar nueva contraseña *</label>
            <input
              v-model="passwordForm.password_confirmar"
              type="password"
              required
              autocomplete="new-password"
              class="w-full h-11 px-3 rounded-xl glass-pill bg-canvas text-primary text-sm border border-emerald-500/30 focus:border-emerald-500 focus:outline-none"
            >
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <AppButton
            variant="primary"
            size="md"
            type="submit"
            :disabled="isChangingPassword"
          >
            {{ isChangingPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
          </AppButton>
        </div>
      </form>
    </GlassCard>
  </div>
</template>
