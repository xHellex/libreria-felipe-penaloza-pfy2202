/** Formateador de moneda chilena: 18990 -> "$18.990". Se crea una sola vez y se reutiliza. */
const formatoCLP = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })

export function formatearPrecio(valor) {
  return formatoCLP.format(valor)
}

/**
 * Título legible a partir de un slug de URL: "ciencia-ficcion" -> "Ciencia ficcion".
 * Se usa mientras no llega el nombre real de la categoría (sin tildes, que el slug no tiene).
 */
export function slugATitulo(slug) {
  const texto = slug.replaceAll('-', ' ')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
