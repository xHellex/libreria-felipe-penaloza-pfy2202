import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { handlers, reiniciarEscenarios } from '../mocks/handlers.js'
import { ErrorApi, MENSAJES, obtenerJSON, urlApi } from './cliente.js'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  reiniciarEscenarios()
})
afterAll(() => server.close())

/** Ejecuta la petición y devuelve el ErrorApi que lanza (o falla si no lanza). */
async function errorDe(ruta) {
  try {
    await obtenerJSON(ruta)
  } catch (error) {
    return error
  }
  throw new Error(`Se esperaba un error en ${ruta}`)
}

describe('urlApi', () => {
  it('arma la URL con VITE_API_URL como base', () => {
    expect(urlApi('/api/categorias')).toBe('http://localhost/api/categorias')
  })
})

describe('obtenerJSON', () => {
  it('con 200 devuelve el JSON', async () => {
    const categorias = await obtenerJSON('/api/categorias')
    expect(categorias.length).toBeGreaterThan(0)
  })

  it('con 404 lanza ErrorApi no-encontrado con el mensaje del servidor', async () => {
    const error = await errorDe('/api/categorias/no-existe/libros')
    expect(error).toBeInstanceOf(ErrorApi)
    expect(error.tipo).toBe('no-encontrado')
    expect(error.status).toBe(404)
    expect(error.message).toMatch(/no-existe/)
  })

  it('con 500 lanza ErrorApi servidor', async () => {
    const error = await errorDe('/api/categorias/terror/libros')
    expect(error.tipo).toBe('servidor')
    expect(error.status).toBe(500)
    expect(error.message).toMatch(/no respondió/)
  })

  it('con una caída de red lanza ErrorApi red', async () => {
    const error = await errorDe('/api/categorias/misterio/libros')
    expect(error.tipo).toBe('red')
    expect(error.status).toBeUndefined()
  })

  it('con un 200 que no es JSON (como vite preview) lanza ErrorApi respuesta', async () => {
    server.use(http.get('*/api/html', () => new HttpResponse('<!doctype html><title>x</title>', { headers: { 'Content-Type': 'text/html' } })))
    const error = await errorDe('/api/html')
    expect(error.tipo).toBe('respuesta')
  })

  it('un error sin mensaje del servidor usa la explicación de su tipo', async () => {
    server.use(http.get('*/api/vacio', () => new HttpResponse(null, { status: 503 })))
    const error = await errorDe('/api/vacio')
    expect(error.tipo).toBe('servidor')
    expect(error.message).toBe(MENSAJES.servidor.detalle)
  })
})

describe('MENSAJES', () => {
  it('cada tipo tiene título, detalle y sugerencia', () => {
    for (const tipo of ['no-encontrado', 'servidor', 'red', 'respuesta']) {
      expect(MENSAJES[tipo]).toEqual({ titulo: expect.any(String), detalle: expect.any(String), sugerencia: expect.any(String) })
    }
  })
})
