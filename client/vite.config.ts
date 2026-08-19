import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  envDir: '../',
  base: process.env.VITE_BASE || '/',
  build: {
    sourcemap: false,
  },
})
