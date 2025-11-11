import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['chroma-js'],
    exclude: [
      '@finos/perspective',
      '@finos/perspective-viewer'
    ],
    esbuildOptions: {
      target: 'esnext',
      external: ['@finos/perspective', '@finos/perspective-viewer']
    }
  },
  assetsInclude: ['**/*.wasm'],
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: playwright(),
      headless: true,
      instances: [{
        browser: 'chromium',
      }],
    },
    testTimeout: 60000,
    hookTimeout: 60000,
  },
})
