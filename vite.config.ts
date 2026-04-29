import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

import { copyManifest } from './plugins/copyManifest'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), copyManifest(), tailwindcss()],
  test: {
    clearMocks: true,
    environment: 'happy-dom',
    globals: true,
  },
})
