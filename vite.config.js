import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react';
    import 'regenerator-runtime/runtime'`,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http:// 192.168.43.134:5000',
        changeOrigin: true,
        ws: true,
      }
    }
  }
});
