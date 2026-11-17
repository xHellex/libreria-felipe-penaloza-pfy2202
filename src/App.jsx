import { BrowserRouter } from 'react-router'
import ConsultasProvider from './context/ConsultasProvider.jsx'
import ListaProvider from './context/ListaProvider.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

/**
 * Componente raíz. Los providers quedan por encima del router: la caché de
 * respuestas y la lista de lectura sobreviven a los cambios de página.
 */
function App() {
  return (
    <ConsultasProvider>
      <ListaProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ListaProvider>
    </ConsultasProvider>
  )
}

export default App
