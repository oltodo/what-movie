import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { importMoviesPlugin } from "./vite-plugin-import-movies";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), importMoviesPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
