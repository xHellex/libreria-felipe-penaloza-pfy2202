import { describe, expect, it } from 'vitest'
import { cargarLista, listaReducer, serializarLista, VERSION_LISTA } from './lista.js'

const hobbit = { id: 13, categoria: 'fantasia', titulo: 'El hobbit', autor: 'J. R. R. Tolkien', precio: 15990, color: '#166534' }
const dune = { id: 8, categoria: 'ciencia-ficcion', titulo: 'Dune', autor: 'Frank Herbert', precio: 22990, color: '#c2410c' }

describe('listaReducer', () => {
  it('agregar suma el libro al final', () => {
    expect(listaReducer([hobbit], { type: 'agregar', libro: dune })).toEqual([hobbit, dune])
  })

  it('agregar no duplica un libro que ya está (devuelve el mismo estado)', () => {
    const lista = [hobbit]
    expect(listaReducer(lista, { type: 'agregar', libro: { ...hobbit } })).toBe(lista)
  })

  it('agregar guarda solo el resumen (no la sinopsis ni las páginas del detalle)', () => {
    const [guardado] = listaReducer([], { type: 'agregar', libro: { ...dune, sinopsis: 'larga', paginas: 704, anio: 1965 } })
    expect(guardado).toEqual(dune)
  })

  it('quitar saca el libro por id', () => {
    expect(listaReducer([hobbit, dune], { type: 'quitar', id: 13 })).toEqual([dune])
  })

  it('vaciar deja la lista vacía', () => {
    expect(listaReducer([hobbit, dune], { type: 'vaciar' })).toEqual([])
  })

  it('no modifica el estado anterior', () => {
    const lista = [hobbit]
    const copia = structuredClone(lista)
    listaReducer(lista, { type: 'agregar', libro: dune })
    listaReducer(lista, { type: 'quitar', id: 13 })
    expect(lista).toEqual(copia)
  })

  it('lanza un error con una acción desconocida', () => {
    expect(() => listaReducer([], { type: 'volar' })).toThrow(/desconocida/)
  })
})

describe('cargarLista', () => {
  it('serializarLista y cargarLista son inversos', () => {
    expect(cargarLista(serializarLista([hobbit, dune]))).toEqual([hobbit, dune])
  })

  it.each([
    ['null', null],
    ['texto vacío', ''],
    ['JSON dañado', '{"version":1,"libros":['],
    ['otra versión', JSON.stringify({ version: 99, libros: [hobbit] })],
    ['un arreglo sin versión', JSON.stringify([hobbit])],
    ['un libro con forma inválida', JSON.stringify({ version: VERSION_LISTA, libros: [hobbit, { id: 'x', titulo: 3 }] })],
    ['precio negativo', JSON.stringify({ version: VERSION_LISTA, libros: [{ ...hobbit, precio: -1 }] })],
    ['ids repetidos', JSON.stringify({ version: VERSION_LISTA, libros: [hobbit, hobbit] })],
  ])('vuelve a una lista vacía si recibe %s', (_, texto) => {
    expect(cargarLista(texto)).toEqual([])
  })
})
