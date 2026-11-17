import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Rutas accesibles: actualiza document.title y, al cambiar de ruta, mueve el foco
 * al <h1> para que los lectores de pantalla anuncien la página nueva.
 *
 * En la primera carga del sitio no se mueve el foco (desorienta a quien navega con
 * teclado): React Router le da la key 'default' a la entrada inicial del historial.
 * Usar la key y no un flag hace que funcione igual con el doble efecto de StrictMode.
 *
 * @returns ref para el <h1> (que debe tener tabIndex={-1}).
 */
export function useTituloPagina(titulo) {
  const refTitulo = useRef(null)
  const { key } = useLocation()

  useEffect(() => {
    document.title = `${titulo} | Librería`
  }, [titulo])

  useEffect(() => {
    if (key !== 'default') refTitulo.current?.focus()
  }, [key])

  return refTitulo
}
