import { createReadStream, existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const faviconDir = path.resolve(rootDir, "src/assets/favicon");

/** Serve / emit favicon assets from src/assets/favicon at the site root. */
function faviconAssetsPlugin(): Plugin {
  const skip = new Set(["site.webmanifest"]);

  const listFiles = () =>
    readdirSync(faviconDir).filter((name) => !skip.has(name) && !name.startsWith("."));

  return {
    name: "poyino-favicon-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const requestPath = req.url?.split("?")[0] ?? "";
        const fileName = listFiles().find(
          (name) => requestPath === `/${name}` || requestPath === `/favicon/${name}`,
        );

        if (!fileName) {
          next();
          return;
        }

        const filePath = path.join(faviconDir, fileName);
        if (!existsSync(filePath)) {
          next();
          return;
        }

        if (fileName.endsWith(".svg")) {
          res.setHeader("Content-Type", "image/svg+xml");
        } else if (fileName.endsWith(".ico")) {
          res.setHeader("Content-Type", "image/x-icon");
        } else if (fileName.endsWith(".png")) {
          res.setHeader("Content-Type", "image/png");
        } else if (fileName.endsWith(".json") || fileName.endsWith(".webmanifest")) {
          res.setHeader("Content-Type", "application/manifest+json");
        }

        createReadStream(filePath).pipe(res);
      });
    },
    // Emit into the Rollup bundle so Workbox can precache icons + manifest.
    generateBundle() {
      for (const fileName of listFiles()) {
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(path.join(faviconDir, fileName)),
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    faviconAssetsPlugin(),
    VitePWA({
      // Generate sw.js with Workbox cache versioning on each build.
      strategies: "generateSW",
      filename: "sw.js",
      registerType: "prompt",
      injectRegister: false,
      // Manifest lives in src/assets/favicon/manifest.json (copied to dist root).
      manifest: false,
      includeAssets: ["offline.html"],
      workbox: {
        // Cache built static assets (HTML/CSS/JS/images/fonts).
        // Cache names are versioned by Workbox on each build revision.
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff,woff2,json}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /\/offline\.html$/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: false,
        runtimeCaching: [
          // Network-first for API calls (fresh data when online, cache when offline).
          {
            urlPattern: ({ url }) =>
              url.pathname.startsWith("/api") ||
              /^api\./i.test(url.hostname) ||
              (url.hostname === "localhost" && url.port === "3000"),
            handler: "NetworkFirst",
            options: {
              cacheName: "poyino-api-cache",
              networkTimeoutSeconds: 8,
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache-first for static image/font assets.
          {
            urlPattern: ({ request, url }) =>
              request.destination === "image" ||
              request.destination === "font" ||
              /\.(?:png|jpe?g|svg|gif|webp|ico|woff2?)$/i.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "poyino-static-cache",
              expiration: {
                maxEntries: 128,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // Cache-first for hashed JS/CSS bundles after first fetch.
          {
            urlPattern: ({ request }) =>
              request.destination === "script" || request.destination === "style",
            handler: "CacheFirst",
            options: {
              cacheName: "poyino-asset-cache",
              expiration: {
                maxEntries: 96,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    fs: {
      allow: ["../.."],
    },
  },
  build: {
    // Vite already minifies JS/CSS; keep CSS code-split for faster loads.
    cssMinify: true,
    minify: "esbuild",
    sourcemap: false,
  },
});
