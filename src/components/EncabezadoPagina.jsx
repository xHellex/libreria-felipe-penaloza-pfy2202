import { useTituloPagina } from '../hooks/useTituloPagina.js'

/**
 * Banner con el título de cada página. Actualiza el título del documento y recibe
 * el foco al navegar (tabIndex -1: enfocable por código, no con Tab).
 */
function EncabezadoPagina({ antetitulo, titulo, children }) {
  const refTitulo = useTituloPagina(titulo)

  return (
    <header className="mb-6 rounded-3xl bg-linear-to-br from-tinta-900 to-tinta-700 p-6 text-white shadow-lg md:p-8">
      {antetitulo && <p className="text-xs font-bold tracking-widest text-tinta-100 uppercase">{antetitulo}</p>}
      <h1 ref={refTitulo} tabIndex={-1} className="mt-2 text-3xl font-bold focus:outline-none md:text-4xl">
        {titulo}
      </h1>
      {children && <p className="mt-2 max-w-2xl text-tinta-50/90">{children}</p>}
    </header>
  )
}

export default EncabezadoPagina
