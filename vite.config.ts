import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) return "firebase";
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) return "react";
          if (id.includes("node_modules/@radix-ui")) return "radix";
          if (id.includes("node_modules/lucide-react")) return "icons";
        },
      },
    },
  },
});
