import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Rutas relativas: funciona en GitHub Pages sea cual sea el nombre del repo
  base: './',
})
