<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { ClientEntity } from '@/domain/entities/client.entity'
import { computed } from 'vue'

const props = defineProps<{
  clients: ClientEntity[]
  currentPage: number
  totalPages: number
  pageSize: number
  totalRecords: number
}>()

const emit = defineEmits<{
  'go-to-page': [page: number]
}>()

const router = useRouter()

const hasData = computed(() => props.clients.length > 0)

function goToDetail(clientId: string): void {
  router.push({ name: 'client-detail', params: { id: clientId } })
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
              Empresa
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              Contacto Principal
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              Teléfono
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
            >
              Correo
            </th>
            <th
              class="px-xl py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center"
            >
              Detalle
            </th>
          </tr>
        </thead>
        <tbody class="font-table-data text-table-data divide-y divide-outline-variant">
          <tr
            v-for="client in clients"
            :key="client.id"
            class="hover:bg-surface-container-low transition-colors group cursor-pointer"
            @click="goToDetail(client.id)"
          >
            <td class="px-xl py-md">
              <div class="flex items-center gap-sm">
                <div
                  class="w-8 h-8 rounded-full bg-secondary-fixed-dim text-[10px] flex items-center justify-center font-bold"
                >
                  {{ client.initials }}
                </div>
                <span class="font-semibold text-primary">{{ client.name }}</span>
              </div>
            </td>
            <td class="px-xl py-md text-on-surface">
              {{ client.contactoPrincipal }}
            </td>
            <td class="px-xl py-md text-on-surface font-mono text-body-sm">
              {{ client.phone }}
            </td>
            <td class="px-xl py-md text-on-surface-variant text-body-sm">
              {{ client.email }}
            </td>
            <td class="px-xl py-md text-center">
              <span
                class="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors"
              >
                chevron_right
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-else
        class="flex flex-col items-center justify-center h-full text-on-surface-variant"
      >
        <span class="material-symbols-outlined text-4xl mb-md">table_rows</span>
        <p class="font-body-md text-body-md">No hay registros para mostrar</p>
      </div>
    </div>

    <!-- Pagination (fijo) -->
    <div
      class="px-xl py-md bg-surface-container-low/50 border-t border-outline-variant flex items-center justify-between shrink-0"
    >
      <p class="text-body-sm text-on-surface-variant">
        <template v-if="hasData">
          Mostrando 1 a {{ Math.min(pageSize, totalRecords) }} de {{ totalRecords }} registros
        </template>
        <template v-else>
          Sin registros
        </template>
      </p>
      <div v-if="hasData" class="flex items-center gap-sm">
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
