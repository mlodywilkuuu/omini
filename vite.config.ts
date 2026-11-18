import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// GitHub Pages hosts this repository below /omini; Vercel serves from domain root.
const base = process.env.GITHUB_ACTIONS === 'true' ? '/omini/' : '/';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        silnik: resolve(__dirname, 'silnik/index.html')
      }
    }
  }
});
