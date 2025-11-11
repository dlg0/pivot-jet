import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
    esbuildOptions: {
      target: 'esnext'
    }
  },
  assetsInclude: ['**/*.wasm'],
  define: {
    'process.env': {}
  },
  build: {
    target: 'esnext'
  }
})