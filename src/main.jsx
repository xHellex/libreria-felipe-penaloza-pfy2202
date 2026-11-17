import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Activa el backend simulado (MSW) solo en desarrollo. Se espera a que el
 * Service Worker esté listo antes de renderizar: si no, las primeras peticiones
 * saldrían a la red real y fallarían.
 */
async function enableMocking() {
  if (!import.meta.env.DEV) return
  // Import dinámico: MSW no se incluye en el build de producción
  const { worker } = await import('./mocks/browser.js')
  // bypass: los assets de Vite no son de la API, no hay que advertir por ellos
  return worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
