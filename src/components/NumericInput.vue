<script setup>
const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  label: {
    type: String,
    default: '',
  },
  sublabel: {
    type: String,
    default: '',
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 999999,
  },
  step: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  unit: {
    type: String,
    default: 'u',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

function updateVal(val) {
  const num = parseInt(val, 10)
  const safe = isNaN(num) ? props.min : Math.min(props.max, Math.max(props.min, num))
  emit('update:modelValue', safe)
  emit('change', safe)
}

function decrement() {
  if (props.disabled) return
  const current = parseInt(props.modelValue, 10) || 0
  updateVal(current - props.step)
}

function increment() {
  if (props.disabled) return
  const current = parseInt(props.modelValue, 10) || 0
  updateVal(current + props.step)
}

function onInput(e) {
  updateVal(e.target.value)
}
</script>

<template>
  <div class="space-y-1.5">
    <div v-if="label || sublabel" class="flex items-center justify-between">
      <label class="block text-xs sm:text-sm font-semibold text-primary">
        {{ label }}
      </label>
      <span v-if="sublabel" class="text-[11px] text-muted">
        {{ sublabel }}
      </span>
    </div>

    <!-- Controles numéricos grandes con botones − / + (Touch targets >= 48px) -->
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass-pill bg-canvas text-xl font-bold text-primary flex items-center justify-center border border-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-emerald-500"
        :disabled="disabled || modelValue <= min"
        aria-label="Disminuir valor"
        @click="decrement"
      >
        −
      </button>

      <div class="relative flex-1">
        <input
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          :value="modelValue"
          :disabled="disabled"
          class="w-full h-12 sm:h-14 px-3 text-center text-lg sm:text-2xl font-bold font-mono tabular-nums rounded-2xl glass-pill bg-canvas text-primary border border-emerald-500/30 focus:border-emerald-500 focus:outline-none transition-colors"
          @input="onInput"
        >
        <span
          v-if="unit"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted pointer-events-none"
        >
          {{ unit }}
        </span>
      </div>

      <button
        type="button"
        class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass-pill bg-canvas text-xl font-bold text-primary flex items-center justify-center border border-emerald-500/25 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-emerald-500"
        :disabled="disabled || modelValue >= max"
        aria-label="Aumentar valor"
        @click="increment"
      >
        +
      </button>
    </div>
  </div>
</template>
