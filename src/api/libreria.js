/**
 * Rutas de los recursos REST de la librería. Cada ruta es también la clave
 * con que se guarda su respuesta en la caché de consultas.
 */
export const rutaCategorias = () => '/api/categorias'
export const rutaLibrosDe = (slug) => `/api/categorias/${encodeURIComponent(slug)}/libros`
export const rutaLibro = (id) => `/api/libros/${encodeURIComponent(id)}`
