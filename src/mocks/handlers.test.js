import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers, reiniciarEscenarios } from './handlers.js'

const server = setupServer(...handlers)
const api = (ruta) => fetch(`${import.meta.env.VITE_API_URL}${ruta}`)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  reiniciarEscenarios()
})
afterAll(() => server.close())

describe('GET /api/categorias', () => {
  it('responde 200 con las categorías y su total de libros', async () => {
    const respuesta = await api('/api/categorias')
    expect(respuesta.status).toBe(200)
    const categorias = await respuesta.json()
    expect(categorias.map((c) => c.slug)).toContain('ficcion')
    expect(categorias.map((c) => c.slug)).toContain('ciencia-ficcion')
    for (const c of categorias) {
      expect(c).toEqual(
        expect.objectContaining({ slug: expect.any(String), nombre: expect.any(String), descripcion: expect.any(String), total: expect.any(Number) }),
      )
    }
    expect(categorias.find((c) => c.slug === 'poesia').total).toBe(0)
  })
})

describe('GET /api/categorias/:slug/libros', () => {
  it('responde 200 con los libros de la categoría, sin la sinopsis', async () => {
    const respuesta = await api('/api/categorias/ficcion/libros')
    expect(respuesta.status).toBe(200)
    const libros = await respuesta.json()
    expect(libros.length).toBeGreaterThan(0)
    expect(libros.every((l) => l.categoria === 'ficcion')).toBe(true)
    expect(libros[0]).toEqual(expect.objectContaining({ id: expect.any(Number), titulo: expect.any(String), autor: expect.any(String), precio: expect.any(Number) }))
    expect(libros[0].sinopsis).toBeUndefined()
  })

  it('responde 404 con un mensaje si la categoría no existe', async () => {
    const respuesta = await api('/api/categorias/no-existe/libros')
    expect(respuesta.status).toBe(404)
    expect((await respuesta.json()).mensaje).toMatch(/no-existe/)
  })

  it('poesia responde 200 con un arreglo vacío', async () => {
    const respuesta = await api('/api/categorias/poesia/libros')
    expect(respuesta.status).toBe(200)
    expect(await respuesta.json()).toEqual([])
  })

  it('terror alterna: 500, luego 200, luego 500', async () => {
    const estados = []
    for (let i = 0; i < 3; i++) estados.push((await api('/api/categorias/terror/libros')).status)
    expect(estados).toEqual([500, 200, 500])
  })

  it('reiniciarEscenarios hace que terror vuelva a fallar primero', async () => {
    await api('/api/categorias/terror/libros')
    reiniciarEscenarios()
    expect((await api('/api/categorias/terror/libros')).status).toBe(500)
  })

  it('misterio simula una caída de red: fetch lanza TypeError', async () => {
    await expect(api('/api/categorias/misterio/libros')).rejects.toThrow(TypeError)
  })
})

describe('GET /api/libros/:id', () => {
  it('responde 200 con el libro completo', async () => {
    const respuesta = await api('/api/libros/1')
    expect(respuesta.status).toBe(200)
    const libro = await respuesta.json()
    expect(libro).toEqual(expect.objectContaining({ id: 1, sinopsis: expect.any(String), paginas: expect.any(Number) }))
  })

  it.each(['999', 'abc'])('responde 404 si el libro %s no existe', async (id) => {
    const respuesta = await api(`/api/libros/${id}`)
    expect(respuesta.status).toBe(404)
    expect((await respuesta.json()).mensaje).toBeDefined()
  })
})
