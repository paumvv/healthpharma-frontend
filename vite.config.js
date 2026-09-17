import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Registro manual (main.jsx) para forzar recarga automática apenas haya una versión nueva:
      // con el registro "auto" por defecto, la pestaña abierta se queda con los assets viejos
      // hasta que el usuario la cierra y la reabre, lo que hace parecer que "no se actualiza".
      injectRegister: false,
      includeAssets: ['favicon.svg', 'icons.svg'],
      manifest: {
        name: 'HealthPharma',
        short_name: 'HealthPharma',
        description: 'Catálogo, inventario y punto de venta farmacéutico — Sucursal 044.',
        theme_color: '#0f172a',
        background_color: '#f1f5f9',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        skipWaiting: true,
        clientsClaim: true
      }
    }),
  ],
})