<script setup lang="ts">
import { ref } from 'vue'
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'
import { useNavigationDebounce } from '@/presentation/composables/use-navigation-debounce.composable'
import AppTableContainer from '@/presentation/components/shared/AppTableContainer.vue'

defineProps<{
  entries: HistorialEntryEntity[]
}>()

const { push } = useNavigationDebounce()

const modalOpen = ref(false)
const modalTranscripcion = ref('')
const modalFolio = ref('')

function goToDetail(entry: HistorialEntryEntity): void {
  push(`/historial/${entry.folio}`)
}

function openTranscripcionModal(entry: HistorialEntryEntity, event: Event): void {
  event.stopPropagation()
  modalTranscripcion.value = entry.transcripcion || ''
  modalFolio.value = entry.folio
  modalOpen.value = true
}

function closeTranscripcionModal(): void {
  modalOpen.value = false
  modalTranscripcion.value = ''
  modalFolio.value = ''
}

function getEstadoClass(estado: string): string {
  switch (estado) {
    case 'soporte_insuficiente':
      return 'bg-error/10 text-error border-error/30'
    case 'resuelto':
      return 'bg-on-tertiary-container/10 text-on-tertiary-container border-on-tertiary-container/30'
    case 'en_proceso':
      return 'bg-tertiary-fixed/50 text-on-tertiary-fixed border-tertiary-fixed'
    default:
      return 'bg-surface-variant text-on-surface-variant border-outline-variant'
  }
}

function formatEstado(estado: string): string {
  switch (estado) {
    case 'soporte_insuficiente':
      return 'Soporte Insuficiente'
    case 'resuelto':
      return 'Resuelto'
    case 'en_proceso':
      return 'En Proceso'
    default:
      return estado
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<template>
  <AppTableContainer
    :data="entries"
    empty-message="No hay registros de historial"
    empty-icon="history"
  >
    <template #columns>
      <th
        class="px-xl py-md font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider"
      >
        Folio
      </th>
      <th
        class="px-xl py-md font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider"
      >
        Fecha
      </th>
      <th
        class="px-xl py-md font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider"
      >
        Titular
      </th>
      <th
        class="px-xl py-md font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider"
      >
        Categoría Técnica
      </th>
      <th
        class="px-xl py-md font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider"
      >
        Estado
      </th>
      <th
        class="px-xl py-md font-label-sm text-label-sm text-on-surface-variant/70 uppercase tracking-wider text-center"
      >
        Transcripción
      </th>
    </template>

    <template #rows="{ data }">
      <tr
        v-for="entry in data as HistorialEntryEntity[]"
        :key="entry.folio"
        class="hover:bg-surface-container-low/40 transition-colors group cursor-pointer border-b border-outline-variant/30 last:border-b-0"
        @click="goToDetail(entry)"
      >
        <td class="px-xl py-md font-semibold text-primary">
          {{ entry.folio }}
        </td>
        <td class="px-xl py-md text-on-surface-variant/80 text-body-sm">
          {{ entry.fecha }}
        </td>
        <td class="px-xl py-md">
          <div class="flex items-center gap-sm">
            <div
              class="w-8 h-8 rounded-full bg-secondary-fixed-dim text-[10px] flex items-center justify-center font-bold shadow-sm"
            >
              {{ getInitials(entry.nombreTitular) }}
            </div>
            <span class="text-on-surface">{{ entry.nombreTitular }}</span>
          </div>
        </td>
        <td class="px-xl py-md text-on-surface/80 text-body-sm max-w-xs truncate">
          {{ entry.categoriaTecnica }}
        </td>
        <td class="px-xl py-md">
          <span
            :class="`inline-block px-md py-xs rounded-full border text-xs font-label-md ${getEstadoClass(entry.estado)}`"
          >
            {{ formatEstado(entry.estado) }}
          </span>
        </td>
        <td class="px-xl py-md text-center">
          <button
            v-if="entry.transcripcion"
            class="inline-flex items-center gap-xs px-sm py-xs rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-label-md border border-primary/20"
            title="Leer transcripción"
            @click="openTranscripcionModal(entry, $event)"
          >
            <span class="material-symbols-outlined text-[16px]">description</span>
            <span class="hidden sm:inline">Leer</span>
          </button>
          <span v-else class="text-on-surface-variant/40 text-xs">—</span>
        </td>
      </tr>
    </template>
  </AppTableContainer>

  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 w-screen h-screen"
      >
        <div class="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" @click="closeTranscripcionModal" />

        <div
          class="relative bg-white rounded-xl border border-neutral-200 shadow-xl w-full max-w-2xl min-w-80 max-h-[85vh] z-10 overflow-hidden transform transition-all flex flex-col"
        >
          <div class="p-6 pb-4 flex items-center justify-between border-b border-neutral-100 shrink-0">
            <div class="flex items-center gap-sm">
              <span class="material-symbols-outlined text-primary">description</span>
              <div>
                <h2 class="text-lg font-bold text-neutral-900">Transcripción de Llamada</h2>
                <p class="text-xs text-neutral-500">Folio: {{ modalFolio }}</p>
              </div>
            </div>
            <button
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-600"
              @click="closeTranscripcionModal"
            >
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <pre class="font-mono text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap selection:bg-primary/20">{{ modalTranscripcion }}</pre>
          </div>

          <div class="p-6 pt-4 flex items-center justify-end border-t border-neutral-100 shrink-0">
            <button
              class="px-5 py-2 text-sm font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shadow-sm"
              @click="closeTranscripcionModal"
            >
              Cerrar
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
