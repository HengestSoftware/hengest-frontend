<script setup>
import GlassCard from '@/components/GlassCard.vue'
</script>

<template>
  <section id="funcionalidades" class="relative py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Encabezado de sección -->
      <div class="max-w-3xl mb-12 sm:mb-16">
        <span class="glass-pill text-xs font-semibold px-4 py-1.5 rounded-full text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
          Módulos y herramientas
        </span>
        <h2 class="text-3xl sm:text-4xl font-display font-bold text-primary tracking-tight mt-3">
          Todo lo que pasa en el galpón, bajo control y en su mano
        </h2>
        <p class="text-base text-secondary leading-relaxed mt-3">
          Diseñado con el flujo de trabajo real de las granjas de postura comercial: recolección matutina, clasificación, pesaje de alimento y chequeo sanitario.
        </p>
      </div>

      <!-- Cuadrícula Bento asimétrica -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <!-- Tarjeta 1 (Bento Principal - 8 columnas lg): Recolección diaria y cubetas automáticas -->
        <GlassCard
          padding="lg"
          hoverable
          class="lg:col-span-8 flex flex-col justify-between border border-emerald-500/25 bg-gradient-to-br from-emerald-500/5 to-transparent"
        >
          <div>
            <div class="flex items-center justify-between gap-4 mb-4">
              <span class="glass-pill text-xs font-bold px-3 py-1 rounded-full text-emerald-700 dark:text-emerald-300">
                Núcleo productivo
              </span>
              <div class="flex gap-1.5">
                <span
                  v-for="cat in ['AAA', 'AA', 'A', 'B', 'C']"
                  :key="cat"
                  class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20"
                >
                  {{ cat }}
                </span>
              </div>
            </div>

            <h3 class="text-xl sm:text-2xl font-display font-bold text-primary">
              Recolección diaria clasificada con cubetas automáticas de 30 unidades
            </h3>
            <p class="text-sm sm:text-base text-secondary leading-relaxed mt-2 max-w-2xl">
              Ingrese los huevos recogidos por categoría comercial (AAA, AA, A, B y C). HENGEST calcula al instante cuántas cubetas completas de 30 huevos tiene listas para despacho y cuántas unidades sueltas quedan.
            </p>
          </div>

          <!-- Representación visual integrada en la tarjeta -->
          <div class="mt-6 pt-6 border-t border-glass-border grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="glass-pill p-3 rounded-xl text-center">
              <p class="text-[10px] text-muted uppercase font-bold">Cat. AAA</p>
              <p class="text-lg font-bold text-primary tabular-nums">12 <span class="text-xs font-normal text-muted">cub</span></p>
              <span class="text-[10px] text-secondary">360 huevos</span>
            </div>
            <div class="glass-pill p-3 rounded-xl text-center ring-1 ring-emerald-500/30">
              <p class="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold">Cat. AA (Mayor)</p>
              <p class="text-lg font-bold text-primary tabular-nums">34 <span class="text-xs font-normal text-muted">cub</span></p>
              <span class="text-[10px] text-secondary">1,020 huevos</span>
            </div>
            <div class="glass-pill p-3 rounded-xl text-center">
              <p class="text-[10px] text-muted uppercase font-bold">Cat. A</p>
              <p class="text-lg font-bold text-primary tabular-nums">18 <span class="text-xs font-normal text-muted">cub</span></p>
              <span class="text-[10px] text-secondary">540 huevos</span>
            </div>
            <div class="glass-pill p-3 rounded-xl text-center">
              <p class="text-[10px] text-muted uppercase font-bold">B y C</p>
              <p class="text-lg font-bold text-primary tabular-nums">5 <span class="text-xs font-normal text-muted">cub</span></p>
              <span class="text-[10px] text-secondary">150 huevos</span>
            </div>
          </div>
        </GlassCard>

        <!-- Tarjeta 2 (Bento 4 columnas lg): Lote, mortalidad y vacunación -->
        <GlassCard
          padding="lg"
          hoverable
          class="lg:col-span-4 flex flex-col justify-between border border-emerald-500/20"
        >
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <!-- Ícono Sanidad/Lote -->
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286z" />
              </svg>
            </div>
            <h3 class="text-lg font-display font-bold text-primary">
              Manejo del lote de aves y vacunación
            </h3>
            <p class="text-sm text-secondary leading-relaxed">
              Registre bajas diarias por mortalidad y descarte de aves no productivas. Lleve el calendario estricto de vacunas de cada lote para prevenir brotes.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-glass-border text-xs text-muted">
            <span class="font-medium text-primary">Control de censo:</span> Inventario de aves vivas actualizado día a día automáticamente.
          </div>
        </GlassCard>

        <!-- Tarjeta 3 (Bento 4 columnas lg): Consumo de alimento y conversión -->
        <GlassCard
          padding="lg"
          hoverable
          class="lg:col-span-4 flex flex-col justify-between border border-emerald-500/20"
        >
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <!-- Ícono Alimento -->
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </div>
            <h3 class="text-lg font-display font-bold text-primary">
              Consumo de alimento por lote
            </h3>
            <p class="text-sm text-secondary leading-relaxed">
              Anotación diaria de bultos o kilos suministrados para calcular gramos consumidos por ave y detectar anomalías en tolvas o comederos.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-glass-border text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            Evite desperdicios en el insumo más costoso de la granja.
          </div>
        </GlassCard>

        <!-- Tarjeta 4 (Bento 4 columnas lg): Indicadores automáticos -->
        <GlassCard
          padding="lg"
          hoverable
          class="lg:col-span-4 flex flex-col justify-between border border-emerald-500/20"
        >
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <!-- Ícono Indicadores -->
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 class="text-lg font-display font-bold text-primary">
              Indicadores clave automáticos
            </h3>
            <p class="text-sm text-secondary leading-relaxed">
              Tasa de postura al día, conversión alimenticia real y curva de producción acumulada por lote sin fórmulas manuales ni tablas dinámicas.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-glass-border text-xs text-muted">
            <span>Resultados listos para la visita del asesor zootecnista.</span>
          </div>
        </GlassCard>

        <!-- Tarjeta 5 (Bento 4 columnas lg): Alertas visuales tempranas -->
        <GlassCard
          padding="lg"
          hoverable
          class="lg:col-span-4 flex flex-col justify-between border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10"
        >
          <div class="space-y-3">
            <div class="w-10 h-10 rounded-xl glass-pill flex items-center justify-center text-amber-600 dark:text-amber-400">
              <!-- Ícono Alerta -->
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <h3 class="text-lg font-display font-bold text-primary">
              Alertas visuales preventivas
            </h3>
            <p class="text-sm text-secondary leading-relaxed">
              Avisos en pantalla cuando la postura desciende de la curva esperada, cuando hay un pico anormal de bajas o variaciones en el apetito.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-glass-border text-xs text-amber-800 dark:text-amber-300 font-semibold">
            Semáforo visual directo para actuar a tiempo.
          </div>
        </GlassCard>

        <!-- Tarjeta 6 (Bento 12 columnas lg / Ancha): Perfiles Administrador y Operario -->
        <GlassCard
          padding="lg"
          hoverable
          class="lg:col-span-12 border border-emerald-500/25"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div class="space-y-3">
              <span class="glass-pill text-xs font-bold px-3 py-1 rounded-full text-emerald-800 dark:text-emerald-300">
                Diseñado para el equipo
              </span>
              <h3 class="text-xl sm:text-2xl font-display font-bold text-primary">
                Perfiles diferenciados: del galpón a la gerencia
              </h3>
              <p class="text-sm sm:text-base text-secondary leading-relaxed">
                Cada persona tiene exactamente lo que necesita para trabajar rápido, sin menús confusos ni riesgo de alterar configuraciones sensibles de la granja.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="glass-pill p-4 rounded-2xl border border-emerald-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 class="text-sm font-bold text-primary">Perfil Operario</h4>
                </div>
                <p class="text-xs text-secondary leading-relaxed">
                  Para el galponero o mayordomo. Botones grandes, registro de huevos, bajas y comida en 2 minutos desde celular.
                </p>
              </div>

              <div class="glass-pill p-4 rounded-2xl border border-emerald-500/20">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-700 dark:text-emerald-400" />
                  <h4 class="text-sm font-bold text-primary">Perfil Administrador</h4>
                </div>
                <p class="text-xs text-secondary leading-relaxed">
                  Para el avicultor o propietario. Creación de lotes, análisis de tendencias históricas y control general.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  </section>
</template>

