import { Link } from 'react-router'
import { useTituloPagina } from '../hooks/useTituloPagina.js'

/** Página 404: la URL no coincide con ninguna ruta del sitio. */
function NotFound() {
  const refTitulo = useTituloPagina('Página no encontrada')

  return (
    <section className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">
      <p className="font-titulo text-7xl font-bold text-tinta-500" aria-hidden="true">
        404
      </p>
      <h1 ref={refTitulo} tabIndex={-1} className="mt-2 text-2xl font-bold focus:outline-none">
        Página no encontrada
      </h1>
      <p className="mt-2 mb-6 text-slate-600">La dirección que buscas no existe en la librería.</p>
      <Link to="/" className="btn btn-primario rounded-full">
        Ver las categorías
      </Link>
    </section>
  )
}

export default NotFound
