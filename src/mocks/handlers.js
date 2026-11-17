import { delay, http, HttpResponse } from 'msw'
import { categorias, libros } from './datos.js'

/**
 * Endpoints REST simulados con MSW. El patrón "*" acepta cualquier origen, así
 * coinciden igual en el navegador (http://localhost:5173) que en las pruebas (http://localhost).
 *
 * Escenarios para demostrar el manejo de errores:
 * - categoría inexistente → 404 con mensaje;
 * - poesia → 200 con [] (estado vacío);
 * - terror → alterna 500 y 200 (la 1.ª, 3.ª, … petición falla): sirve para Reintentar y Actualizar;
 * - misterio → caída de red (HttpResponse.error()).
 */

/* Demora para que el indicador de carga se vea; en las pruebas no se espera */
const DEMORA = import.meta.env.MODE === 'test' ? 0 : 700

let peticionesTerror = 0

/** Reinicia los escenarios con contador (las pruebas lo llaman en afterEach). */
export function reiniciarEscenarios() {
  peticionesTerror = 0
}

/* El listado de una categoría no incluye sinopsis ni páginas: eso lo trae el detalle */
const resumen = ({ id, categoria, titulo, autor, anio, precio, color }) => ({ id, categoria, titulo, autor, anio, precio, color })

export const handlers = [
  http.get('*/api/categorias', async () => {
    await delay(DEMORA)
    return HttpResponse.json(categorias.map((c) => ({ ...c, total: libros.filter((l) => l.categoria === c.slug).length })))
  }),

  http.get('*/api/categorias/:slug/libros', async ({ params }) => {
    await delay(DEMORA)
    const { slug } = params

    if (!categorias.some((c) => c.slug === slug)) {
      return HttpResponse.json({ mensaje: `No existe la categoría «${slug}».` }, { status: 404 })
    }
    if (slug === 'misterio') {
      return HttpResponse.error()
    }
    if (slug === 'terror' && ++peticionesTerror % 2 === 1) {
      return HttpResponse.json({ mensaje: 'El servicio de catálogo no respondió. Intenta nuevamente.' }, { status: 500 })
    }
    return HttpResponse.json(libros.filter((l) => l.categoria === slug).map(resumen))
  }),

  http.get('*/api/libros/:id', async ({ params }) => {
    await delay(DEMORA)
    const libro = libros.find((l) => l.id === Number(params.id))
    if (!libro) {
      return HttpResponse.json({ mensaje: `No existe un libro con el código «${params.id}».` }, { status: 404 })
    }
    return HttpResponse.json(libro)
  }),
]
