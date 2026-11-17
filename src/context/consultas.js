import { createContext } from 'react'

/**
 * Caché de consultas a la API, compartida por toda la app.
 * Estado: { [url]: { estado: 'cargando' | 'ok' | 'error', datos, error, actualizado } }.
 *
 * Dos contextos (feedback S3): el de estado cambia con cada respuesta; el de acciones
 * se crea una sola vez, así su referencia nunca cambia y no provoca renderizados.
 */
export const ConsultasEstadoContext = createContext(null)
export const ConsultasAccionesContext = createContext(null)

/** Tiempo durante el cual una respuesta se considera reciente: 5 minutos. */
export const TTL = 5 * 60 * 1000

/** Calcula la caché siguiente. Nunca modifica la anterior; las demás URLs conservan su referencia. */
export function consultasReducer(cache, accion) {
  const anterior = cache[accion.url]
  switch (accion.type) {
    case 'inicio':
      return { ...cache, [accion.url]: { datos: anterior?.datos, actualizado: anterior?.actualizado, estado: 'cargando', error: null } }
    case 'exito':
      return { ...cache, [accion.url]: { estado: 'ok', datos: accion.datos, error: null, actualizado: accion.ahora } }
    case 'error':
      // Los datos anteriores se conservan: la interfaz los ofrece como "última información disponible"
      return { ...cache, [accion.url]: { datos: anterior?.datos, actualizado: anterior?.actualizado, estado: 'error', error: accion.error } }
    default:
      throw new Error(`Acción desconocida: ${accion.type}`)
  }
}

/**
 * Regla de recarga al montar una página (la aplica useConsulta):
 * sin entrada → sí; ok reciente → no; ok vencida → sí; cargando → no (se reutiliza);
 * error → sí. Un error solo se vuelve a pedir al montar de nuevo o con un clic,
 * nunca solo: el efecto de useConsulta depende de la URL, no de la entrada.
 */
export function necesitaCarga(entrada, ahora, ttl = TTL) {
  if (!entrada) return true
  if (entrada.estado === 'cargando') return false
  if (entrada.estado === 'error') return true
  return ahora - entrada.actualizado >= ttl
}

/**
 * Fábrica de la acción cargar(url). Es pura respecto de React (recibe sus
 * dependencias), así se prueba con dobles y el Provider la usa con las reales.
 * Siempre pide el recurso: decidir si hace falta (necesitaCarga) es tarea de useConsulta.
 *
 * - enCurso (Map url → promesa) deduplica: si ya hay una petición, se devuelve esa.
 *   Es un Map y no el estado porque en StrictMode el segundo montaje ocurre antes de
 *   que el dispatch del primero se aplique; solo el Map ya sabe que hay una petición.
 * - La promesa sale del Map en finally: si quedara, Reintentar nunca volvería a pedir.
 * - Los errores se despachan, no se lanzan: quien llama no necesita try/catch.
 */
export function crearCargador({ obtener, dispatch, enCurso, ahora = Date.now }) {
  return function cargar(url) {
    if (enCurso.has(url)) return enCurso.get(url)

    dispatch({ type: 'inicio', url })
    const promesa = obtener(url)
      .then(
        (datos) => dispatch({ type: 'exito', url, datos, ahora: ahora() }),
        (error) => dispatch({ type: 'error', url, error }),
      )
      .then(() => undefined)
      .finally(() => enCurso.delete(url))
    enCurso.set(url, promesa)
    return promesa
  }
}
