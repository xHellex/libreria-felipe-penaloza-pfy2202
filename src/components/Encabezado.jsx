import { Link, NavLink } from 'react-router'
import { rutasSitio } from '../data/rutas.js'
import { useLista } from '../context/lista.js'

const claseEnlace = ({ isActive }) =>
  `rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
    isActive ? 'bg-tinta-700 text-white shadow-sm' : 'text-slate-600 hover:bg-tinta-50 hover:text-tinta-700'
  }`

/** Barra superior con la marca y el menú principal (NavLink marca la ruta activa). */
function Encabezado() {
  const lista = useLista()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="grid size-10 place-items-center rounded-xl bg-tinta-700 text-white" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.5C10 5.3 7.6 5 5.5 5.3v12.3c2.1-.3 4.5 0 6.5 1.3 2-1.3 4.4-1.6 6.5-1.3V5.3C16.4 5 14 5.3 12 6.5z" />
              <path d="M12 6.5v12.4" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-titulo text-lg font-bold text-slate-900">Librería</span>
            <span className="text-xs text-slate-500">Explora por categoría</span>
          </span>
        </Link>

        <nav aria-label="Menú principal">
          <ul className="flex items-center gap-1">
            {rutasSitio.map(({ ruta, texto, end, contador }) => (
              <li key={ruta}>
                <NavLink to={ruta} end={end} className={claseEnlace}>
                  <span>{texto}</span>
                  {contador && (
                    <span className="ml-1.5 rounded-full bg-ambar-500 px-2 text-xs text-slate-900">
                      {lista.length}
                      <span className="sr-only"> libros</span>
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Encabezado
