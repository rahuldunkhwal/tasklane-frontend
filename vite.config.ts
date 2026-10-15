import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/components/ui/button" instead of "../../../components/ui/button"
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    // The browser only talks to localhost:5173. Vite forwards every /api request to the backend,
    // so the auth cookie is "same-site" and SameSite=Lax just works (no cross-site cookie problems).
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
