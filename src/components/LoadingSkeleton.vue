<script setup>
defineProps({
  lines: {
    type: Number,
    default: 3,
  },
  type: {
    type: String,
    default: 'cards', // 'cards' | 'table' | 'text'
  },
})
</script>

<template>
  <div class="w-full space-y-4 animate-pulse" role="status" aria-label="Cargando contenido">
    <!-- Esqueleto de tarjetas -->
    <div v-if="type === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-28 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/15 p-4 flex flex-col justify-between"
      >
        <div class="h-3 w-1/2 bg-emerald-500/20 rounded-full" />
        <div class="h-6 w-3/4 bg-emerald-500/25 rounded-md" />
        <div class="h-2.5 w-1/3 bg-emerald-500/15 rounded-full" />
      </div>
    </div>

    <!-- Esqueleto de tabla -->
    <div v-else-if="type === 'table'" class="space-y-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15">
      <div class="h-6 bg-emerald-500/15 rounded-md w-full mb-4" />
      <div v-for="i in lines" :key="i" class="h-10 bg-emerald-500/10 rounded-xl w-full" />
    </div>

    <!-- Esqueleto de texto -->
    <div v-else class="space-y-2.5">
      <div v-for="i in lines" :key="i" class="h-4 bg-emerald-500/15 rounded-md" :style="{ width: `${85 - i * 10}%` }" />
    </div>
  </div>
</template>
