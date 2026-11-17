import { Link, useLocation, useParams } from 'react-router'
import BotonLista from '../components/BotonLista.jsx'
import MensajeError from '../components/MensajeError.jsx'
import Portada from '../components/Portada.jsx'
import { rutaLibro } from '../api/libreria.js'
import { useConsulta } from '../hooks/useConsulta.js'
import { useTituloPagina } from '../hooks/useTituloPagina.js'
import { formatearPrecio } from '../utils/formato.js'

/**
 * Detalle de un libro (/libros/:id) desde GET /api/libros/:id.
 *
 * Detalle instantáneo: si se llega desde un listado, location.state.libro trae el
 * resumen (título, autor, precio) y se muestra de inmediato; solo la sinopsis y las
 * páginas esperan la respuesta. Sin state (recarga o enlace directo), carga normal.
 */
function DetalleLibro() {
  const { id } = useParams()
  const { state } = useLocation()
  const { datos: detalle, cargando, error, reintentar } = useConsulta(rutaLibro(id))

  /* El resumen solo sirve si corresponde al libro de la URL */
  const preliminar = state?.libro?.id === Number(id) ? state.libro : null
  const libro = detalle ?? preliminar
  const volver = state?.volver ?? (libro ? `/categorias/${libro.categoria}` : '/')

  const refTitulo = useTituloPagina(libro?.titulo ?? 'Detalle del libro')

  const enlaceVolver = (
    <Link to={volver} className="btn btn-secundario">
      ← Volver al listado
    </Link>
  )

  return (
    <section className="motion-safe:animate-entrar" aria-busy={cargando}>
      <div className="mb-4">{enlaceVolver}</div>

      {error && (
        <MensajeError error={error} onReintentar={error.tipo === 'no-encontrado' ? undefined : reintentar} reintentando={cargando} />
      )}

      {!libro && cargando && (
        <output className="block py-16 text-center text-slate-500">
          Cargando libro…
        </output>
      )}

      {!libro && (
        // Mientras carga sin resumen, o tras un 404: el <h1> igual existe para el foco y el título
        <h1 ref={refTitulo} tabIndex={-1} className="sr-only">
          Detalle del libro
        </h1>
      )}

      {libro && (
        <article className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[14rem_1fr] md:p-8">
          <Portada titulo={libro.titulo} autor={libro.autor} color={libro.color} className="mx-auto w-48 md:w-full" />

          <div>
            <p className="text-xs font-bold tracking-widest text-tinta-500 uppercase">{libro.autor}</p>
            <h1 ref={refTitulo} tabIndex={-1} className="mt-1 text-3xl font-bold text-tinta-900 focus:outline-none md:text-4xl">
              {libro.titulo}
            </h1>
            <p className="mt-3 text-2xl font-semibold text-tinta-700">{formatearPrecio(libro.precio)}</p>
            <BotonLista libro={libro} className="mt-4" />

            {detalle ? (
              <>
                <p className="mt-6 leading-relaxed text-slate-700">{detalle.sinopsis}</p>
                <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    ['Año', detalle.anio],
                    ['Páginas', detalle.paginas],
                    ['Código', detalle.id],
                  ].map(([etiqueta, valor]) => (
                    <div key={etiqueta} className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-xs font-semibold text-slate-500 uppercase">{etiqueta}</dt>
                      <dd className="mt-1 font-semibold">{valor}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              cargando && (
                // Solo esta sección espera: título, autor y precio ya están a la vista
                <div className="mt-6">
                  <output className="sr-only">
                    Cargando sinopsis y datos del libro…
                  </output>
                  <div aria-hidden="true" className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-200 motion-safe:animate-pulse" />
                    <div className="h-4 w-5/6 rounded bg-slate-200 motion-safe:animate-pulse" />
                    <div className="h-4 w-2/3 rounded bg-slate-200 motion-safe:animate-pulse" />
                  </div>
                </div>
              )
            )}
          </div>
        </article>
      )}
    </section>
  )
}

export default DetalleLibro
