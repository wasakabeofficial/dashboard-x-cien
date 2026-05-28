<script setup lang="ts">
import { ref, inject } from 'vue'
import { useReportModal } from '@/presentation/composables/use-report-modal.composable'
import {
  GET_CLIENTS_USE_CASE,
  GET_HISTORIAL_USE_CASE,
  GET_DASHBOARD_DATA_USE_CASE,
} from '@/presentation/di-keys'
import { downloadReport, type ReportSection } from '@/presentation/services/report.service'

const { isOpen, close } = useReportModal()

const getDashboardData = inject(GET_DASHBOARD_DATA_USE_CASE)!
const getClients = inject(GET_CLIENTS_USE_CASE)!
const getHistorial = inject(GET_HISTORIAL_USE_CASE)!

interface CheckItem {
  key: ReportSection
  label: string
  description: string
  icon: string
  checked: boolean
}

const items = ref<CheckItem[]>([
  {
    key: 'total_llamadas',
    label: 'Total de Llamadas',
    description: 'Volumen total y métricas agregadas de llamadas',
    icon: 'call',
    checked: false,
  },
  {
    key: 'costos_totales',
    label: 'Costos Totales',
    description: 'Resumen de costos por período seleccionado',
    icon: 'payments',
    checked: false,
  },
  {
    key: 'duracion_promedio',
    label: 'Duración Promedio',
    description: 'Tiempo medio de llamadas y distribución',
    icon: 'timer',
    checked: false,
  },
  {
    key: 'gestion_clientes',
    label: 'Gestión de Clientes',
    description: 'Listado completo de clientes con estados',
    icon: 'groups',
    checked: false,
  },
  {
    key: 'historial',
    label: 'Historial',
    description: 'Registro cronológico de incidencias',
    icon: 'history',
    checked: false,
  },
])

const downloading = ref(false)
const allChecked = ref(false)

function toggleAll(): void {
  allChecked.value = !allChecked.value
  items.value.forEach((item) => {
    item.checked = allChecked.value
  })
}

function onCheckChange(): void {
  allChecked.value = items.value.every((item) => item.checked)
}

async function handleDownload(): Promise<void> {
  const selected = items.value.filter((item) => item.checked).map((item) => item.key)
  if (selected.length === 0) return

  downloading.value = true
  try {
    await downloadReport(selected, { getDashboardData, getClients, getHistorial })
  } catch (err) {
    console.error('Error al descargar reporte:', err)
  } finally {
    downloading.value = false
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      >
        <!-- Overlay con gradiente -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50 backdrop-blur-md"
          @click="close"
        />

        <!-- Modal -->
        <div
          class="relative w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden z-10"
        >
          <!-- Fondo con gradiente sutil -->
          <div class="absolute inset-0 bg-gradient-to-br from-surface-container-high via-surface to-surface-container-low pointer-events-none" />
          <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

          <div class="relative p-6 sm:p-8 space-y-6">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div class="space-y-1">
                <h2 class="text-xl font-semibold tracking-tight text-on-surface">
                  Descargar Reportes
                </h2>
                <p class="text-sm text-on-surface-variant/70 leading-relaxed">
                  Selecciona las secciones que deseas incluir en tu reporte PDF.
                </p>
              </div>
              <button
                class="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all duration-200 text-on-surface-variant/60 hover:text-on-surface active:scale-90 -mr-1 -mt-1"
                @click="close"
                aria-label="Cerrar"
              >
                <span class="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <!-- Divider decorativo -->
            <div class="h-px bg-gradient-to-r from-outline-variant/30 via-outline-variant/10 to-transparent" />

            <!-- Select All -->
            <label
              class="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-surface-container-low/50 border border-outline-variant/20 cursor-pointer select-none group transition-all duration-200 hover:bg-surface-container-low hover:border-outline-variant/30"
            >
              <div class="relative shrink-0">
                <input
                  type="checkbox"
                  :checked="allChecked"
                  class="peer sr-only"
                  @change="toggleAll"
                />
                <div
                  class="w-5 h-5 rounded-lg border-2 border-outline-variant/40 bg-transparent transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary group-hover:border-outline-variant/60 flex items-center justify-center"
                >
                  <span
                    v-if="allChecked"
                    class="material-symbols-outlined text-white text-[14px]"
                  >check</span>
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-sm font-medium text-on-surface">Seleccionar todo</span>
                <span class="text-xs text-on-surface-variant/50">Incluir todas las secciones</span>
              </div>
              <span
                v-if="allChecked"
                class="ml-auto text-xs font-medium text-primary/80"
              >{{ items.length }} seleccionados</span>
              <span
                v-else
                class="ml-auto text-xs text-on-surface-variant/40"
              >{{ items.filter(i => i.checked).length }} / {{ items.length }}</span>
            </label>

            <!-- Checklist -->
            <div class="space-y-2 max-h-72 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
              <label
                v-for="item in items"
                :key="item.key"
                class="flex items-start gap-3 p-3 rounded-xl border border-transparent transition-all duration-200 cursor-pointer select-none group"
                :class="[
                  item.checked
                    ? 'bg-primary/5 border-primary/15 hover:bg-primary/8'
                    : 'hover:bg-surface-container-low hover:border-outline-variant/10',
                ]"
              >
                <!-- Custom checkbox -->
                <div class="relative shrink-0 mt-0.5">
                  <input
                    v-model="item.checked"
                    type="checkbox"
                    class="peer sr-only"
                    @change="onCheckChange"
                  />
                  <div
                    class="w-5 h-5 rounded-lg border-2 border-outline-variant/30 bg-transparent transition-all duration-200 peer-checked:bg-primary peer-checked:border-primary group-hover:border-outline-variant/50 flex items-center justify-center"
                  >
                    <span
                      v-if="item.checked"
                      class="material-symbols-outlined text-white text-[14px]"
                    >check</span>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex flex-col min-w-0 flex-1">
                  <span
                    class="text-sm font-medium transition-colors duration-200"
                    :class="item.checked ? 'text-primary' : 'text-on-surface'"
                  >
                    {{ item.label }}
                  </span>
                  <span class="text-xs text-on-surface-variant/50 mt-0.5">{{ item.description }}</span>
                </div>

                <!-- Icon decorativo -->
                <div
                  class="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                  :class="[
                    item.checked
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container-low text-on-surface-variant/30 group-hover:bg-surface-container-high',
                  ]"
                >
                  <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
                </div>
              </label>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button
                class="relative px-5 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant/70 hover:text-on-surface transition-all duration-200 hover:bg-surface-container-high active:scale-95"
                @click="close"
              >
                Cancelar
              </button>
              <button
                class="relative px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 overflow-hidden group/download"
                :disabled="downloading || items.every((i) => !i.checked)"
                @click="handleDownload"
              >
                <!-- Gradient background -->
                <div
                  class="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90 transition-all duration-300 group-hover/download:from-primary/90 group-hover/download:to-primary"
                />
                <!-- Shine effect on hover -->
                <div
                  class="absolute inset-0 opacity-0 group-hover/download:opacity-100 transition-opacity duration-500"
                >
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover/download:translate-x-[100%] transition-transform duration-700"
                  />
                </div>
                <span class="relative flex items-center gap-2">
                  <span
                    v-if="downloading"
                    class="material-symbols-outlined text-lg animate-spin"
                  >sync</span>
                  <span v-else class="material-symbols-outlined text-lg">download</span>
                  {{ downloading ? 'Generando…' : 'Descargar' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Modal transitions ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.92) translateY(8px);
  opacity: 0;
}

/* ── Custom scrollbar ── */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--color-outline-variant) 20%, transparent);
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--color-outline-variant) 35%, transparent);
}

/* Fallback for Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--color-outline-variant) 20%, transparent) transparent;
}
</style>
