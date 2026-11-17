import { useEffect, useReducer, useState } from 'react'
import { CLAVE_LISTA, ListaAccionesContext, ListaEstadoContext, cargarLista, listaReducer, serializarLista } from './lista.js'

/** Lee la lista guardada; sin almacenamiento disponible (modo privado) parte vacía. */
function leerAlmacenamiento() {
  try {
    return cargarLista(localStorage.getItem(CLAVE_LISTA))
  } catch {
    return []
  }
}

/** Provee "Mi lista de lectura" con contextos de estado y de acciones separados. */
function ListaProvider({ children }) {
  const [lista, dispatch] = useReducer(listaReducer, undefined, leerAlmacenamiento)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_LISTA, serializarLista(lista))
    } catch {
      // Sin almacenamiento: la lista sigue funcionando en memoria durante la visita
    }
  }, [lista])

  /* Se crean una sola vez: solo usan dispatch (estable) y nunca leen la lista */
  const [acciones] = useState(() => ({
    agregar: (libro) => dispatch({ type: 'agregar', libro }),
    quitar: (id) => dispatch({ type: 'quitar', id }),
    vaciar: () => dispatch({ type: 'vaciar' }),
  }))

  return (
    <ListaAccionesContext.Provider value={acciones}>
      <ListaEstadoContext.Provider value={lista}>{children}</ListaEstadoContext.Provider>
    </ListaAccionesContext.Provider>
  )
}

export default ListaProvider
