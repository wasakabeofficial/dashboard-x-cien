<script setup lang="ts">
import { ref, inject, computed, watch } from 'vue'
import { useReportModal } from '@/presentation/composables/use-report-modal.composable'
import {
  GET_CLIENTS_USE_CASE,
  GET_HISTORIAL_USE_CASE,
  GET_DASHBOARD_DATA_USE_CASE,
} from '@/presentation/di-keys'
import { downloadReport, type ReportSection } from '@/presentation/services/report.service'

interface CheckItem {
  key: ReportSection
  label: string
  checked: boolean
}

const { isOpen, close } = useReportModal()

const getDashboardData = inject(GET_DASHBOARD_DATA_USE_CASE)!
const getClients = inject(GET_CLIENTS_USE_CASE)!
const getHistorial = inject(GET_HISTORIAL_USE_CASE)!

const downloading = ref(false)
const masterCheckboxRef = ref<HTMLInputElement | null>(null)

const items = ref<CheckItem[]>([
  { key: 'total_llamadas', label: 'Total de Llamadas', checked: false },
  { key: 'costos_totales', label: 'Costos Totales', checked: false },
  { key: 'duracion_promedio', label: 'Duración Promedio', checked: false },
  { key: 'gestion_clientes', label: 'Gestión de Clientes', checked: false },
  { key: 'historial', label: 'Historial', checked: false },
])

const totalSelected = computed(() => items.value.filter((i) => i.checked).length)
const isAllChecked = computed(() => items.value.length > 0 && totalSelected.value === items.value.length)
const isIndeterminate = computed(() => totalSelected.value > 0 && totalSelected.value < items.value.length)

watch(isIndeterminate, (newVal) => {
  if (masterCheckboxRef.value) {
    masterCheckboxRef.value.indeterminate = newVal
  }
})

function toggleAll(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked
  items.value.forEach((item) => {
    item.checked = checked
  })
}

async function handleDownload(): Promise<void> {
  const selected = items.value.filter((item) => item.checked).map((item) => item.key)
  if (selected.length === 0) return

  downloading.value = true
  try {
    await downloadReport(selected, { getDashboardData, getClients, getHistorial })
    close()
  } catch (err) {
    console.error('Error al descargar reporte:', err)
  } finally {
    downloading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-9999! flex flex-col items-center justify-center p-4 w-screen h-screen">
        
        <div class="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" @click="close" />

        <div
          class="relative block! bg-white rounded-xl border border-neutral-200 shadow-xl w-full max-w-md min-w-80 max-h-[90vh] z-10 overflow-hidden transform transition-all"
        >
          <div class="p-6 pb-4 flex items-center justify-between border-b border-neutral-100">
            <h2 class="text-lg font-bold text-neutral-900">Descargar Reportes</h2>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
              @click="close"
            >
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
            <p class="text-sm text-neutral-500">
              Selecciona la información estructurada que deseas incluir en el documento descargable:
            </p>

            <label
              class="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg cursor-pointer select-none border border-neutral-200/60 hover:bg-neutral-100 transition-colors"
            >
              <input
                ref="masterCheckboxRef"
                type="checkbox"
                :checked="isAllChecked"
                class="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                @change="toggleAll"
              />
              <span class="text-sm font-semibold text-neutral-800">Seleccionar todo</span>
            </label>

            <div class="space-y-1 pt-1">
              <label
                v-for="item in items"
                :key="item.key"
                class="flex items-center gap-3 p-2.5 rounded-lg border border-transparent hover:bg-neutral-50 transition-colors cursor-pointer select-none"
              >
                <input
                  v-model="item.checked"
                  type="checkbox"
                  class="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span class="text-sm text-neutral-700 font-medium">{{ item.label }}</span>
              </label>
            </div>
          </div>

          <div class="p-6 pt-4 flex items-center justify-end gap-3 border-t border-neutral-100 bg-white">
            <button
              class="px-4 py-2 text-sm font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
              @click="close"
            >
              Cancelar
            </button>
            <button
              class="px-5 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white flex items-center gap-2 hover:bg-neutral-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
              :disabled="downloading || totalSelected === 0"
              @click="handleDownload"
            >
              <span v-if="downloading" class="material-symbols-outlined animate-spin text-[16px]">sync</span>
              <span v-else class="material-symbols-outlined text-[16px]">download</span>
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
  transition: opacity 0.15s ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e5e5;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d4d4d4;
}
</style>