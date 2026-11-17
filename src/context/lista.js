import { createContext, useContext } from 'react'

/**
 * "Mi lista de lectura": libros guardados por el usuario, persistidos en localStorage.
 *
 * Dos contextos (feedback S3): ListaEstadoContext cambia al agregar o quitar;
 * ListaAccionesContext se crea una sola vez. Un botón que solo agrega lee únicamente
 * las acciones y no se vuelve a renderizar por cambios de la lista.
 */
export const ListaEstadoContext = createContext(null)
export const ListaAccionesContext = createContext(null)

export const VERSION_LISTA = 1
export const CLAVE_LISTA = 'libreria:lista'

/** Solo el resumen del libro: lo necesario para mostrarlo en la lista. */
const resumen = ({ id, categoria, titulo, autor, precio, color }) => ({ id, categoria, titulo, autor, precio, color })

/** Calcula la lista siguiente. Nunca modifica la anterior. */
export function listaReducer(lista, accion) {
  switch (accion.type) {
    case 'agregar':
      return lista.some((l) => l.id === accion.libro.id) ? lista : [...lista, resumen(accion.libro)]
    case 'quitar':
      return lista.filter((l) => l.id !== accion.id)
    case 'vaciar':
      return []
    default:
      throw new Error(`Acción desconocida: ${accion.type}`)
  }
}

const esLibroValido = (l) =>
  l !== null &&
  typeof l === 'object' &&
  Number.isInteger(l.id) &&
  ['categoria', 'titulo', 'autor', 'color'].every((campo) => typeof l[campo] === 'string') &&
  Number.isInteger(l.precio) &&
  l.precio >= 0

/**
 * Lee la lista guardada. Solo acepta el formato { version: 1, libros: [...] } con
 * libros válidos y sin ids repetidos; cualquier otra cosa (dañada, otra versión) → lista vacía.
 */
export function cargarLista(texto) {
  try {
    const datos = JSON.parse(texto)
    const libros = datos?.version === VERSION_LISTA ? datos.libros : null
    const valida = Array.isArray(libros) && libros.every(esLibroValido) && new Set(libros.map((l) => l.id)).size === libros.length
    return valida ? libros : []
  } catch {
    return []
  }
}

/** Texto a guardar en localStorage, con la versión del formato. */
export function serializarLista(lista) {
  return JSON.stringify({ version: VERSION_LISTA, libros: lista })
}

/** Libros guardados (se vuelve a renderizar cuando la lista cambia). */
export function useLista() {
  const lista = useContext(ListaEstadoContext)
  if (!lista) throw new Error('useLista debe usarse dentro de <ListaProvider>')
  return lista
}

/** Acciones de la lista: { agregar, quitar, vaciar }. Su referencia nunca cambia. */
export function useAccionesLista() {
  const acciones = useContext(ListaAccionesContext)
  if (!acciones) throw new Error('useAccionesLista debe usarse dentro de <ListaProvider>')
  return acciones
}
