/**
 * Indicador de carga de una petición: tarjetas grises con la forma del contenido
 * que viene (evita saltos de diseño) y un texto para lectores de pantalla.
 *
 * @param {string} etiqueta - Qué se está cargando, p. ej. "Cargando libros de Ficción…".
 * @param {number} cantidad - Número de tarjetas.
 * @param {string} forma    - 'libro' (portada vertical) o 'categoria' (tarjeta baja).
 */
function EsqueletoTarjetas({ etiqueta, cantidad = 6, forma = 'libro' }) {
  return (
    <div>
      <output className="sr-only">
        {etiqueta}
      </output>
      <ul className={`grid gap-4 ${forma === 'libro' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'}`} aria-hidden="true">
        {Array.from({ length: cantidad }, (_, i) => (
          <li key={i} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className={`rounded-xl bg-slate-200 motion-safe:animate-pulse ${forma === 'libro' ? 'aspect-2/3' : 'h-16'}`} />
            <div className="mt-3 h-4 w-3/4 rounded bg-slate-200 motion-safe:animate-pulse" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 motion-safe:animate-pulse" />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EsqueletoTarjetas
