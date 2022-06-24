import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import { copyManifest } from "./plugins/copyManifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), copyManifest()],
});
