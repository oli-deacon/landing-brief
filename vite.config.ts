import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "icons/apple-touch-icon.svg",
        "icons/pwa-192.svg",
        "icons/pwa-512.svg",
        "icons/pwa-maskable.svg"
      ],
      manifest: {
        name: "LandingBrief",
        short_name: "LandingBrief",
        description: "Travel-ready before you touch down",
        theme_color: "#edf4f4",
        background_color: "#edf4f4",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/pwa-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "/icons/pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "/icons/pwa-maskable.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "app-shell",
              networkTimeoutSeconds: 3
            }
          },
          {
            urlPattern: ({ request }) =>
              ["script", "style", "image", "font"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-assets"
            }
          },
          {
            urlPattern: ({ request }) => request.url.includes("/data/countries/"),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "country-data"
            }
          }
        ]
      }
    })
  ]
});
