import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Required for Codespaces
    port: 5173,       // Frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
