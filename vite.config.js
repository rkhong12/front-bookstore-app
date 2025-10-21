// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 4000,
    proxy: {
      "/api/v1": {
        target: "http://localhost:9090/api/v1",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/v1/, ""),
      },
      "/api": {
        target: "http://localhost:9090/api",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS에서도 @ 쓸 수 있게
        includePaths: [path.resolve(__dirname, "src")],
        // 모든 SCSS 파일에 자동으로 주입되는 부분
        additionalData: `
          @use "sass:math";
          @use "sass:map";
          @use "@/assets/scss/partials/abstracts" as *;
        `,
      },
    },
    // },
    //   modules: {
    //     // localsConvention: "camelCaseOnly",
    //   },
  },
});
