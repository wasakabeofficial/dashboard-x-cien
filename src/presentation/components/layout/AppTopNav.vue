<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
</script>

<template>
  <header
    class="sticky top-0 w-full z-30 bg-surface border-b border-outline-variant flex items-center justify-between h-16 px-xl"
  >
    <!-- Search -->
    <div
      class="flex items-center bg-surface-container-low rounded-full px-md py-xs w-96 border border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 transition-all"
    >
      <span class="material-symbols-outlined text-on-surface-variant mr-xs">search</span>
      <input
        v-model="searchQuery"
        class="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none"
        type="text"
        placeholder="Buscar clientes u operaciones..."
      />
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-md">
      <button
        class="p-xs hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant"
      >
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <button
        class="p-xs hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant"
      >
        <span class="material-symbols-outlined">help_outline</span>
      </button>
      <button
        class="p-xs hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant"
      >
        <span class="material-symbols-outlined">chat_bubble</span>
      </button>

      <!-- Avatar -->
      <div
        class="h-8 w-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline overflow-hidden ml-md"
      >
        <img
          alt="Admin"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfiufAib9X0HahS6Psf7dS4-Q2HeCYNyaelH9aQsjJFqwI7orCFUFdmUKKMc2bAe5nj0KHo1Ct7_tiRanqHOzcb2e6xRmNzbTVKgz8dnqwYMu7oFgxYjDryxaimbwYqV4rBmVddek1JwdTVoJFFJbMAW9fBD41xfSWOYGwLAS3vOacHHGE-W56R7uhTM3_c4pA-oMgWiMCTb6x6XTK8Dz9hU74m_kPBsdJeumOfurRivmy0WZbSN2jFs4XxSF4KHEnUW8VhcA8tVE"
        />
      </div>
    </div>
  </header>
</template>
