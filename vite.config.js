import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: false,
    watch: {
      usePolling: true,
      interval: 100
    },
    hmr: {
      overlay: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'inkjs': ['inkjs']
        }
      }
    }
  },
  assetsInclude: ['**/*.ink'],
  envPrefix: 'VITE_',
  optimizeDeps: {
    exclude: ['src/story/compiled-story.js'],
    force: true
  },
  esbuild: {
    minify: false
  }
});