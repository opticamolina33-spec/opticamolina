import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // <--- ESTO ES CLAVE para que reconozca tus componentes .jsx
    tailwindcss(),
  ],
  server: {
    // Esto ayuda a que el front sepa dónde buscar si tenés problemas de rutas
    fs: {
      allow: ['..']
    }
  }
})