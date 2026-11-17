import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // El fetch de Node no acepta rutas relativas: en las pruebas la API vive en http://localhost
    env: { VITE_API_URL: 'http://localhost' },
  },
})
