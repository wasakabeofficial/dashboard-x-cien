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

// Casos de uso inyectados desde App.vue — DIP respetado
const getDashboardData = inject(GET_DASHBOARD_DATA_USE_CASE)!
const getClients = inject(GET_CLIENTS_USE_CASE)!
const getHistorial = inject(GET_HISTORIAL_USE_CASE)!

interface CheckItem {
  key: ReportSection
  label: string
  checked: boolean
}

const items = ref<CheckItem[]>([
  { key: 'total_llamadas', label: 'Total de Llamadas', checked: false },
  { key: 'costos_totales', label: 'Costos Totales', checked: false },
  { key: 'duracion_promedio', label: 'Duración Promedio', checked: false },
  { key: 'gestion_clientes', label: 'Gestión de Clientes', checked: false },
  { key: 'historial', label: 'Historial', checked: false },
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
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

        <!-- Modal -->
        <div
          class="relative bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg mx-xl p-xl space-y-lg z-10"
        >
          <!-- Header -->
          <div class="flex items-center justify-between">
            <h2 class="font-headline-sm text-headline-sm text-primary">Descargar Reportes</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
              @click="close"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <p class="text-body-sm text-body-sm text-on-surface-variant">
            Selecciona la información que deseas incluir en el reporte:
          </p>

          <!-- Select All -->
          <label class="flex items-center gap-md py-sm border-b border-outline-variant/50 cursor-pointer select-none">
            <input
              type="checkbox"
              :checked="allChecked"
              class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
              @change="toggleAll"
            />
            <span class="font-label-md text-label-md text-on-surface">Seleccionar todo</span>
          </label>

          <!-- Checklist -->
          <div class="space-y-sm max-h-64 overflow-y-auto pr-sm">
            <label
              v-for="item in items"
              :key="item.key"
              class="flex items-center gap-md py-sm px-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer select-none"
            >
              <input
                v-model="item.checked"
                type="checkbox"
                class="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                @change="onCheckChange"
              />
              <span class="font-body-md text-body-md text-on-surface">{{ item.label }}</span>
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-md pt-sm border-t border-outline-variant/50">
            <button
              class="px-lg py-sm rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all"
              @click="close"
            >
              Cancelar
            </button>
            <button
              class="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md flex items-center gap-xs hover:opacity-90 transition-all disabled:opacity-50"
              :disabled="downloading || items.every((i) => !i.checked)"
              @click="handleDownload"
            >
              <span v-if="downloading" class="material-symbols-outlined animate-spin text-[18px]">sync</span>
              <span v-else class="material-symbols-outlined text-[18px]">download</span>
              {{ downloading ? 'Generando...' : 'Descargar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div > div,
.modal-leave-active > div > div {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div > div,
.modal-leave-to > div > div {
  transform: scale(0.95);
}
</style>
