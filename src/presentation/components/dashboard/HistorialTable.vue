<script setup lang="ts">
import type { HistorialEntryEntity } from '@/domain/entities/historial.entity'
import { computed, ref } from 'vue'

const props = defineProps<{
  entries: HistorialEntryEntity[]
}>()

const hasData = computed(() => props.entries.length > 0)

const selectedEntry = ref<HistorialEntryEntity | null>(null)

function toggleDetail(entry: HistorialEntryEntity): void {
  selectedEntry.value = selectedEntry.value?.folio === entry.folio ? null : entry
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
</script>

<template>
  <section
    class="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col h-[30rem]"
  >
    <!-- Cuerpo de la tabla (scrollable) -->
    <div class="flex-1 overflow-y-auto">
      <table v-if="hasData" class="w-full text-left border-collapse">
        <thead class="sticky top-0 z-10">
          <tr class="bg-surface-container-low border-b border-outline-variant">
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
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center"
            >
              Detalle
            </th>
          </tr>
        </thead>
        <tbody class="font-table-data text-table-data divide-y divide-outline-variant">
          <template v-for="entry in entries" :key="entry.folio">
            <tr
              class="hover:bg-surface-container-low transition-colors group cursor-pointer"
              :class="{ 'bg-surface-container-low': selectedEntry?.folio === entry.folio }"
              @click="toggleDetail(entry)"
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
                    {{ entry.nombreTitular.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }}
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
              <td class="px-xl py-md text-center">
                <span
                  class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors"
                >
                  {{ selectedEntry?.folio === entry.folio ? 'expand_less' : 'expand_more' }}
                </span>
              </td>
            </tr>
            <!-- Expanded detail row -->
            <tr v-if="selectedEntry?.folio === entry.folio">
              <td colspan="6" class="px-xl py-md bg-surface-container-low/30 border-b border-outline-variant">
                <div class="space-y-md">
                  <div>
                    <p class="font-label-md text-label-md text-on-surface-variant mb-xs">
                      Situación
                    </p>
                    <p class="text-body-md text-body-md text-on-surface leading-relaxed">
                      {{ entry.situacion }}
                    </p>
                  </div>
                  <div class="flex items-center gap-xl pt-sm border-t border-outline-variant/50">
                    <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-[14px]">call</span>
                      {{ entry.telefono }}
                    </div>
                    <div class="flex items-center gap-xs text-body-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-[14px]">mail</span>
                      {{ entry.correo }}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-on-surface-variant"
      >
        <span class="material-symbols-outlined text-4xl mb-md">history</span>
        <p class="font-body-md text-body-md">No hay registros de historial</p>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="px-xl py-md bg-surface-container-low/50 border-t border-outline-variant flex items-center justify-between shrink-0"
    >
      <p class="text-body-sm text-on-surface-variant">
        <template v-if="hasData">
          {{ entries.length }} {{ entries.length === 1 ? 'registro' : 'registros' }} en total
        </template>
        <template v-else>
          Sin registros
        </template>
      </p>
    </div>
  </section>
</template>
