<script setup>
import AppButton from '@/components/AppButton.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  actionText: {
    type: String,
    default: '',
  },
  actionTo: {
    type: [String, Object],
    default: null,
  },
})

defineEmits(['action'])
</script>

<template>
  <div class="text-center py-12 px-4 rounded-3xl glass-panel border border-emerald-500/20 max-w-md mx-auto space-y-4">
    <div class="w-14 h-14 mx-auto rounded-2xl glass-pill flex items-center justify-center text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
      <slot name="icon">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </slot>
    </div>

    <div class="space-y-1.5">
      <h3 class="text-lg font-display font-bold text-primary">
        {{ title }}
      </h3>
      <p v-if="description" class="text-sm text-secondary leading-relaxed max-w-xs mx-auto">
        {{ description }}
      </p>
    </div>

    <div v-if="actionText" class="pt-2">
      <AppButton
        variant="primary"
        size="md"
        :to="actionTo"
        @click="$emit('action')"
      >
        {{ actionText }}
      </AppButton>
    </div>
  </div>
</template>
