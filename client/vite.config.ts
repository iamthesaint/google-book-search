import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 3000, // The port for the development server
    proxy: {
      // Proxy API requests to your backend
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
