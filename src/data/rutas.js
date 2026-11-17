/**
 * Rutas del menú principal. Encabezado las recorre con map: se agregan o quitan en un solo lugar.
 * contador: muestra junto al texto la cantidad de libros de "Mi lista".
 */
export const rutasSitio = [
  { ruta: '/', texto: 'Categorías', end: true },
  { ruta: '/mi-lista', texto: 'Mi lista', contador: true },
]
