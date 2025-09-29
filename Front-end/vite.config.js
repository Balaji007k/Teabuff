import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    //   manifest: {
    //     name: 'TeaBuff',
    //     short_name: 'TeaBuff',
    //     description: 'Tea Shop with Offline Homepage',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         // Cache homepage (Main.jsx compiled into index.html + JS)
    //         urlPattern: ({ url }) => url.pathname === '/Teabuff/',
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'homepage-cache',
    //         },
    //       },
    //       {
    //         // Cache JS + CSS
    //         urlPattern: ({ request }) =>
    //           request.destination === 'script' || request.destination === 'style',
    //         handler: 'StaleWhileRevalidate',
    //         options: {
    //           cacheName: 'static-resources',
    //         },
    //       },
    //       {
    //         // Cache images (products, about images, etc.)
    //         urlPattern: ({ request }) => request.destination === 'image',
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'image-cache',
    //           expiration: {
    //             maxEntries: 200,
    //             maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
    //           },
    //         },
    //       }
    //     ]
    //   }
    // })
  ],
  base: '/Teabuff/'   // keep your repo base path
})
