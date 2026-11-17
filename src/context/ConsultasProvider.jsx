import { useReducer, useState } from 'react'
import { obtenerJSON } from '../api/cliente.js'
import { ConsultasAccionesContext, ConsultasEstadoContext, consultasReducer, crearCargador } from './consultas.js'

/**
 * Provee la caché de consultas. Está por encima de las rutas y nunca se desmonta:
 * una respuesta que llega tarde se guarda aquí y jamás intenta actualizar una
 * página que ya se cerró (la limpieza asíncrona queda resuelta por diseño).
 */
function ConsultasProvider({ children }) {
  const [cache, dispatch] = useReducer(consultasReducer, {})

  /*
   * Acciones creadas una sola vez (inicializador de useState): solo dependen de
   * dispatch, que React garantiza estable, así su referencia nunca cambia y los
   * componentes que solo usan acciones no se vuelven a renderizar con la caché.
   */
  const [acciones] = useState(() => ({
    cargar: crearCargador({ obtener: obtenerJSON, dispatch, enCurso: new Map() }),
  }))

  return (
    <ConsultasAccionesContext.Provider value={acciones}>
      <ConsultasEstadoContext.Provider value={cache}>{children}</ConsultasEstadoContext.Provider>
    </ConsultasAccionesContext.Provider>
  )
}

export default ConsultasProvider
