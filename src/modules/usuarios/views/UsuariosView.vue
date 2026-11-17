<script setup>
import { ref, reactive, onMounted } from 'vue'
import GlassCard from '@/components/GlassCard.vue'
import AppButton from '@/components/AppButton.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import EmptyState from '@/components/EmptyState.vue'
import usuariosApi from '@/api/usuarios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const authStore = useAuthStore()
const toast = useToast()

const usuarios = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const showPasswordModal = ref(false)
const selectedUser = ref(null)

const form = reactive({
  email: '',
  nombre: '',
  rol: 'OPERARIO',
  password: '',
})

const passwordForm = reactive({
  password_nueva: '',
})

async function loadUsuarios() {
  isLoading.value = true
  try {
    const res = await usuariosApi.getUsuarios()
    usuarios.value = Array.isArray(res) ? res : res.results || []
  } catch (err) {
    toast.error('Error al cargar la lista de usuarios')
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  form.email = ''
  form.nombre = ''
  form.rol = 'OPERARIO'
  form.password = ''
  showModal.value = true
}

function openResetPasswordModal(user) {
  selectedUser.value = user
  passwordForm.password_nueva = ''
  showPasswordModal.value = true
}

async function handleSaveUser() {
  if (!form.email || !form.nombre || !form.password) {
    toast.error('Complete todos los campos obligatorios')
    return
  }

  try {
    await usuariosApi.createUsuario({
      email: form.email.trim(),
      nombre: form.nombre.trim(),
      rol: form.rol,
      password: form.password,
    })
    toast.success('Usuario creado exitosamente')
    showModal.value = false
    loadUsuarios()
  } catch (err) {
    toast.error(err.response?.data?.email?.[0] || 'Error al crear usuario')
  }
}

async function handleToggleActivo(user) {
  if (user.id === authStore.user?.id) {
    toast.error('No puede desactivar su propio usuario')
    return
  }

  const accion = user.activo ? 'desactivar' : 'activar'
  if (!confirm(`¿Confirma que desea ${accion} al usuario ${user.nombre}?`)) return

  try {
    if (user.activo) {
      await usuariosApi.deleteUsuario(user.id)
    } else {
      await usuariosApi.updateUsuario(user.id, { activo: true })
    }
    toast.success(`Usuario ${accion}do exitosamente`)
    loadUsuarios()
  } catch (err) {
    toast.error('Error al cambiar estado del usuario')
  }
}

async function handleResetPassword() {
  if (!passwordForm.password_nueva || passwordForm.password_nueva.length < 6) {
    toast.error('La contraseña debe tener mínimo 6 caracteres')
    return
  }

  try {
    await usuariosApi.updateUsuario(selectedUser.value.id, {
      password: passwordForm.password_nueva,
    })
    toast.success('Contraseña restablecida')
    showPasswordModal.value = false
  } catch (err) {
    toast.error('Error al restablecer contraseña')
  }
}

onMounted(() => {
  loadUsuarios()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-display font-bold text-primary">
          Usuarios y Permisos
        </h1>
        <p class="text-xs sm:text-sm text-secondary">
          Gestione los operarios de campo y administradores de <strong class="text-primary">{{ authStore.granja?.nombre }}</strong>
        </p>
      </div>

      <AppButton variant="primary" size="md" @click="openCreateModal">
        + Nuevo Usuario
      </AppButton>
    </div>

    <LoadingSkeleton v-if="isLoading" type="cards" />

    <EmptyState
      v-else-if="usuarios.length === 0"
      title="No hay usuarios registrados"
      description="Cree cuentas para sus mayordomos y galponeros para que ingresen recolecciones desde su celular."
      action-text="Crear usuario"
      @action="openCreateModal"
    />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GlassCard
        v-for="u in usuarios"
        :key="u.id"
        padding="lg"
        hoverable
        class="border border-emerald-500/20 flex flex-col justify-between space-y-4"
      >
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span
              class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              :class="u.rol === 'ADMIN' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'"
            >
              {{ u.rol }}
            </span>
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="u.activo ? 'text-emerald-700 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'"
            >
              {{ u.activo ? 'Activo' : 'Desactivado' }}
            </span>
          </div>

          <div>
            <h2 class="text-lg font-display font-bold text-primary">{{ u.nombre }}</h2>
            <p class="text-xs text-muted">{{ u.email }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-glass-border flex items-center justify-between text-xs">
          <button
            type="button"
            class="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            @click="openResetPasswordModal(u)"
          >
            Restablecer clave
          </button>

          <button
            v-if="u.id !== authStore.user?.id"
            type="button"
            class="text-rose-600 dark:text-rose-400 font-semibold hover:underline"
            @click="handleToggleActivo(u)"
          >
            {{ u.activo ? 'Desactivar' : 'Activar' }}
          </button>
        </div>
      </GlassCard>
    </div>

    <!-- Modal Crear Usuario -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-md p-6 rounded-3xl glass-panel-elevated border border-emerald-500/30 space-y-4">
        <h2 class="text-lg font-bold text-primary">Crear Cuenta de Usuario</h2>

        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-semibold mb-1">Nombre completo *</label>
            <input
              v-model="form.nombre"
              type="text"
              placeholder="Ej: Pedro Galponero"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
          <div>
            <label class="block font-semibold mb-1">Correo electrónico *</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="operario@granja.com"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
          <div>
            <label class="block font-semibold mb-1">Rol en la granja *</label>
            <select
              v-model="form.rol"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
              <option value="OPERARIO">OPERARIO (Registro en galpón desde celular)</option>
              <option value="ADMIN">ADMIN (Configuración, reportes y suscripción)</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold mb-1">Contraseña inicial *</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
            >
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-3 py-1.5 text-xs text-muted" @click="showModal = false">
            Cancelar
          </button>
          <AppButton variant="primary" size="sm" @click="handleSaveUser">
            Crear usuario
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Modal Restablecer Contraseña -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div class="w-full max-w-sm p-6 rounded-3xl glass-panel-elevated border border-emerald-500/30 space-y-4">
        <h2 class="text-base font-bold text-primary">Restablecer Contraseña</h2>
        <p class="text-xs text-muted">Usuario: {{ selectedUser?.nombre }} ({{ selectedUser?.email }})</p>

        <div class="space-y-2 text-xs">
          <label class="block font-semibold">Nueva contraseña *</label>
          <input
            v-model="passwordForm.password_nueva"
            type="password"
            placeholder="Mínimo 6 caracteres"
            class="w-full h-11 px-3 rounded-xl bg-canvas border border-emerald-500/30 text-primary"
          >
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="px-3 py-1.5 text-xs text-muted" @click="showPasswordModal = false">
            Cancelar
          </button>
          <AppButton variant="primary" size="sm" @click="handleResetPassword">
            Actualizar clave
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
