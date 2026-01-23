import { defineConfig } from 'vite';
import ReactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [ReactPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});