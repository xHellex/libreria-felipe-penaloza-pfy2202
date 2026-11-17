import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Encabezado from './Encabezado.jsx'

/**
 * Estructura común de todas las páginas. El <Suspense> envuelve solo el <Outlet>:
 * mientras se descarga una página (React.lazy) el encabezado y el menú siguen visibles.
 */
function Layout() {
  return (
    <>
      <Encabezado />
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-16">
        <Suspense
          fallback={
            <output className="block py-16 text-center text-slate-500">
              Cargando página…
            </output>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Datos servidos por una API REST mock (MSW) · Desarrollo Frontend II
      </footer>
    </>
  )
}

export default Layout
