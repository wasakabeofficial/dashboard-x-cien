<script setup lang="ts">
import { useDashboard } from '@/presentation/composables/use-dashboard.composable'
import { useClients } from '@/presentation/composables/use-clients.composable'
import { watch } from 'vue'
import KpiCard from '@/presentation/components/dashboard/KpiCard.vue'
import DistributionChart from '@/presentation/components/dashboard/DistributionChart.vue'
import ClientTable from '@/presentation/components/dashboard/ClientTable.vue'
import AppTopNav from '@/presentation/components/layout/AppTopNav.vue'

const {
  data: dashboardData,
  loading: dashboardLoading,
  error: dashboardError,
} = useDashboard()

const {
  paginatedClients,
  currentPage,
  totalPages,
  totalRecords,
  loading: clientsLoading,
  searchClients,
  goToPage,
} = useClients()

function handleSearch(query: string): void {
  searchClients(query)
}

// Escuchar búsqueda desde el TopNav
watch(
  () => dashboardData.value,
  () => {
    // Datos cargados — los composables ya manejan su estado internamente
  },
)
</script>

<template>
  <div class="p-xl space-y-xl">
    <!-- Page Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="font-headline-md text-headline-md text-primary">Panel Operativo</h2>
        <p class="text-on-surface-variant font-body-md text-body-md">
          Bienvenido de nuevo, Administrador. Aquí está el resumen de hoy.
        </p>
      </div>
      <div class="flex gap-md">
        <button
          class="px-md py-sm bg-surface-container-lowest border border-outline text-secondary font-label-md rounded-lg flex items-center gap-xs hover:bg-surface-container-low transition-all"
        >
          <span class="material-symbols-outlined text-[18px]">filter_list</span>
          Filtros
        </button>
        <button
          class="px-md py-sm bg-primary text-on-primary font-label-md rounded-lg flex items-center gap-xs hover:opacity-90 transition-all shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">add</span>
          Nueva Tarea
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="dashboardLoading"
      class="flex items-center justify-center py-12 text-on-surface-variant"
    >
      <span class="material-symbols-outlined animate-spin mr-2">sync</span>
      Cargando datos del dashboard...
    </div>

    <!-- Error State -->
    <div
      v-else-if="dashboardError"
      class="bg-error-container text-on-error-container p-xl rounded-xl"
    >
      {{ dashboardError }}
    </div>

    <!-- Dashboard Content -->
    <template v-if="dashboardData && !dashboardLoading">
      <!-- KPI Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-xl">
        <KpiCard v-for="kpi in dashboardData.kpis" :key="kpi.title" :data="kpi" />
      </section>

      <!-- Middle Section: Charts & Insights -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <!-- Distribution Chart -->
        <div class="lg:col-span-4">
          <DistributionChart
            :items="dashboardData.distribution"
            :success-rate="dashboardData.successRate"
          />
        </div>

        <!-- Actionable Insights -->
        <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-md">
          <!-- Campaign Optimization -->
          <div
            v-for="insight in dashboardData.insights.filter((i) => i.type === 'campaign')"
            :key="insight.type"
            class="bg-primary-container p-xl rounded-xl text-on-primary-container relative overflow-hidden group"
          >
            <div class="relative z-10">
              <h4 class="font-headline-sm text-headline-sm text-white mb-md">
                {{ insight.title }}
              </h4>
              <p class="font-body-md text-white/80 mb-xl">
                {{ insight.description }}
              </p>
              <button
                class="bg-white text-primary px-md py-sm rounded-lg font-label-md flex items-center gap-sm"
              >
                {{ insight.actionLabel }}
                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
            <div
              class="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"
            ></div>
          </div>

          <!-- Quality Alerts -->
          <div
            v-for="insight in dashboardData.insights.filter((i) => i.type === 'alert')"
            :key="insight.type"
            class="bg-surface-container-highest p-xl rounded-xl border border-outline-variant flex flex-col justify-between"
          >
            <div>
              <h4 class="font-headline-sm text-headline-sm text-primary mb-xs">
                {{ insight.title }}
              </h4>
              <p class="font-body-sm text-on-surface-variant">
                {{ insight.description }}
              </p>
            </div>
            <div v-if="insight.teamMembers" class="flex items-center gap-md mt-md">
              <div class="flex -space-x-2">
                <div
                  class="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center overflow-hidden"
                >
                  <img
                    alt="Team 1"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2vVykU4jZtfg2feeipvHg3Fr2urqVlyIbVl32iMbQ9uzn5neOKLF-W29JYg-cex2IM3aRVcxhKupi4dtnpfPFSzRPasufx_hxh5Y030mA4r7GS6UooMgNwNqjPMm-D84f8WQPRmCAwRwsm39zO1_JQawdfCC8Cg8yFhp8ClGOIuW4-DFvn-W9iqNSKeD7joukB66Dr7FtGHfQjgmQQLSlwijIXVfuwVvG9X7xXqkptoLvz-OBne5clrAtOqm-UcARa6-C0Nm7YKs"
                  />
                </div>
                <div
                  class="w-8 h-8 rounded-full border-2 border-surface bg-surface-variant flex items-center justify-center overflow-hidden"
                >
                  <img
                    alt="Team 2"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Tr0jtXtM-IKfhtn0CnEV6UYjtfl0Ri9ZIWEhDnzyVkDKojO1OS8z7n1OpGR_aCLPUkpQGT2SxPtjx6UEVDYU3CBVuqgsJwQaZ2wB_BR54E--jIbzeG9rUKE2J_WKF_jsYIalInwidTY90oPFd3nJm7SgUQGx6cpSq1Rs9oRd1Rjroauky45DpRp7fhDzP3RoqQUYtKoSJQKS11zqihMEO16sxqiCCT-q9wqnhV3XB1eCj7pEIVXKatqZwU-ZJCVWvEIxv8WTJZ4"
                  />
                </div>
              </div>
              <span class="text-body-sm text-on-surface-variant">Revisado por IT</span>
            </div>
          </div>

          <!-- AI Suggestion Banner -->
          <div
            v-for="insight in dashboardData.insights.filter((i) => i.type === 'suggestion')"
            :key="insight.type"
            class="md:col-span-2 bg-secondary-container p-md rounded-xl flex items-center justify-between border border-outline-variant"
          >
            <div class="flex items-center gap-md">
              <div class="bg-white p-sm rounded-lg shadow-sm">
                <span class="material-symbols-outlined text-primary">auto_awesome</span>
              </div>
              <span class="font-label-md text-on-secondary-container">
                {{ insight.suggestion }}
              </span>
            </div>
            <span class="material-symbols-outlined text-on-secondary-container cursor-pointer">
              close
            </span>
          </div>
        </div>
      </section>

      <!-- Data Table -->
      <ClientTable
        :clients="paginatedClients"
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="4"
        :total-records="totalRecords"
        :loading="clientsLoading"
        @go-to-page="goToPage"
      />
    </template>
  </div>
</template>
