<script setup lang="ts">
import type { ClientEntity } from '@/domain/entities/client.entity'

defineProps<{
  clients: ClientEntity[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalRecords: number
}>()

const emit = defineEmits<{
  'go-to-page': [page: number]
}>()

function getStatusColor(status: string): string {
  return status === 'Activo' ? 'bg-on-tertiary-container' : 'bg-error'
}

function getSituationClass(situation: string): string {
  return situation === 'Residencial'
    ? 'bg-secondary-container text-on-secondary-container'
    : 'bg-tertiary-fixed text-on-tertiary-fixed'
}
</script>

<template>
  <section
    class="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden"
  >
    <!-- Header -->
    <div
      class="p-xl border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50"
    >
      <div>
        <h4 class="font-headline-sm text-headline-sm text-primary">Gestión de Clientes</h4>
        <p class="text-body-sm text-on-surface-variant">
          Visualización y administración de registros activos
        </p>
      </div>
      <div class="flex items-center gap-md">
        <button
          class="px-md py-sm text-secondary font-label-md border border-outline rounded-lg hover:bg-surface-variant transition-all"
        >
          Exportar CSV
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-low border-b border-outline-variant">
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              Folio
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              ID Cliente
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
              Situación
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              Estado
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              Contacto
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="font-table-data text-table-data divide-y divide-outline-variant">
          <tr
            v-for="client in clients"
            :key="client.id"
            class="hover:bg-surface-container-low transition-colors group"
          >
            <td class="px-xl py-md text-primary font-bold">{{ client.folio }}</td>
            <td class="px-xl py-md">{{ client.id }}</td>
            <td class="px-xl py-md">{{ client.date }}</td>
            <td class="px-xl py-md">
              <div class="flex items-center gap-sm">
                <div
                  class="w-8 h-8 rounded-full bg-secondary-fixed-dim text-[10px] flex items-center justify-center"
                >
                  {{ client.initials }}
                </div>
                <span>{{ client.name }}</span>
              </div>
            </td>
            <td class="px-xl py-md">
              <span
                :class="`px-xs py-0.5 text-xs rounded font-label-md ${getSituationClass(client.situation)}`"
              >
                {{ client.situation }}
              </span>
            </td>
            <td class="px-xl py-md">
              <div class="flex items-center gap-xs">
                <span :class="`w-2 h-2 rounded-full ${getStatusColor(client.status)}`"></span>
                {{ client.status }}
              </div>
            </td>
            <td class="px-xl py-md">
              <div class="text-body-sm">
                <p>{{ client.phone }}</p>
                <p class="text-on-surface-variant">{{ client.email }}</p>
              </div>
            </td>
            <td class="px-xl py-md text-center">
              <button
                class="material-symbols-outlined text-on-surface-variant hover:text-primary"
              >
                more_vert
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="px-xl py-md bg-surface-container-low/50 border-t border-outline-variant flex items-center justify-between"
    >
      <p class="text-body-sm text-on-surface-variant">
        Mostrando 1 a {{ Math.min(pageSize, totalRecords) }} de {{ totalRecords }} registros
      </p>
      <div class="flex items-center gap-sm">
        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high disabled:opacity-50 transition-all"
          :disabled="currentPage === 1"
          @click="emit('go-to-page', currentPage - 1)"
        >
          <span class="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>

        <div class="flex items-center gap-xs">
          <template v-for="page in totalPages" :key="page">
            <button
              v-if="
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              "
              :class="
                page === currentPage
                  ? 'w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md text-xs'
                  : 'w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high font-label-md text-xs'
              "
              @click="emit('go-to-page', page)"
            >
              {{ page }}
            </button>
            <span
              v-else-if="page === currentPage - 2 || page === currentPage + 2"
              class="text-on-surface-variant"
              >...</span
            >
          </template>
        </div>

        <button
          class="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-all"
          :disabled="currentPage === totalPages"
          @click="emit('go-to-page', currentPage + 1)"
        >
          <span class="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  </section>
</template>
