import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/dpmm-pwa_red/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'icon-512.png'],
      manifest: {
        name: 'DPMM Association Management System',
        short_name: 'DPMM AMS',
        description: 'Digital membership platform for Dewan Perniagaan Melayu Malaysia (DPMM)',
        theme_color: '#1e2e70',
        background_color: '#0b1028',
        display: 'browser',
        orientation: 'portrait-primary',
        scope: '/dpmm-pwa_red/',
        start_url: '/dpmm-pwa_red/',
        lang: 'ms-MY',
        categories: ['business', 'government'],
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Register Membership',
            short_name: 'Register',
            description: 'Start a new membership application',
            url: '/dpmm-pwa/?view=register',
            icons: [{ src: 'icon-512.png', sizes: '192x192' }],
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallbackAllowlist: [/^\/index\.html$/],
      },
    }),
  ],
})
