import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@book": path.resolve(__dirname, "src/features/book"),
      "@language": path.resolve(__dirname, "src/features/language"),
      "@term": path.resolve(__dirname, "src/features/term"),
      "@settings": path.resolve(__dirname, "src/features/settings"),
      "@backup": path.resolve(__dirname, "src/features/backup"),

      "@common": path.resolve(__dirname, "src/components/common"),
      "@actions": path.resolve(__dirname, "src/actions"),
      "@resources": path.resolve(__dirname, "src/resources"),
    },
  },
});
