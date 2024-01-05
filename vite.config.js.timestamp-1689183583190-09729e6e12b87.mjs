// vite.config.js
import { defineConfig } from "file:///home/romaric/Documents/Project/chat_admission/node_modules/vite/dist/node/index.js";
import react from "file:///home/romaric/Documents/Project/chat_admission/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react';
    import 'regenerator-runtime/runtime'`
  },
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.43.134:5000",
        changeOrigin: true,
        ws: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9yb21hcmljL0RvY3VtZW50cy9Qcm9qZWN0L2NoYXRfYWRtaXNzaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9yb21hcmljL0RvY3VtZW50cy9Qcm9qZWN0L2NoYXRfYWRtaXNzaW9uL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3JvbWFyaWMvRG9jdW1lbnRzL1Byb2plY3QvY2hhdF9hZG1pc3Npb24vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBlc2J1aWxkOiB7XG4gICAganN4SW5qZWN0OiBgaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbiAgICBpbXBvcnQgJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSdgLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjQzLjEzNDo1MDAwJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB3czogdHJ1ZSxcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VCxTQUFTLG9CQUFvQjtBQUN6VixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLFdBQVc7QUFBQTtBQUFBLEVBRWI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLElBQUk7QUFBQSxNQUNOO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
