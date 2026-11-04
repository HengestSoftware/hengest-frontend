<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import logoSrc from '@/assets/logo/hengest-logo.png'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  showText: {
    type: Boolean,
    default: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '/',
  },
  asLink: {
    type: Boolean,
    default: true,
  },
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        wrapper: 'h-8',
        img: 'w-7 h-7',
        text: 'text-lg',
        sub: 'text-[10px]',
      }
    case 'lg':
      return {
        wrapper: 'h-14',
        img: 'w-12 h-12',
        text: 'text-2xl',
        sub: 'text-xs',
      }
    case 'md':
    default:
      return {
        wrapper: 'h-10',
        img: 'w-9 h-9',
        text: 'text-xl',
        sub: 'text-[11px]',
      }
  }
})
</script>

<template>
  <component
    :is="asLink ? RouterLink : 'div'"
    :to="asLink ? to : undefined"
    class="inline-flex items-center gap-2.5 group select-none transition-transform duration-200 active:scale-95"
    :aria-label="showText ? undefined : 'HENGEST - Inicio'"
  >
    <!-- Pastilla de cristal con el isotipo para garantizar alto contraste en ambos temas -->
    <div
      class="glass-pill rounded-full p-1.5 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors shadow-xs"
    >
      <img
        :src="logoSrc"
        alt="Logo de HENGEST: gallina abrazando un huevo"
        :class="[
          sizeClasses.img,
          'object-contain transition-all duration-300 dark:brightness-0 dark:invert dark:opacity-95 drop-shadow-xs',
        ]"
        width="48"
        height="48"
        loading="eager"
      >
    </div>

    <div v-if="showText" class="flex flex-col leading-tight">
      <span
        :class="[
          sizeClasses.text,
          'font-display font-bold tracking-tight text-primary transition-colors group-hover:text-emerald-700 dark:group-hover:text-emerald-400',
        ]"
      >
        HENGEST
      </span>
      <span
        v-if="subtitle"
        :class="[
          sizeClasses.sub,
          'text-muted font-medium tracking-wide uppercase',
        ]"
      >
        {{ subtitle }}
      </span>
    </div>
  </component>
</template>

