import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Allow common local hosts and keep the existing ngrok host if used.
  const allowedHosts = [
    'localhost',
    '127.0.0.1',
    'c6e9b49c9124.ngrok-free.app',
  ];

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      // Prefer TypeScript sources when extensionless imports are used
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.json'],
    },
    server: {
      host: true, // listen on 0.0.0.0 inside Docker
      port: 5173,
      strictPort: true,
      watch: {
        // improves reliability of file change detection on Docker/VMs
        usePolling: true,
        interval: 300,
      },
      allowedHosts,
      hmr: {
        // ensure the client connects back to the host machine port
        host: 'localhost',
        clientPort: 5173,
      },
    },
  };
});
