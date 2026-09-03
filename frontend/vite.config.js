import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Caminho relativo: funciona tanto na raiz de um domínio próprio quanto
  // em GitHub Pages, onde o site fica em usuario.github.io/nome-do-repo/.
  base: "./",
  server: {
    port: 5173,
  },
});
