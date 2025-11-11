import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  define: {
    'process.env': {}
  },
  build: {
    target: 'esnext'
  }
})