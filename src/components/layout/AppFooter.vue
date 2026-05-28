<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto p-xl text-center border-t border-outline-variant bg-surface-container-low">
    <p class="text-on-surface-variant font-label-md text-label-md">
      &copy; {{ year }} OpsConsole Enterprise &mdash; Panel de Control Operativo Avanzado
    </p>
  </footer>
</template>
