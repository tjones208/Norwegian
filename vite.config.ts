import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // The app updates itself in the background; the next launch is current.
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Norsk Lærer — learn Norwegian',
        short_name: 'Norsk Lærer',
        description:
          'Learn Norwegian from the ground up: a 26-lesson course, drills graded word by word, speaking practice, and a reader with tap-to-speak.',
        // Relative so the app also installs correctly from a subpath.
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f7f5f0',
        theme_color: '#7a4522',
        lang: 'nb',
        dir: 'ltr',
        categories: ['education', 'books'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          // Android crops this one to its own shape, so it carries extra margin.
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // The texts in data/ are precached too, so a chapter opens on a plane.
        globPatterns: ['**/*.{js,css,html,png,svg,woff2,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
      },
      devOptions: { enabled: false },
    }),
  ],
  // Relative base so the built app also works from a subpath (GitHub Pages).
  base: './',
  build: { outDir: 'dist', sourcemap: true },
})
