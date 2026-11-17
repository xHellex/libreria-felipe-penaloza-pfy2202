import { useCallback, useContext, useEffect, useEffectEvent } from 'react'
import { ConsultasAccionesContext, ConsultasEstadoContext, necesitaCarga } from '../context/consultas.js'

/**
 * Datos de un recurso de la API, desde la caché compartida.
 *
 * El efecto depende solo de la URL: corre al montar la página o al cambiar de recurso.
 * La decisión de pedir (necesitaCarga) lee la entrada actual con useEffectEvent, que
 * ve el último valor sin ser dependencia. Por eso un error, que cambia la entrada
 * pero no la URL, nunca dispara una petición por sí solo; reintentar() la pide directo.
 *
 * @returns {{ datos, cargando: boolean, error, desactualizado: boolean, reintentar: Function }}
 *   desactualizado: hubo error pero quedan datos de una carga anterior para mostrar.
 */
export function useConsulta(url) {
  const cache = useContext(ConsultasEstadoContext)
  const acciones = useContext(ConsultasAccionesContext)
  if (!cache || !acciones) {
    throw new Error('useConsulta debe usarse dentro de <ConsultasProvider>')
  }
  const { cargar } = acciones
  const entrada = cache[url]

  const cargarSiHaceFalta = useEffectEvent(() => {
    if (necesitaCarga(entrada, Date.now())) cargar(url)
  })

  useEffect(() => {
    cargarSiHaceFalta()
  }, [url])

  const reintentar = useCallback(() => cargar(url), [url, cargar])

  const enError = entrada?.estado === 'error'
  return {
    datos: entrada?.datos,
    // Sin entrada aún (antes del primer efecto) también es "cargando"
    cargando: !entrada || entrada.estado === 'cargando',
    error: enError ? entrada.error : null,
    desactualizado: enError && entrada.datos !== undefined,
    reintentar,
  }
}
