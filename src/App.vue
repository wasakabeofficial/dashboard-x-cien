<script setup lang="ts">
import { provide } from 'vue'
import { serviceLocator } from '@/infrastructure/di/service-locator'
import {
  GET_CLIENTS_USE_CASE,
  GET_HISTORIAL_USE_CASE,
  GET_DASHBOARD_DATA_USE_CASE,
} from '@/presentation/di-keys'
import AppSidebar from '@/presentation/components/layout/AppSidebar.vue'
import AppTopNav from '@/presentation/components/layout/AppTopNav.vue'
import AppFooter from '@/presentation/components/layout/AppFooter.vue'
import DownloadReportsModal from '@/presentation/components/layout/DownloadReportsModal.vue'
import { useSidebar } from '@/presentation/composables/use-sidebar.composable'

provide(GET_CLIENTS_USE_CASE, serviceLocator.getClients())
provide(GET_HISTORIAL_USE_CASE, serviceLocator.getHistorial())
provide(GET_DASHBOARD_DATA_USE_CASE, serviceLocator.getDashboardData())

const { isOpen, close } = useSidebar()
</script>

<template>
  <AppSidebar />
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-30 bg-black/40 lg:hidden"
        @click="close"
      />
    </Transition>
  </Teleport>

  <main class="min-h-screen flex flex-col lg:ml-70">
    <AppTopNav />
    <div class="flex-1 overflow-x-hidden">
      <router-view />
    </div>

    <AppFooter />
  </main>
  <DownloadReportsModal />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
