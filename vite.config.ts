import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy token minting to the local mint server (server/mint.js).
    proxy: { '/api': 'http://localhost:3001' },
  },
});
