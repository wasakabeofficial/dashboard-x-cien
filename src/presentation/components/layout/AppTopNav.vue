<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSidebar } from '@/presentation/composables/use-sidebar.composable'
import { useSearch } from '@/presentation/composables/use-search.composable'

const localQuery = ref('')
const { toggle } = useSidebar()
const { setQuery } = useSearch()

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(localQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    setQuery(val)
  }, 300)
})
</script>

<template>
  <header
    class="sticky top-0 w-full z-30 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-outline-variant/40 flex items-center justify-between h-16 px-xl"
  >
    <div class="flex items-center gap-md flex-1">
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors lg:hidden text-on-surface-variant"
        @click="toggle"
      >
        <span class="material-symbols-outlined">menu</span>
      </button>

      <div
        class="flex items-center bg-surface-container-low/60 rounded-xl px-md py-sm w-96 border border-outline-variant/40 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all"
      >
        <span class="material-symbols-outlined text-on-surface-variant/60 mr-sm text-[20px]">search</span>
        <input
          v-model="localQuery"
          class="bg-transparent border-none focus:ring-0 text-body-md w-full outline-none placeholder:text-on-surface-variant/50"
          type="text"
          placeholder="Buscar clientes u operaciones..."
        />
      </div>
    </div>

    <div class="flex items-center gap-sm shrink-0">
      <button
        class="w-9 h-9 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-all text-on-surface-variant/70 hover:text-on-surface relative"
      >
        <span class="material-symbols-outlined text-[22px]">notifications</span>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
      </button>
      <button
        class="w-9 h-9 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-all text-on-surface-variant/70 hover:text-on-surface hidden sm:flex"
      >
        <span class="material-symbols-outlined text-[22px]">help_outline</span>
      </button>
      <button
        class="w-9 h-9 flex items-center justify-center hover:bg-surface-container-low rounded-lg transition-all text-on-surface-variant/70 hover:text-on-surface hidden sm:flex"
      >
        <span class="material-symbols-outlined text-[22px]">chat_bubble</span>
      </button>

      <div class="w-px h-6 bg-outline-variant/40 mx-sm"></div>

      <div
        class="h-9 w-9 rounded-full bg-secondary-container flex items-center justify-center border-2 border-surface-container-lowest shadow-sm overflow-hidden ml-sm shrink-0 ring-2 ring-outline-variant/30"
      >
        <img
          alt="Admin"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfiufAib9X0HahS6Psf7dS4-Q2HeCYNyaelH9aQsjJFqwI7orCFUFdmUKKMc2bAe5nj0KHo1Ct7_tiRanqHOzcb2e6xRmNzbTVKgz8dnqwYMu7oFgxYjDryxaimbwYqV4rBmVddek1JwdTVoJFFJbMAW9fBD41xfSWOYGwLAS3vOacHHGE-W56R7uhTM3_c4pA-oMgWiMCTb6x6XTK8Dz9hU74m_kPBsdJeumOfurRivmy0WZbSN2jFs4XxSF4KHEnUW8VhcA8tVE"
        />
      </div>
    </div>
  </header>
</template>
