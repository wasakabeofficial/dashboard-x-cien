<script setup lang="ts">
import AppSidebar from '@/presentation/components/layout/AppSidebar.vue'
import AppTopNav from '@/presentation/components/layout/AppTopNav.vue'
import AppFooter from '@/presentation/components/layout/AppFooter.vue'
import DownloadReportsModal from '@/presentation/components/layout/DownloadReportsModal.vue'
</script>

<template>
  <!-- Sidebar -->
  <AppSidebar />

  <!-- Main Content Wrapper -->
  <main class="ml-[280px] min-h-screen flex flex-col">
    <AppTopNav />

    <!-- Page Content (router outlet) -->
    <router-view />

    <AppFooter />
  </main>

  <!-- Modal global de descarga de reportes -->
  <DownloadReportsModal />
</template>
