/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_CLIENTS_URL: string
  readonly VITE_API_HISTORIAL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
