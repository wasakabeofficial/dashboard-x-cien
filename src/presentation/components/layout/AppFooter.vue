<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto p-md lg:p-xl text-center border-t border-outline-variant bg-surface-container-low">
    <p class="text-on-surface-variant font-label-md text-label-md">
      &copy; {{ year }} XCien Enterprise &mdash; Panel de Control Operativo Avanzado
      <br />
      Creado por
      <a
        href="https://neuropoint.ai"
        target="_blank"
        rel="noopener noreferrer"
        class="font-weight-bold text-primary hover:text-primary-container transition-colors duration-200"
      >
        Neuropoint.ai
      </a>
    </p>
  </footer>
</template>
