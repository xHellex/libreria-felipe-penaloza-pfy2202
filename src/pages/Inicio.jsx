import EncabezadoPagina from '../components/EncabezadoPagina.jsx'
import EsqueletoTarjetas from '../components/EsqueletoTarjetas.jsx'
import MensajeError from '../components/MensajeError.jsx'
import TarjetaCategoria from '../components/TarjetaCategoria.jsx'
import { rutaCategorias } from '../api/libreria.js'
import { useConsulta } from '../hooks/useConsulta.js'

/** Página de inicio: categorías de libros obtenidas desde la API REST (GET /api/categorias). */
function Inicio() {
  const { datos: categorias, cargando, error, reintentar } = useConsulta(rutaCategorias())

  return (
    <section className="motion-safe:animate-entrar" aria-busy={cargando}>
      <EncabezadoPagina antetitulo="Librería" titulo="Explora nuestras categorías">
        Elige una categoría para ver sus libros. El catálogo se obtiene desde una API REST.
      </EncabezadoPagina>

      {error && <MensajeError error={error} onReintentar={reintentar} reintentando={cargando} />}

      {cargando && !categorias && <EsqueletoTarjetas etiqueta="Cargando categorías…" forma="categoria" />}

      {categorias && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((c) => (
            <TarjetaCategoria key={c.slug} categoria={c} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default Inicio
