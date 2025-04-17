import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { codeInspectorPlugin } from 'code-inspector-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    codeInspectorPlugin({
      bundler: 'vite'
    }),
  ],
});
