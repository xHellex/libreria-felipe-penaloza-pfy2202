import { describe, expect, it } from 'vitest'
import { formatearPrecio, slugATitulo } from './formato.js'

describe('slugATitulo', () => {
  it.each([
    ['ficcion', 'Ficcion'],
    ['ciencia-ficcion', 'Ciencia ficcion'],
    ['no-existe', 'No existe'],
    ['', ''],
  ])('"%s" → "%s"', (slug, titulo) => {
    expect(slugATitulo(slug)).toBe(titulo)
  })
})

describe('formatearPrecio', () => {
  it('formatea en pesos chilenos sin decimales', () => {
    expect(formatearPrecio(18990)).toMatch(/^\$\s?18\.990$/)
  })
})
