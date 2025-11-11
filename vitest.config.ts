import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  resolve: {
    conditions: ['browser']
  },
  optimizeDeps: {
    exclude: [
      '@finos/perspective',
      '@finos/perspective-viewer',
      '@finos/perspective-viewer-d3fc',
      '@finos/perspective-viewer-datagrid',
    ],
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
