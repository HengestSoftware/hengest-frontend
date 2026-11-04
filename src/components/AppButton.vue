<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'outline'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  to: {
    type: [String, Object],
    default: null,
  },
  href: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
})

const isTag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return 'button'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return [
        'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white',
        'dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:active:bg-emerald-600 dark:text-emerald-950 font-semibold',
        'shadow-md hover:shadow-lg shadow-emerald-700/20 dark:shadow-emerald-900/30',
        'border border-emerald-500/30 dark:border-emerald-300/40',
      ].join(' ')
    case 'secondary':
      return [
        'glass-panel hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40',
        'text-primary font-medium border-emerald-600/25 dark:border-emerald-400/25',
        'hover:border-emerald-600/40 dark:hover:border-emerald-400/40',
      ].join(' ')
    case 'outline':
      return [
        'bg-transparent border-2 border-emerald-600/40 dark:border-emerald-400/35',
        'text-primary hover:bg-emerald-500/10 font-medium',
      ].join(' ')
    case 'ghost':
    default:
      return [
        'bg-transparent text-secondary hover:text-primary hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15',
        'font-medium border border-transparent',
      ].join(' ')
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-3.5 py-1.5 min-h-[38px] rounded-full gap-1.5'
    case 'lg':
      return 'text-base px-6 py-3 min-h-[48px] rounded-full gap-2.5 font-semibold'
    case 'md':
    default:
      return 'text-sm px-4.5 py-2.5 min-h-[44px] rounded-full gap-2'
  }
})
</script>

<template>
  <component
    :is="isTag"
    :to="to"
    :href="href"
    :type="isTag === 'button' ? type : undefined"
    :disabled="isTag === 'button' ? disabled : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :class="[
      'inline-flex items-center justify-center text-center transition-all duration-200 select-none cursor-pointer',
      'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
      fullWidth ? 'w-full' : '',
      variantClasses,
      sizeClasses,
    ]"
  >
    <slot />
  </component>
</template>

