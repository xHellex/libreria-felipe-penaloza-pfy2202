import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import DialogoConfirmacion from '../components/DialogoConfirmacion.jsx'
import EncabezadoPagina from '../components/EncabezadoPagina.jsx'
import Portada from '../components/Portada.jsx'
import { useAccionesLista, useLista } from '../context/lista.js'
import { formatearPrecio } from '../utils/formato.js'

/**
 * Mi lista de lectura. Quitar un libro o vaciar la lista se confirma con
 * DialogoConfirmacion (no con window.confirm).
 */
function MiLista() {
  const lista = useLista()
  const { quitar, vaciar } = useAccionesLista()

  /* Qué se está confirmando: { tipo: 'quitar', libro } | { tipo: 'vaciar' } | null */
  const [confirmando, setConfirmando] = useState(null)

  /*
   * Tras quitar o vaciar, el botón que abrió el diálogo ya no existe y el navegador no
   * tiene dónde devolver el foco: se lleva al título de la lista. Se hace en un efecto
   * porque, mientras el modal está abierto, el resto de la página es inerte; el efecto
   * del diálogo (hijo) lo cierra antes de que corra este (padre).
   */
  const refTituloLista = useRef(null)
  const refEnfocarLista = useRef(false)
  useEffect(() => {
    if (!confirmando && refEnfocarLista.current) {
      refEnfocarLista.current = false
      refTituloLista.current?.focus()
    }
  }, [confirmando])

  const confirmar = () => {
    if (confirmando.tipo === 'quitar') quitar(confirmando.libro.id)
    else vaciar()
    refEnfocarLista.current = true
    setConfirmando(null)
  }

  const total = lista.reduce((suma, l) => suma + l.precio, 0)

  return (
    <section className="motion-safe:animate-entrar">
      <EncabezadoPagina antetitulo="Tu selección" titulo="Mi lista de lectura">
        Libros que guardaste para leer más adelante. Se conservan en este navegador.
      </EncabezadoPagina>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 ref={refTituloLista} tabIndex={-1} className="text-xl font-bold text-tinta-900 focus:outline-none">
          {lista.length === 1 ? '1 libro guardado' : `${lista.length} libros guardados`}
        </h2>
        {lista.length > 0 && (
          <button type="button" onClick={() => setConfirmando({ tipo: 'vaciar' })} className="btn btn-secundario text-sm text-red-700">
            Vaciar lista
          </button>
        )}
      </div>

      {lista.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="mb-4 text-slate-600">Aún no guardas libros. Explora las categorías y usa «Agregar a mi lista».</p>
          <Link to="/" className="btn btn-primario">
            Ver las categorías
          </Link>
        </div>
      ) : (
        <>
          <ul className="grid gap-3">
            {lista.map((libro) => (
              <li key={libro.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <Portada titulo={libro.titulo} autor={libro.autor} color={libro.color} compacta className="w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <Link to={`/libros/${libro.id}`} state={{ libro, volver: '/mi-lista' }} className="font-semibold text-tinta-900 hover:underline">
                    {libro.titulo}
                  </Link>
                  <p className="text-sm text-slate-600">{libro.autor}</p>
                  <p className="text-sm font-semibold text-tinta-700">{formatearPrecio(libro.precio)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmando({ tipo: 'quitar', libro })}
                  className="btn btn-secundario px-3 py-1.5 text-sm"
                  aria-label={`Quitar ${libro.titulo} de mi lista`}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right text-slate-700">
            Valor total: <strong className="text-tinta-900">{formatearPrecio(total)}</strong>
          </p>
        </>
      )}

      <DialogoConfirmacion
        abierto={confirmando !== null}
        titulo={confirmando?.tipo === 'quitar' ? '¿Quitar este libro?' : '¿Vaciar la lista?'}
        mensaje={
          confirmando?.tipo === 'quitar'
            ? `«${confirmando.libro.titulo}» saldrá de tu lista de lectura.`
            : `Se quitarán los ${lista.length} libros de tu lista. Esta acción no se puede deshacer.`
        }
        textoConfirmar={confirmando?.tipo === 'quitar' ? 'Quitar libro' : 'Vaciar lista'}
        onConfirmar={confirmar}
        onCancelar={() => setConfirmando(null)}
      />
    </section>
  )
}

export default MiLista
