import { describe, expect, it, vi } from 'vitest'
import { consultasReducer, crearCargador, necesitaCarga, TTL } from './consultas.js'

const URL_A = '/api/categorias'

describe('consultasReducer', () => {
  it('inicio marca la consulta como cargando y conserva los datos anteriores', () => {
    const previo = { [URL_A]: { estado: 'ok', datos: [1], error: null, actualizado: 100 } }
    const e = consultasReducer(previo, { type: 'inicio', url: URL_A })
    expect(e[URL_A]).toEqual({ estado: 'cargando', datos: [1], error: null, actualizado: 100 })
  })

  it('exito guarda los datos y la hora', () => {
    const e = consultasReducer({}, { type: 'exito', url: URL_A, datos: ['x'], ahora: 500 })
    expect(e[URL_A]).toEqual({ estado: 'ok', datos: ['x'], error: null, actualizado: 500 })
  })

  it('error guarda el error y conserva los datos anteriores como respaldo', () => {
    const falla = new Error('caída')
    const previo = { [URL_A]: { estado: 'cargando', datos: ['viejo'], error: null, actualizado: 100 } }
    const e = consultasReducer(previo, { type: 'error', url: URL_A, error: falla })
    expect(e[URL_A]).toEqual({ estado: 'error', datos: ['viejo'], error: falla, actualizado: 100 })
  })

  it('no toca las demás URLs ni modifica el estado anterior', () => {
    const previo = { otra: { estado: 'ok', datos: [9], error: null, actualizado: 1 } }
    const copia = structuredClone(previo)
    const e = consultasReducer(previo, { type: 'inicio', url: URL_A })
    expect(e.otra).toBe(previo.otra)
    expect(previo).toEqual(copia)
  })

  it('lanza un error con una acción desconocida', () => {
    expect(() => consultasReducer({}, { type: 'volar' })).toThrow(/desconocida/)
  })
})

describe('necesitaCarga (regla de recarga)', () => {
  const ahora = 1_000_000
  it.each([
    ['sin entrada', undefined, true],
    ['ok reciente', { estado: 'ok', actualizado: ahora - TTL + 1 }, false],
    ['ok vencida', { estado: 'ok', actualizado: ahora - TTL }, true],
    ['cargando', { estado: 'cargando' }, false],
    ['error (al montar de nuevo)', { estado: 'error' }, true],
  ])('%s → %s', (_, entrada, esperado) => {
    expect(necesitaCarga(entrada, ahora)).toBe(esperado)
  })
})

/** Promesa controlable desde la prueba. */
function diferida() {
  let resolver, rechazar
  const promesa = new Promise((res, rej) => {
    resolver = res
    rechazar = rej
  })
  return { promesa, resolver, rechazar }
}

/** Arma un cargador con dobles: obtener controlable y dispatch espía. */
function armar() {
  const pendientes = []
  const obtener = vi.fn(() => {
    const d = diferida()
    pendientes.push(d)
    return d.promesa
  })
  const dispatch = vi.fn()
  const enCurso = new Map()
  const cargar = crearCargador({ obtener, dispatch, enCurso, ahora: () => 42 })
  return { cargar, obtener, dispatch, enCurso, pendientes }
}

describe('crearCargador', () => {
  it('dos llamadas seguidas hacen una sola petición y comparten la promesa', () => {
    const { cargar, obtener } = armar()
    const p1 = cargar(URL_A)
    const p2 = cargar(URL_A)
    expect(obtener).toHaveBeenCalledTimes(1)
    expect(p2).toBe(p1)
  })

  it('despacha inicio y luego exito con los datos y la hora', async () => {
    const { cargar, dispatch, pendientes } = armar()
    const p = cargar(URL_A)
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'inicio', url: URL_A })
    pendientes[0].resolver(['datos'])
    await p
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'exito', url: URL_A, datos: ['datos'], ahora: 42 })
  })

  it('la petición termina y llega a la caché aunque nadie la espere (StrictMode)', async () => {
    const { cargar, dispatch, enCurso, pendientes } = armar()
    cargar(URL_A) // primer montaje: el componente se desmonta sin esperar
    const compartida = enCurso.get(URL_A)
    cargar(URL_A) // segundo montaje: reutiliza la misma petición
    pendientes[0].resolver(['ok'])
    await compartida
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'exito', datos: ['ok'] }))
  })

  it('después de terminar, otra llamada hace una petición nueva', async () => {
    const { cargar, obtener, enCurso, pendientes } = armar()
    const p = cargar(URL_A)
    pendientes[0].resolver([])
    await p
    expect(enCurso.has(URL_A)).toBe(false)
    cargar(URL_A)
    expect(obtener).toHaveBeenCalledTimes(2)
  })

  it('un error se despacha (no se lanza) y la petición también sale del Map', async () => {
    const { cargar, dispatch, enCurso, obtener, pendientes } = armar()
    const falla = new Error('500')
    const p = cargar(URL_A)
    pendientes[0].rechazar(falla)
    await expect(p).resolves.toBeUndefined()
    expect(dispatch).toHaveBeenLastCalledWith({ type: 'error', url: URL_A, error: falla })
    expect(enCurso.has(URL_A)).toBe(false)
    cargar(URL_A)
    expect(obtener).toHaveBeenCalledTimes(2)
  })
})
