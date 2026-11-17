import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  function add(message, type = 'info', duration = 4000) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function remove(id) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    success: (msg, dur) => add(msg, 'success', dur),
    error: (msg, dur) => add(msg, 'error', dur || 6000),
    info: (msg, dur) => add(msg, 'info', dur),
    remove,
  }
}
