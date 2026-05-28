<script setup lang="ts">
import { useClients } from '@/presentation/composables/use-clients.composable'
import ClientTable from '@/presentation/components/dashboard/ClientTable.vue'

const {
  paginatedClients,
  currentPage,
  totalPages,
  totalRecords,
  loading,
  searchClients,
  goToPage,
  loadClients,
} = useClients(8)
</script>

<template>
  <div class="p-xl space-y-xl">
    <!-- Page Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-headline-md text-headline-md text-primary">Gestión de Clientes</h2>
        <p class="text-on-surface-variant font-body-md text-body-md">
          Administración y visualización de todos los registros
        </p>
      </div>
      <div class="flex gap-md">
        <button
          class="px-md py-sm bg-primary text-on-primary font-label-md rounded-lg flex items-center gap-xs hover:opacity-90 transition-all shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Nuevo Cliente
        </button>
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
      :page-size="8"
      :total-records="totalRecords"
      @go-to-page="goToPage"
    />
  </div>
</template>
