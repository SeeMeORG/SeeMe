import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import { defineConfig, UserConfig } from "vite";

const config: UserConfig = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Required for polyfilling core Node.js modules
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      buffer: "rollup-plugin-node-polyfills/polyfills/buffer-es6",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  }
});

export default config;
