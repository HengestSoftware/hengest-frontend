<script setup>
import { computed } from 'vue'

const props = defineProps({
  severity: {
    type: String,
    required: true,
    validator: (v) => ['CRITICA', 'ADVERTENCIA', 'NORMAL', 'INFO'].includes(v.toUpperCase()),
  },
  label: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
})

const sev = computed(() => props.severity.toUpperCase())

const displayLabel = computed(() => {
  if (props.label) return props.label
  switch (sev.value) {
    case 'CRITICA':
      return 'Crítica'
    case 'ADVERTENCIA':
      return 'Advertencia'
    case 'NORMAL':
    case 'INFO':
    default:
      return 'Normal'
  }
})

const badgeClasses = computed(() => {
  switch (sev.value) {
    case 'CRITICA':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 ring-1 ring-rose-500/20'
    case 'ADVERTENCIA':
      return 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 ring-1 ring-amber-500/20'
    case 'NORMAL':
    case 'INFO':
    default:
      return 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border px-2.5 py-0.5 select-none',
      size === 'sm' ? 'text-[10px]' : 'text-xs',
      badgeClasses,
    ]"
  >
    <!-- Ícono para Crítica -->
    <svg
      v-if="sev === 'CRITICA'"
      class="w-3.5 h-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>

    <!-- Ícono para Advertencia -->
    <svg
      v-else-if="sev === 'ADVERTENCIA'"
      class="w-3.5 h-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>

    <!-- Ícono para Normal / Éxito -->
    <svg
      v-else
      class="w-3.5 h-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2.5"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>

    <span>{{ displayLabel }}</span>
  </span>
</template>
