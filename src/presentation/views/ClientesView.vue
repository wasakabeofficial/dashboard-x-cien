<script setup lang="ts">
import { watch } from 'vue'
import { useClients } from '@/presentation/composables/use-clients.composable'
import { useSearch } from '@/presentation/composables/use-search.composable'
import ClientTable from '@/presentation/components/dashboard/ClientTable.vue'

const pageSize = 8
const {
  paginatedClients,
  currentPage,
  totalPages,
  totalRecords,
  loading,
  searchClients,
  goToPage,
  loadClients,
} = useClients(pageSize)

const { query: globalQuery } = useSearch()

// Reacciona a la búsqueda global del TopNav
watch(globalQuery, (q) => {
  if (q.trim()) {
    searchClients(q)
  } else {
    loadClients()
  }
})
</script>

<template>
  <div class="p-md lg:p-xl space-y-xl">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-md">
      <div>
        <h2 class="font-headline-md text-headline-md text-primary">Gestión de Clientes</h2>
        <p class="text-on-surface-variant font-body-md text-body-md">
          Administración y visualización de todos los registros
        </p>
      </div>
    </div>

    <!-- Loading -->
    <div
      v-if="loading"
      class="flex items-center justify-center py-12 text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando clientes...
    </div>

    <!-- Table -->
    <ClientTable
      v-else
      :clients="paginatedClients"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      :total-records="totalRecords"
      @go-to-page="goToPage"
    />
  </div>
</template>
