import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Docker on Windows does not forward file-change events into containers,
    // so the dev Compose file turns on polling to keep live reload working.
    watch: process.env.VITE_USE_POLLING === 'true'
      ? { usePolling: true, interval: 300 }
      : undefined,
  },
})
