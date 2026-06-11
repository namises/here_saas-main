// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import fs from "fs";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import dotenv from "dotenv";
import Inspect from "vite-plugin-inspect";

export default defineConfig(({ command, mode }) => {
  dotenv.config({ path: path.resolve(__dirname, `.env`) });
  const isDev = command === "serve";
  const icons = JSON.parse(fs.readFileSync("client/src/assets/PWA/icons.json", "utf-8")).map((icon) =>
    isDev
      ? {
          src: `src/${icon.src}`,
          sizes: icon.sizes,
        }
      : {
          src: `${icon.src}`,
          sizes: icon.sizes,
        }
  );
  return {
    root: path.resolve(__dirname, "client"),
    plugins: [
      react(),
      tailwindcss(),
      flowbiteReact(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        manifest: {
          id: "/",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          lang: "en",
          orientation: "portrait",
          name: "here",
          short_name: "here",
          description: "A comprehensive HR management system",
          theme_color: "#ffffff",
          icons: icons,
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,jpg,ico}"],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
        },
      }),
      viteStaticCopy({
        targets: [
          {
            src: "src/assets/PWA",
            dest: "assets",
          },
          {
            src: "src/firebase/firebase-messaging-sw.js",
            dest: ".",
          },
        ],
      }),
      Inspect(),
    ],
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: false,
    },
    resolve: {
      alias: {
        src: "/src",
        crypto: "crypto-browserify",
        stream: "stream-browserify",
        assert: "assert",
        buffer: "buffer",
      },
    },
    optimizeDeps: {
      include: ["flowbite-react", "flowbite"],
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
    server: {
      port: 3001,
      strictPort: true,
      allowedHosts: ["ezulixmacbookpro.ddns.net", "localhost"],
    },
    define: {
      __APP_ENV__: JSON.stringify(process.env.VITE_API_BASE_URL),
    },
  };
});
