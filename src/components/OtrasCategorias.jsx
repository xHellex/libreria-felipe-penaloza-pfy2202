import { Link } from 'react-router'

/**
 * Alternativa de navegación cuando una categoría falla o está vacía: enlaces a las demás.
 * Si las categorías no están disponibles, ofrece volver al inicio.
 */
function OtrasCategorias({ categorias, actual }) {
  const otras = (categorias ?? []).filter((c) => c.slug !== actual)

  if (otras.length === 0) {
    return (
      <Link to="/" className="btn btn-secundario">
        Ver todas las categorías
      </Link>
    )
  }

  return (
    <nav aria-label="Otras categorías" className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-600">Prueba con:</span>
      {otras.map((c) => (
        <Link key={c.slug} to={`/categorias/${c.slug}`} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-tinta-700 ring-1 ring-tinta-100 hover:bg-tinta-50">
          {c.nombre}
        </Link>
      ))}
    </nav>
  )
}

export default OtrasCategorias
