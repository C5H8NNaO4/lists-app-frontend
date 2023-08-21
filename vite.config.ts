import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3001,
  },
  envPrefix: 'REACT_APP_',
  plugins: [
    react(),
    VitePWA({
      srcDir: 'src',
      registerType: 'autoUpdate',
      filename: 'service-worker.js',
      strategies: 'injectManifest',
      injectRegister: 'auto',
      manifest: false,
      injectManifest: {
        injectionPoint: null,
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
});
