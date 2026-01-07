import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    // GitHub Pages repo deploy: https://<user>.github.io/Workout-Power-PWA/
    base: isProd ? '/Workout-Power-PWA/' : '/',
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: true },
        includeAssets: ['icon.svg'],
        manifest: {
          name: 'Workout Power',
          short_name: 'W Power',
          start_url: '.',
          display: 'standalone',
          background_color: '#0b1f14',
          theme_color: '#0b1f14',
          icons: [
            {
              src: 'icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any'
            }
          ]
        }
      })
    ]
  };
});