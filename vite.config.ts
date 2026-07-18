import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Respecte le port fourni par l'environnement (préviews, CI…).
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
});
