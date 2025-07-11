import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, '../../packages/core/src'),
      '@adapters': path.resolve(__dirname, '../../packages/adapters/src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
