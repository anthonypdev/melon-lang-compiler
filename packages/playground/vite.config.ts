import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@melon-lang/core']
  },
  build: {
    target: 'esnext',
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
});
