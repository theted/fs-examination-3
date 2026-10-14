import { defineConfig } from 'vite'

export default defineConfig({
  // index.html lives in src/; static assets (images, favicon) in src/public/
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  // Node >= 17 may resolve "localhost" to ::1 only, which some browsers
  // won't connect to. `npm run dev -- --host` exposes it on the LAN instead.
  server: {
    host: '127.0.0.1',
    port: 4000
  },
  preview: {
    host: '127.0.0.1',
    port: 4000
  }
})
