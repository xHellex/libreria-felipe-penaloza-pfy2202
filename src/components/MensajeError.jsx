import { MENSAJES } from '../api/cliente.js'

/**
 * Error de una petición: qué pasó (específico según el tipo y el mensaje del servidor),
 * qué puede hacer el usuario y las alternativas (Reintentar + lo que llegue en children).
 *
 * @param {ErrorApi} error       - Error lanzado por obtenerJSON.
 * @param {Function} onReintentar - Vuelve a pedir el recurso.
 * @param {boolean}  reintentando - Hay una nueva petición en curso.
 * @param {node}     children    - Alternativas adicionales (enlaces a otras categorías, etc.).
 */
function MensajeError({ error, onReintentar, reintentando = false, children }) {
  const textos = MENSAJES[error.tipo] ?? MENSAJES.respuesta

  return (
    <section role="alert" className="mb-6 rounded-2xl border-l-4 border-red-600 bg-red-50 p-5 shadow-sm">
      <h2 className="text-lg font-bold text-red-900">{textos.titulo}</h2>
      <p className="mt-1 text-red-900">{error.message}</p>
      <p className="mt-1 text-sm text-slate-700">{textos.sugerencia}</p>
      {error.status && <p className="mt-1 text-xs text-slate-500">Código de respuesta: {error.status}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {onReintentar && (
          <button type="button" onClick={onReintentar} disabled={reintentando} className="btn btn-primario">
            {reintentando ? 'Reintentando…' : 'Reintentar'}
          </button>
        )}
        {children}
      </div>
    </section>
  )
}

export default MensajeError
