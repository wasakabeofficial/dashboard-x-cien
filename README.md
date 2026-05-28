# Dashboard XCien

Panel operativo para gestión de clientes, historial de incidencias y monitoreo de llamadas. Construido con **Vue 3 + TypeScript + Vite + Tailwind CSS v4** bajo los principios de **Clean Architecture** y **SOLID**.

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

## Principios SOLID — Estado actual

| Principio | Estado | Detalle |
|-----------|--------|---------|
| **SRP** (Responsabilidad Única) | ✅ 10/10 | Cada clase tiene una responsabilidad única. `ApiDashboardRepository` solo hace fetch + filtros; los cálculos KPIs/distribución/insights están en `DashboardCalculatorService` (dominio). |
| **OCP** (Abierto/Cerrado) | ✅ 10/10 | Interfaces permiten nuevas implementaciones. Casos de uso aceptan filtros opcionales sin modificar la clase base. Repositorios mock completamente intercambiables. |
| **LSP** (Sustitución de Liskov) | ✅ 10/10 | Repositorios mock 100% sustituibles por implementaciones reales. Ambos cumplen el contrato completo de su interfaz. |
| **ISP** (Segregación de Interfaces) | ✅ 10/10 | Interfaces pequeñas y focalizadas: 1-3 métodos cada una. |
| **DIP** (Inversión de Dependencias) | ✅ 10/10 | Casos de uso reciben repositorios por constructor (abstractos). Composables reciben casos de uso vía `inject` (Vue DI). Ningún archivo de presentación importa `serviceLocator`. Solo `App.vue` (composition root) conoce la implementación concreta. |

---

## Funcionalidades

- **Dashboard operativo** — KPIs (total llamadas, costo, duración promedio), gráfico de distribución por categoría, tasa de éxito, insights
- **Gestión de Clientes** — tabla paginada con búsqueda por API, vista de detalle
- **Historial de Incidencias** — tabla con búsqueda client-side (folio, titular, categoría, estado), vista de detalle
- **Búsqueda global** — barra de búsqueda en el TopNav con debounce que filtra la vista activa
- **Filtros del Dashboard** — panel desplegable con filtros por período (7/30/90 días) y categoría (resuelto, en proceso, soporte insuficiente)
- **Reportes PDF** — descarga de reportes con jsPDF + autoTable (página 1: KPIs, página 2: Clientes, página 3: Historial)
- **Diseño responsivo** — sidebar overlay en móvil, tablas con scroll horizontal, grid adaptable
- **Sin autenticación** — todas las operaciones son GET, sin crear/editar/eliminar

---

## Variables de Entorno

Copia `.env.example` como `.env` y completa las URLs de las API:

```env
VITE_API_CLIENTS_URL=https://tu-api.com/getContactosVue
VITE_API_HISTORIAL_URL=https://tu-api.com/getHistorialVue
VITE_API_TABLA_URL=https://tu-api.com/getTablaVue
```

---

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Desarrollo con hot-reload
npm run dev

# Type-check
npx vue-tsc --noEmit

# Build producción
npm run build
```

---

## Tecnologías

- **Vue 3** + Composition API + `<script setup>`
- **TypeScript** — tipado estricto
- **Vite** — build tool
- **Tailwind CSS v4** — diseño atómico con tokens Material Design 3 (sin PostCSS, vía `@tailwindcss/vite`)
- **Vue Router** — SPA routing con lazy loading
- **jsPDF** + **jspdf-autotable** — generación de reportes PDF
- **html2canvas** — captura de gráficos para PDF

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
    │   └── HistorialTable → reutiliza AppTableContainer
    ├── ClientDetailView  → detalle de un cliente
    ├── HistorialDetailView → detalle de una incidencia
    └── SettingsView      → placeholder
```

Componentes compartidos:
- `AppTableContainer` — tabla con slot para columnas/filas, loading, empty, paginación
- `AppCard` — contenedor tipo card con padding responsivo
- `KpiCard` — indicador KPI
- `DistributionChart` — gráfico de distribución con barras de progreso

---

## Licencia

MIT
