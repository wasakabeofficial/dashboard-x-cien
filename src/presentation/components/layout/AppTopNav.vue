<script setup lang="ts">
import { ref } from 'vue'
import { useSidebar } from '@/presentation/composables/use-sidebar.composable'

const searchQuery = ref('')
const { toggle } = useSidebar()
</script>

<template>
  <header
    class="sticky top-0 w-full z-20 bg-surface border-b border-outline-variant flex items-center justify-between h-16 px-md lg:px-xl"
  >
    <!-- Hamburger + Search -->
    <div class="flex items-center gap-md flex-1">
      <!-- Hamburger (solo mobile) -->
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors lg:hidden text-on-surface-variant"
        @click="toggle"
      >
        <span class="material-symbols-outlined">menu</span>
      </button>

      <!-- Search -->
      <div
        class="flex items-center bg-surface-container-low rounded-full px-md py-xs max-w-md w-full border border-outline-variant focus-within:ring-2 focus-within:ring-primary/20 transition-all"
      >
        <span class="material-symbols-outlined text-on-surface-variant mr-xs text-[18px]">search</span>
        <input
          v-model="searchQuery"
          class="bg-transparent border-none focus:ring-0 text-body-sm w-full outline-none min-w-0"
          type="text"
          placeholder="Buscar..."
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-sm lg:gap-md shrink-0">
      <button
        class="p-xs hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant"
      >
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <button
        class="p-xs hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant hidden sm:flex"
      >
        <span class="material-symbols-outlined">help_outline</span>
      </button>
      <button
        class="p-xs hover:bg-surface-container-low rounded-full transition-all text-on-surface-variant hidden sm:flex"
      >
        <span class="material-symbols-outlined">chat_bubble</span>
      </button>

      <!-- Avatar -->
      <div
        class="h-8 w-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline overflow-hidden ml-sm lg:ml-md shrink-0"
      >
        <img
          alt="Admin"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfiufAib9X0HahS6Psf7dS4-Q2HeCYNyaelH9aQsjJFqwI7orCFUFdmUKKMc2bAe5nj0KHo1Ct7_tiRanqHOzcb2e6xRmNzbTVKgz8dnqwYMu7oFgxYjDryxaimbwYqV4rBmVddek1JwdTVoJFFJbMAW9fBD41xfSWOYGwLAS3vOacHHGE-W56R7uhTM3_c4pA-oMgWiMCTb6x6XTK8Dz9hU74m_kPBsdJeumOfurRivmy0WZbSN2jFs4XxSF4KHEnUW8VhcA8tVE"
        />
      </div>
    </div>
  </header>
</template>
