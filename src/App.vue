<script setup lang="ts">
import AppSidebar from '@/presentation/components/layout/AppSidebar.vue'
import AppTopNav from '@/presentation/components/layout/AppTopNav.vue'
import AppFooter from '@/presentation/components/layout/AppFooter.vue'
import DownloadReportsModal from '@/presentation/components/layout/DownloadReportsModal.vue'
import { useSidebar } from '@/presentation/composables/use-sidebar.composable'

const { isOpen, close } = useSidebar()
</script>

<template>
  <!-- Sidebar (overlay en mobile, fijo en lg+) -->
  <AppSidebar />

  <!-- Overlay backdrop para mobile -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-30 bg-black/40 lg:hidden"
        @click="close"
      />
    </Transition>
  </Teleport>

  <!-- Main Content Wrapper -->
  <main class="min-h-screen flex flex-col lg:ml-[280px]">
    <AppTopNav />

    <!-- Page Content (router outlet) -->
    <div class="flex-1 overflow-x-hidden">
      <router-view />
    </div>

    <AppFooter />
  </main>

  <!-- Modal global de descarga de reportes -->
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
