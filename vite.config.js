import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',  // Automatically registers and updates the service worker
      devOptions: { enabled: true }  // Enables PWA in dev mode for testing
    })
  ]
});