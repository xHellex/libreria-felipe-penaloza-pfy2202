import { Link } from 'react-router'
import { useAccionesLista, useLista } from '../context/lista.js'

/**
 * Agrega el libro a "Mi lista". Si ya está, ofrece ir a la lista en vez de quitarlo:
 * quitar es una acción destructiva y se confirma en la página Mi lista.
 */
function BotonLista({ libro, className = '' }) {
  const lista = useLista()
  const { agregar } = useAccionesLista()

  if (lista.some((l) => l.id === libro.id)) {
    return (
      <Link to="/mi-lista" className={`btn btn-secundario text-sm ${className}`}>
        ✓ En mi lista
      </Link>
    )
  }

  return (
    <button type="button" onClick={() => agregar(libro)} className={`btn btn-acento text-sm ${className}`}>
      + Agregar a mi lista
    </button>
  )
}

export default BotonLista
