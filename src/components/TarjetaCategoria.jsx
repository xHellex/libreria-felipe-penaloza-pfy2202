import { Link } from 'react-router'

/** Tarjeta de una categoría del catálogo, con enlace a sus libros. */
function TarjetaCategoria({ categoria }) {
  const { slug, nombre, descripcion, total } = categoria

  return (
    <li>
      <Link
        to={`/categorias/${slug}`}
        className="flex h-full flex-col rounded-2xl bg-white p-5 no-underline shadow-sm ring-1 ring-slate-200 transition hover:ring-tinta-500 motion-safe:hover:-translate-y-0.5"
      >
        <span className="font-titulo text-xl font-bold text-tinta-900">{nombre}</span>
        <span className="mt-1 flex-1 text-sm text-slate-600">{descripcion}</span>
        <span className="mt-3 text-xs font-semibold text-tinta-700">{total === 1 ? '1 libro' : `${total} libros`}</span>
      </Link>
    </li>
  )
}

export default TarjetaCategoria
