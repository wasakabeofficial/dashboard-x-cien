<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopNav from '@/components/layout/AppTopNav.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
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
</template>
