import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        process: true
      },
    }),
  ],
  resolve: {
    alias: {
      stream: "stream-browserify",
      buffer: "buffer",
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    exclude: ["process", "buffer"], // Exclude to avoid conflicts
  },
});
