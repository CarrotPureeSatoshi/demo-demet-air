import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Clear errors on HMR
  clearScreen: false,

  // Tauri expects a fixed port
  server: {
    port: 5201,  // Demo Demet Air port
    strictPort: true,
    watch: {
      // Tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  // Build optimization with code splitting
  build: {
    // Increase chunk size warning limit slightly (default is 500kb)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching and performance
        manualChunks: {
          // React core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // RxDB and related state management
          'rx-vendor': ['rxdb', 'rxjs', 'dexie'],

          // Tauri API (only included in Tauri builds, but good to separate)
          'tauri-vendor': ['@tauri-apps/api'],

          // UI library (Shoelace)
          'ui-vendor': ['@shoelace-style/shoelace'],
        },
      },
    },
  },
});
