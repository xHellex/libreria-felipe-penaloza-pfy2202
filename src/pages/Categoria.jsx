import { useParams } from 'react-router'
import EncabezadoPagina from '../components/EncabezadoPagina.jsx'
import EsqueletoTarjetas from '../components/EsqueletoTarjetas.jsx'
import MensajeError from '../components/MensajeError.jsx'
import OtrasCategorias from '../components/OtrasCategorias.jsx'
import TarjetaLibro from '../components/TarjetaLibro.jsx'
import { rutaCategorias, rutaLibrosDe } from '../api/libreria.js'
import { useConsulta } from '../hooks/useConsulta.js'
import { slugATitulo } from '../utils/formato.js'

/**
 * Libros de una categoría (/categorias/:slug) desde GET /api/categorias/:slug/libros.
 *
 * Estados: cargando (esqueleto), error (mensaje + Reintentar + otras categorías, y los
 * datos anteriores si los hay), vacío y lista. "Actualizar" vuelve a pedir aunque haya caché.
 */
function Categoria() {
  const { slug } = useParams()
  const { datos: categorias } = useConsulta(rutaCategorias())
  const { datos: libros, cargando, error, desactualizado, reintentar } = useConsulta(rutaLibrosDe(slug))

  /* El <h1> existe desde el primer render: nombre real si ya está en caché, si no el slug */
  const categoria = categorias?.find((c) => c.slug === slug)
  const nombre = categoria?.nombre ?? slugATitulo(slug)

  return (
    <section className="motion-safe:animate-entrar" aria-busy={cargando}>
      <EncabezadoPagina antetitulo="Categoría" titulo={nombre}>
        {categoria?.descripcion}
      </EncabezadoPagina>

      {error && (
        <MensajeError error={error} onReintentar={error.tipo === 'no-encontrado' ? undefined : reintentar} reintentando={cargando}>
          <OtrasCategorias categorias={categorias} actual={slug} />
        </MensajeError>
      )}

      {desactualizado && (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900 ring-1 ring-amber-200">
          Mostrando la última información disponible. Puede no estar actualizada.
        </p>
      )}

      {cargando && !libros && <EsqueletoTarjetas etiqueta={`Cargando libros de ${nombre}…`} />}

      {libros && libros.length === 0 && !error && (
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-tinta-900">Aún no hay libros en {nombre}</h2>
          <p className="mt-2 mb-4 text-slate-600">Estamos preparando esta sección. Mientras tanto, revisa otras categorías.</p>
          <div className="flex justify-center">
            <OtrasCategorias categorias={categorias} actual={slug} />
          </div>
        </div>
      )}

      {libros && libros.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">{libros.length === 1 ? '1 libro' : `${libros.length} libros`}</p>
            <div className="flex items-center gap-3">
              {/* Indicador de la recarga: los libros anteriores siguen visibles mientras tanto */}
              {cargando && (
                <output className="text-sm text-slate-500">
                  Actualizando…
                </output>
              )}
              <button type="button" onClick={reintentar} disabled={cargando} className="btn btn-secundario px-4 py-1.5 text-sm">
                Actualizar
              </button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {libros.map((libro) => (
              <TarjetaLibro key={libro.id} libro={libro} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default Categoria
