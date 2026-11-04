# Arquitectura Frontend - HENGEST

HENGEST es una plataforma web SaaS diseñada para que pequeñas y medianas granjas avícolas de huevo comercial registren y controlen su producción.

El frontend está desarrollado con **Vue 3** (Composition API, `<script setup>`), **Vite**, **Vue Router 5**, **Pinia** y estilizado con **Tailwind CSS v4** mediante un sistema de tokens de diseño propio denominado *"Cascarón de cristal"*.

---

## 1. Estructura de Directorios

```
src/
  api/
    client.js          # Wrapper liviano sobre la API Fetch nativa (sin axios).
  assets/
    logo/              # Logotipo de marca e isotipo optimizados para modo claro y oscuro.
  components/          # Componentes visuales compartidos y reutilizables (GlassCard, AppButton, ThemeToggle, BrandLogo).
  composables/         # Lógica reactiva reutilizable (useTheme.js).
  layouts/             # Plantillas base (PublicLayout.vue: navbar de cristal + contenido + footer).
  modules/             # Módulos funcionales desacoplados.
    landing/           # Página de inicio y presentación de la plataforma.
      components/      # Secciones: Hero con simulación interactiva, El Problema, Funcionalidades (Bento), Cómo Funciona, Audiencia, FAQ, CTA Final.
      views/LandingView.vue
      routes.js
    auth/              # Autenticación y acceso (placeholders visuales).
      views/LoginView.vue
      views/RegisterView.vue
      routes.js
    errors/            # Vistas de error y estado.
      views/NotFoundView.vue (404)
  router/
    index.js           # Enrutador centralizado que combina rutas de módulos con carga diferida.
  stores/
    theme.js           # Gestión reactiva de tema claro/oscuro persistido en localStorage.
    session.js         # Estado del usuario autenticado (placeholder para futura integración).
  styles/
    tokens.css         # Variables CSS de color, radios de curvatura, sombras y elevaciones.
    glass.css          # Clases del efecto cascarón de cristal, reflejos y orbes orgánicos de fondo.
    base.css           # Punto de entrada de Tailwind v4 y tipografía del sistema.
  App.vue              # Componente raíz con inicialización de tema y render de layout.
  main.js              # Inicialización de la aplicación Vue y registro de plugins.
```

---

## 2. Reglas de Arquitectura

1. **Aislamiento Modular**: Un módulo (`modules/*`) nunca importa archivos internos de otro módulo. Todo recurso compartido debe ubicarse en `components/`, `composables/`, `stores/`, `layouts/` o `api/`.
2. **Carga Diferida Obligatoria (Lazy Loading)**: Todas las vistas de rutas se cargan bajo demanda mediante importación dinámica: `() => import(...)`.
3. **Cero Dependencias Accesorias**: Prohibido el uso de Axios, librerías de componentes prediseñados, librerías de íconos o utilidades de animación externas. Los íconos son SVG inline hechos a mano y las animaciones se ejecutan mediante CSS acelerado por GPU (`transform` y `opacity`).
4. **Respeto a la Accesibilidad y Rendimiento**:
   - Cumplimiento de contraste mínimo WCAG AA en modo claro y modo oscuro.
   - Respaldo sólido `@supports not (backdrop-filter)` para dispositivos móviles antiguos.
   - Desactivación de animaciones cuando el usuario tiene activada la preferencia de sistema `prefers-reduced-motion`.
5. **Idioma y Tono**: Interfaces y mensajes en español (Colombia), con lenguaje claro, cercano al productor avícola y libre de tecnicismos innecesarios.

---

## 3. Módulos Futuros Previstos

Los siguientes módulos funcionales se incorporarán en fases posteriores del desarrollo (sus carpetas se crearán únicamente al iniciar su implementación):

- `modules/produccion/`:
  - Registro de recolección diaria de huevo por galpón y lote.
  - Clasificación comercial: AAA, AA, A, B y C.
  - Cálculo y empaque automático en cubetas de 30 unidades y remanente suelto.
  - Censo de lote: bajas por mortalidad diaria y descarte.
  - Registro de consumo diario de alimento (bultos / kilos).
- `modules/alertas/`:
  - Motor de alertas tempranas ante caídas súbitas de la tasa de postura.
  - Detección de picos atípicos de mortalidad diaria.
  - Notificaciones de variación en el consumo esperado de concentrado.
  - Recordatorios del calendario sanitario y de vacunación de la parvada.
- `modules/reportes/`:
  - Curvas históricas de postura vs. estándar de la línea genética (ej. Isa Brown, Hy-Line).
  - Tasa de conversión alimenticia (kg alimento / docena o kg de huevo).
  - Rendimiento acumulado y balance de aves vivas para asesores zootecnistas y propietarios.

---

## 4. Fuera de Alcance

Por definición estratégica de producto, HENGEST no incluye ni prometerá:
- Facturación electrónica.
- Liquidación de nómina.
- Venta al por menor al consumidor final.
- Contabilidad financiera o tributaria.

