<script setup lang="ts">
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'
import { useNavigationDebounce } from '@/presentation/composables/use-navigation-debounce.composable'
import AppTableContainer from '@/presentation/components/shared/AppTableContainer.vue'

defineProps<{
  entries: HistorialEntryEntity[]
}>()

const { push } = useNavigationDebounce()

function goToDetail(entry: HistorialEntryEntity): void {
  push(`/historial/${entry.folio}`)
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

// Avatars para titulares
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
        class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
      >
        Folio
      </th>
      <th
        class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
      >
        Fecha
      </th>
      <th
        class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
      >
        Titular
      </th>
      <th
        class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
      >
        Categoría Técnica
      </th>
      <th
        class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
      >
        Estado
      </th>
    </template>

    <template #rows="{ data }">
      <tr
        v-for="entry in data as HistorialEntryEntity[]"
        :key="entry.folio"
        class="hover:bg-surface-container-low transition-colors group cursor-pointer"
        @click="goToDetail(entry)"
      >
        <td class="px-xl py-md font-semibold text-primary">
          {{ entry.folio }}
        </td>
        <td class="px-xl py-md text-on-surface-variant text-body-sm">
          {{ entry.fecha }}
        </td>
        <td class="px-xl py-md">
          <div class="flex items-center gap-sm">
            <div
              class="w-8 h-8 rounded-full bg-secondary-fixed-dim text-[10px] flex items-center justify-center font-bold"
            >
              {{ getInitials(entry.nombreTitular) }}
            </div>
            <span class="text-on-surface">{{ entry.nombreTitular }}</span>
          </div>
        </td>
        <td class="px-xl py-md text-on-surface text-body-sm max-w-xs truncate">
          {{ entry.categoriaTecnica }}
        </td>
        <td class="px-xl py-md">
          <span
            :class="`inline-block px-md py-xs rounded-full border text-xs font-label-md ${getEstadoClass(entry.estado)}`"
          >
            {{ formatEstado(entry.estado) }}
          </span>
        </td>
      </tr>
    </template>
  </AppTableContainer>
</template>
