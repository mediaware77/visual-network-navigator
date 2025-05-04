import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";
import { Plugin } from "vite";

// Plugin personalizado para tratar o arquivo de configuração
const configFilePlugin = (): Plugin => ({
  name: 'config-file-plugin',
  generateBundle(_, bundle) {
    // Lê o arquivo config.ts
    const configContent = fs.readFileSync(path.resolve(__dirname, 'src/config.ts'), 'utf-8');
    
    // Compila o TypeScript para JavaScript (mantendo comentários)
    // Substitui a sintaxe de exportação TypeScript por CommonJS/ESM compatível
    const jsContent = configContent
      .replace(/\/\*\*[\s\S]*?\*\//g, match => match) // Preserva comentários de bloco
      .replace(/\/\/.*/g, match => match) // Preserva comentários de linha
      .replace('export const', 'export const'); // Mantém a exportação ES modules
    
    // Adiciona o arquivo ao bundle como um asset não processado
    this.emitFile({
      type: 'asset',
      fileName: 'config.js',
      source: jsContent
    });
  }
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    configFilePlugin(), // Plugin para tratar o arquivo config.ts
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Configurações específicas para o build
    rollupOptions: {
      // Preserva o arquivo config.js sem minificação
      output: {
        manualChunks(id) {
          // Identifica o arquivo config.ts para tratamento especial
          if (id.includes('src/config.ts')) {
            return 'config';
          }
        },
        // Evita a minificação do arquivo config.js
        chunkFileNames(chunkInfo) {
          return chunkInfo.name === 'config' 
            ? 'config.js' 
            : 'assets/[name]-[hash].js';
        }
      }
    },
  },
}));
