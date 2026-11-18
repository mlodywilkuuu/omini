import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
// GitHub Pages hosts this repository below /omini; Vercel serves from domain root.
const base = process.env.GITHUB_ACTIONS === 'true' ? '/omini/' : '/';

export default defineConfig({
  base,
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        silnik: resolve(root, 'silnik/index.html'),
        game: resolve(root, 'gry2/index.html')
      }
    }
  }
});
