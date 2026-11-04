<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: {
    type: String,
    default: 'div',
  },
  elevated: {
    type: Boolean,
    default: false,
  },
  glow: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
})

const paddingClasses = computed(() => {
  switch (props.padding) {
    case 'none':
      return 'p-0'
    case 'sm':
      return 'p-4 sm:p-5'
    case 'lg':
      return 'p-6 sm:p-8 lg:p-10'
    case 'md':
    default:
      return 'p-5 sm:p-6 lg:p-7'
  }
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300',
      elevated ? 'glass-panel-elevated' : 'glass-panel',
      paddingClasses,
      hoverable ? 'hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl' : '',
      glow ? 'ring-1 ring-emerald-500/20 shadow-emerald-900/10' : '',
    ]"
  >
    <!-- Reflejo interior sutil en esquina superior -->
    <div
      class="pointer-events-none absolute -top-12 -right-12 w-32 h-32 bg-white/20 dark:bg-emerald-400/10 rounded-full blur-2xl"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>

