/**
 * Cliente HTTP de la app. Los componentes nunca llaman a fetch directamente:
 * pasan por obtenerJSON(), que traduce cada falla a un ErrorApi con un tipo concreto.
 *
 * Ojo: fetch NO lanza error con un 404 o un 500, solo cuando falla la red.
 * Por eso se revisa response.ok a mano.
 */

/**
 * Textos para el usuario según el tipo de error: qué pasó y qué puede hacer.
 * detalle se usa cuando el servidor no envía su propio mensaje.
 */
export const MENSAJES = {
  'no-encontrado': {
    titulo: 'No encontramos lo que buscas',
    detalle: 'El recurso solicitado no existe o fue eliminado.',
    sugerencia: 'Revisa el enlace o elige otra categoría.',
  },
  servidor: {
    titulo: 'El servidor tuvo un problema',
    detalle: 'El servicio de catálogo respondió con un error interno.',
    sugerencia: 'Suele ser momentáneo: reintenta en unos segundos.',
  },
  red: {
    titulo: 'No hay conexión con el servidor',
    detalle: 'La petición no llegó al servicio de catálogo.',
    sugerencia: 'Revisa tu conexión a internet y vuelve a intentarlo.',
  },
  respuesta: {
    titulo: 'La respuesta del servidor no es válida',
    detalle: 'Se recibió información con un formato inesperado; la API podría no estar disponible.',
    sugerencia: 'Vuelve a intentarlo más tarde.',
  },
}

/** Error de una petición a la API. tipo: 'no-encontrado' | 'servidor' | 'red' | 'respuesta'. */
export class ErrorApi extends Error {
  constructor(tipo, { status, mensaje, causa } = {}) {
    super(mensaje ?? MENSAJES[tipo].detalle, { cause: causa })
    this.name = 'ErrorApi'
    this.tipo = tipo
    this.status = status
  }
}

/**
 * URL absoluta de un recurso. VITE_API_URL apunta a un backend real cuando exista;
 * sin ella se usa el mismo origen de la página, donde responde MSW.
 */
export function urlApi(ruta) {
  return new URL(ruta, import.meta.env.VITE_API_URL ?? window.location.origin).toString()
}

function tipoSegunStatus(status) {
  if (status === 404) return 'no-encontrado'
  if (status >= 500) return 'servidor'
  return 'respuesta'
}

/** GET de un recurso JSON. Lanza ErrorApi si la red falla, el status no es 2xx o el cuerpo no es JSON. */
export async function obtenerJSON(ruta) {
  let respuesta
  try {
    /*
     * Sin "Accept: application/json" a propósito: si la API no existe (vite preview sin MSW),
     * el servidor responde su index.html y se informa "respuesta no válida", que describe el
     * problema real. Con ese Accept, Vite responde un 404 vacío y el usuario leería
     * "no encontramos lo que buscas", como si solo faltara ese recurso.
     */
    respuesta = await fetch(urlApi(ruta))
  } catch (error) {
    throw new ErrorApi('red', { causa: error })
  }

  if (!respuesta.ok) {
    // El cuerpo del error es opcional: si no trae { mensaje }, se usa el texto del tipo
    const cuerpo = await respuesta.json().catch(() => null)
    throw new ErrorApi(tipoSegunStatus(respuesta.status), { status: respuesta.status, mensaje: cuerpo?.mensaje })
  }

  try {
    return await respuesta.json()
  } catch (error) {
    throw new ErrorApi('respuesta', { status: respuesta.status, causa: error })
  }
}
