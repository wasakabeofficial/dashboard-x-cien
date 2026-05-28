<script setup lang="ts">
import type { ClientEntity } from '@/domain/entities/client.entity'
import { useNavigationDebounce } from '@/presentation/composables/use-navigation-debounce.composable'
import AppTableContainer from '@/presentation/components/shared/AppTableContainer.vue'

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

const { push } = useNavigationDebounce()

function goToDetail(clientId: string): void {
  push({ name: 'client-detail', params: { id: clientId } })
}
</script>

<template>
  <AppTableContainer
    :data="clients"
    :total-records="totalRecords"
    :current-page="currentPage"
    :total-pages="totalPages"
    :page-size="pageSize"
    empty-message="No hay clientes registrados"
    empty-icon="table_rows"
    @go-to-page="emit('go-to-page', $event)"
  >
    <template #columns>
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
    </template>

    <template #rows="{ data }">
      <tr
        v-for="client in data as ClientEntity[]"
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
    </template>
  </AppTableContainer>
</template>
