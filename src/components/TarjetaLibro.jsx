import { Link, useLocation } from 'react-router'
import BotonLista from './BotonLista.jsx'
import Portada from './Portada.jsx'
import { formatearPrecio } from '../utils/formato.js'

/**
 * Tarjeta de un libro en el listado. El enlace al detalle envía por location.state
 * el libro (para mostrarlo al instante mientras llega el detalle) y la página de origen
 * (para el botón "Volver").
 */
function TarjetaLibro({ libro }) {
  const { pathname } = useLocation()

  return (
    <li className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <Portada titulo={libro.titulo} autor={libro.autor} color={libro.color} />
      <h2 className="mt-3 text-base leading-snug font-bold">
        <Link to={`/libros/${libro.id}`} state={{ libro, volver: pathname }} className="text-tinta-900 hover:underline">
          {libro.titulo}
        </Link>
      </h2>
      <p className="text-sm text-slate-600">{libro.autor}</p>
      <p className="mt-auto pt-2 font-semibold text-tinta-700">{formatearPrecio(libro.precio)}</p>
      <BotonLista libro={libro} className="mt-3 w-full px-3" />
    </li>
  )
}

export default TarjetaLibro
