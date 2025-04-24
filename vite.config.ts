import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/inplay-basket": {
        target: "http://inplay.goalserve.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/inplay-basket/, "/inplay-basket.gz"),
        secure: false, // Optionally add this if you're encountering issues with SSL/TLS
      },
    },
  },
});
