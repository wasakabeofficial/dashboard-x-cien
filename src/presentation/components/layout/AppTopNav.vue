<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSidebar } from '@/presentation/composables/use-sidebar.composable'
import { useSearch } from '@/presentation/composables/use-search.composable'

const localQuery = ref('')
const searchFocused = ref(false)
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
    class="sticky top-0 w-full z-30 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/40 flex items-center justify-between h-16 px-md lg:px-xl"
  >
    <!-- Left: Hamburger + Search -->
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Hamburger (solo mobile) -->
      <button
        class="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all duration-200 lg:hidden text-on-surface-variant active:scale-95"
        @click="toggle"
        aria-label="Abrir menú"
      >
        <span class="material-symbols-outlined text-xl">menu</span>
      </button>

      <!-- Search -->
      <div
        class="group relative flex items-center w-full max-w-md transition-all duration-300"
        :class="searchFocused ? 'scale-[1.02]' : ''"
      >
        <div
          class="absolute inset-0 rounded-2xl bg-gradient-to-br from-surface-container-high to-surface-container-low opacity-80 pointer-events-none"
        />
        <div
          class="relative flex items-center w-full rounded-2xl border border-outline-variant/60 bg-surface-container-low/90 backdrop-blur-sm px-3.5 py-2.5 shadow-sm transition-all duration-300"
          :class="
            searchFocused
              ? 'border-primary/60 shadow-lg shadow-primary/5 ring-2 ring-primary/10'
              : 'hover:border-outline-variant hover:shadow-md'
          "
        >
          <span
            class="material-symbols-outlined text-base mr-2 transition-colors duration-300 shrink-0"
            :class="searchFocused ? 'text-primary' : 'text-on-surface-variant/60 group-hover:text-on-surface-variant'"
          >
            search
          </span>
          <input
            v-model="localQuery"
            class="bg-transparent border-none focus:ring-0 text-sm w-full outline-none min-w-0 text-on-surface placeholder:text-on-surface-variant/40"
            type="text"
            placeholder="Buscar en vista actual…"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button
            v-if="localQuery"
            class="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-container-high transition-all duration-200 active:scale-90"
            @click="
              localQuery = '',
              setQuery('')
            "
            aria-label="Limpiar búsqueda"
          >
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
          <!-- Keyboard hint -->
          <kbd
            v-if="!localQuery && !searchFocused"
            class="hidden sm:flex items-center gap-0.5 ml-auto pl-2 shrink-0"
          >
            <span
              class="text-[10px] font-mono leading-none px-1.5 py-0.5 rounded-md bg-surface-container-highest/60 text-on-surface-variant/40 border border-outline-variant/30"
            >⌘K</span>
          </kbd>
        </div>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-1.5 lg:gap-2 shrink-0">
      <!-- Icon buttons with tooltips -->
      <div class="relative group/notif">
        <button
          class="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all duration-200 text-on-surface-variant active:scale-90"
          aria-label="Notificaciones"
        >
          <span class="material-symbols-outlined text-xl">notifications</span>
          <span
            class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-1 ring-surface"
          />
        </button>
      </div>

      <div class="relative group/help">
        <button
          class="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-surface-container-high transition-all duration-200 text-on-surface-variant active:scale-90"
          aria-label="Ayuda"
        >
          <span class="material-symbols-outlined text-xl">help_outline</span>
        </button>
      </div>

      <div class="relative group/chat">
        <button
          class="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-surface-container-high transition-all duration-200 text-on-surface-variant active:scale-90"
          aria-label="Chat"
        >
          <span class="material-symbols-outlined text-xl">chat_bubble</span>
        </button>
      </div>

      <div class="w-px h-6 bg-outline-variant/30 mx-1 shrink-0" />

      <!-- Avatar -->
      <button
        class="relative h-8 w-8 rounded-xl overflow-hidden ring-1 ring-outline-variant/30 hover:ring-primary/30 transition-all duration-200 hover:shadow-md active:scale-95 shrink-0 group/avatar"
        aria-label="Perfil"
      >
        <img
          alt="Admin"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfiufAib9X0HahS6Psf7dS4-Q2HeCYNyaelH9aQsjJFqwI7orCFUFdmUKKMc2bAe5nj0KHo1Ct7_tiRanqHOzcb2e6xRmNzbTVKgz8dnqwYMu7oFgxYjDryxaimbwYqV4rBmVddek1JwdTVoJFFJbMAW9fBD41xfSWOYGwLAS3vOacHHGE-W56R7uhTM3_c4pA-oMgWiMCTb6x6XTK8Dz9hU74m_kPBsdJeumOfurRivmy0WZbSN2jFs4XxSF4KHEnUW8VhcA8tVE"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </header>
</template>
