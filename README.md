# Dashboard XCien Hub Empresarial

Panel operativo enterprise para gestión de clientes, historial de incidencias y monitoreo de llamadas de soporte técnico. Construido con **Vue 3 + TypeScript + Vite + Tailwind CSS v4** bajo los principios de **Clean Architecture** y **SOLID**.

---

## Características Principales

### Dashboard Operativo
- **KPIs en tiempo real** — Total de llamadas, duración promedio, tasa de éxito con gráficos de distribución
- **Insights automáticos** — Alertas de calidad y sugerencias basadas en patrones de datos
- **Filtros avanzados** — Período (7/30/90 días) y categoría (resuelto, en proceso, soporte insuficiente)
- **Gráfico de distribución** — Visualización SVG nativa con segmentos de colores semánticos

### Gestión de Clientes
- **Tabla paginada** — Búsqueda por API con filtros dinámicos
- **Vista de detalle** — Información completa del cliente con historial de interacciones
- **Badges de estado** — Indicadores visuales de estado (Activo/Inactivo)

### Historial de Incidencias
- **Tabla con búsqueda** — Filtros client-side por folio, titular, categoría y estado
- **Vista de detalle** — Información completa de la incidencia
- **Transcripciones de llamadas** — Modal con transcripción completa de llamadas de soporte
- **JOIN de datos** — Enriquecimiento automático de historial con transcripciones desde API externa

### Reportes PDF Ejecutivos
- **Logo corporativo** — Header con logo XCien convertido de SVG a PNG
- **KPIs compactos** — Grid de 3 columnas con métricas clave
- **Tablas de ancho completo** — Historial de tickets y gestión de clientes
- **Badges semánticos** — Estados con colores condicionales (verde/rojo/ámbar)
- **Pluralización dinámica** — Textos que se adaptan al número de registros
- **Footer paginado** — "Página X de Y" centrado

### Diseño Enterprise Premium
- **Material Design 3** — Paleta de colores profesional con tokens CSS
- **Sombras multicapa** — Efectos de profundidad sutiles y elegantes
- **Transiciones suaves** — Animaciones de 300ms en hover y focus
- **Responsive design** — Sidebar overlay en móvil, tablas con scroll horizontal
- **Backdrop blur** — Efectos de vidrio esmerilado en headers y modales

---

## Arquitectura

El proyecto sigue **Clean Architecture** en 4 capas con dependencias estrictamente unidireccionales hacia el centro:

```
src/
├── domain/          (núcleo — no depende de nada)
│   ├── entities/     → interfaces de datos de negocio
│   ├── repositories/ → contratos abstractos (puertos)
│   └── services/     → lógica de negocio pura
├── application/     (casos de uso — solo depende de domain)
│   └── use-cases/    → orquestación de operaciones de negocio
├── infrastructure/  (implementaciones — depende de domain + application)
│   ├── repositories/ → implementaciones concretas (API, mock)
│   └── di/           → service locator (composición de dependencias)
└── presentation/    (UI — depende de domain + application)
    ├── composables/  → estado reactivo Vue
    ├── views/        → páginas Vue
    ├── components/   → componentes UI reutilizables
    ├── router/       → navegación
    └── services/     → utilidades de presentación (PDF)
```

### Regla de dependencias

```
domain/ ──→ (ninguna)
   ↑
application/ ──→ domain/ únicamente ✅
   ↑
infrastructure/ ──→ domain/ + application/ ✅
   ↑
presentation/ ──→ domain/ + application/ únicamente ✅
```

La presentación **nunca importa de infraestructura** — la inyección de dependencias se realiza mediante `provide/inject` desde `App.vue` (composition root).

---

## Principios SOLID

| Principio | Estado | Detalle |
|-----------|--------|---------|
| **SRP** (Responsabilidad Única) | ✅ | Cada clase tiene una responsabilidad única. `ApiDashboardRepository` solo hace fetch + filtros; los cálculos KPIs/distribución/insights están en `DashboardCalculatorService` (dominio). |
| **OCP** (Abierto/Cerrado) | ✅ | Interfaces permiten nuevas implementaciones. Casos de uso aceptan filtros opcionales sin modificar la clase base. Repositorios mock completamente intercambiables. |
| **LSP** (Sustitución de Liskov) | ✅ | Repositorios mock 100% sustituibles por implementaciones reales. Ambos cumplen el contrato completo de su interfaz. |
| **ISP** (Segregación de Interfaces) | ✅ | Interfaces pequeñas y focalizadas: 1-3 métodos cada una. |
| **DIP** (Inversión de Dependencias) | ✅ | Casos de uso reciben repositorios por constructor (abstractos). Composables reciben casos de uso vía `inject` (Vue DI). Ningún archivo de presentación importa `serviceLocator`. Solo `App.vue` (composition root) conoce la implementación concreta. |

---

## Integración de APIs

El dashboard consume 3 endpoints principales:

```env
VITE_API_CLIENTS_URL=https://tu-api.com/webhook/getContactosVue
VITE_API_HISTORIAL_URL=https://tu-api.com/webhook/getHistorialVue
VITE_API_TABLA_URL=https://tu-api.com/webhook/getTablaVue
```

### JOIN de Datos
El repositorio de historial realiza un **JOIN automático** entre `getHistorialVue` y `getTablaVue` usando `clientId` como clave foránea, enriqueciendo cada registro con su transcripción correspondiente.

---

## Instalación y Uso

```bash
# Clonar repositorio
git clone https://github.com/wasakabeofficial/dashboard-x-cien.git
cd dashboard-x-cien

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las URLs de las APIs

# Desarrollo con hot-reload
npm run dev

# Type-check
npx vue-tsc --noEmit

# Build producción
npm run build

# Preview del build
npm run preview
```

---

## Estructura de Componentes

```
App.vue
├── AppSidebar        → navegación responsiva (overlay móvil / fijo desktop)
├── AppTopNav         → hamburguesa + búsqueda global + acciones
└── <router-view>
    ├── DashboardView     → KPIs, gráfico, insights, filtros
    ├── ClientesView      → tabla de clientes con paginación
    │   └── ClientTable   → reutiliza AppTableContainer
    ├── HistorialView     → tabla de incidencias
    │   └── HistorialTable → reutiliza AppTableContainer + modal de transcripción
    ├── ClientDetailView  → detalle de un cliente
    ├── HistorialDetailView → detalle de una incidencia con transcripción
    └── SettingsView      → placeholder
```

### Componentes Compartidos
- `AppTableContainer` — tabla con slot para columnas/filas, loading, empty, paginación
- `AppCard` — contenedor tipo card con padding responsivo y sombras multicapa
- `KpiCard` — indicador KPI con icono, tendencia y elemento decorativo
- `DistributionChart` — gráfico SVG nativo con segmentos de colores

---

## Tecnologías

- **Vue 3** + Composition API + `<script setup>`
- **TypeScript** — tipado estricto
- **Vite** — build tool ultrarrápido
- **Tailwind CSS v4** — diseño atómico con tokens Material Design 3 (sin PostCSS, vía `@tailwindcss/vite`)
- **Vue Router** — SPA routing con lazy loading
- **jsPDF** + **jspdf-autotable** — generación de reportes PDF profesionales
- **html2canvas** — captura de gráficos para PDF

---

## Características del PDF

El sistema de reportes PDF incluye:

1. **Header corporativo** — Logo XCien + título + fecha de generación
2. **Grid de KPIs** — 3 métricas clave en cards con bordes suaves
3. **Tabla de Historial** — Folio, fecha, titular, categoría, estado con badges
4. **Tabla de Clientes** — Empresa, contacto, teléfono, email, estado con badges
5. **Footer paginado** — "Página X de Y — XCien Hub Empresarial"
6. **Formato de estados** — Conversión automática de `snake_case` a `Capital Case`
7. **Pluralización** — "1 llamada registrada" vs "N llamadas registradas"

---

## Screenshots

> Las capturas de pantalla se agregarán próximamente.

---

## Licencia

MIT

---

## Créditos

Desarrollado por **Neuropoint.ai** para XCien Hub Empresarial.

**Repositorio:** [github.com/wasakabeofficial/dashboard-x-cien](https://github.com/wasakabeofficial/dashboard-x-cien)
