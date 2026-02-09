import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Kenichi Assets Maker',
        short_name: 'Assets Maker',
        description: 'A robust suite of local-first creative tools for rapid asset generation.',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/assets/logos/png/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/logos/png/logo-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/assets/logos/png/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
