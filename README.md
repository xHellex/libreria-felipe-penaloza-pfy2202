# Librería: catálogo por categorías con API REST mock

> **Actividad formativa semana 4: Utilizando tecnologías de integración entre frontend y backend**
> **Asignatura:** Desarrollo Frontend II (`PFY2202`)
> **Estudiante:** Felipe Peñaloza
> **Repositorio:** `libreria-felipe-penaloza-pfy2202`

> **Sobre el nombre del repositorio:** las instrucciones de la forma B piden una *tienda de libros*, pero indican el nombre `hospital-nombre-apellido-siglaCurso`. Parece un texto copiado de otra forma de la actividad, así que el repositorio sigue el formato pedido con un nombre que corresponde a lo que se desarrolló: `libreria-felipe-penaloza-pfy2202`.

---

## Descripción

Es una tienda de libros en React donde se exploran categorías (Ficción, Ciencia ficción, Fantasía, etc.), los libros de cada una y su detalle. Todos los datos llegan desde una **API REST simulada con MSW** (Mock Service Worker): la aplicación hace `fetch` normales a `/api/...` y un Service Worker intercepta esas peticiones en el navegador y responde con datos de prueba, con demoras y errores realistas.

Stack: **React 19**, **React Router 7**, **Tailwind CSS 4**, **MSW 2**, **Vite** y **Vitest** (54 pruebas).

## Cumplimiento de la pauta

| Criterio | Dónde se cumple |
| :--- | :--- |
| **Creación e integración de un mock REST** | `src/mocks/`: `handlers.js` define 3 endpoints REST (`http.get` + `HttpResponse` + `delay`), `browser.js` crea el worker y `main.jsx` lo activa con `enableMocking()` antes de renderizar, solo en desarrollo. La interfaz consume la API en Inicio, Categoría y Detalle. Los handlers tienen 10 pruebas con `msw/node`. |
| **Manejo de errores con mensajes claros y alternativas** | `api/cliente.js` revisa `response.ok` (`fetch` no lanza error con 404 ni 500) y clasifica cada falla como **no encontrado**, **servidor**, **red** o **respuesta inválida**. `MensajeError` muestra el título, el mensaje específico (el del servidor, si existe), una sugerencia y el código. **Alternativas:** el botón **Reintentar**, enlaces a **otras categorías** y, si hubo datos antes, la **última información disponible**. |
| **Control de carga por petición** | Cada petición tiene su indicador: un esqueleto de tarjetas con `<output>` (anunciado por lectores de pantalla) y `aria-busy` en su sección. El menú sigue usable mientras carga (`Suspense` solo envuelve el `<Outlet>`). Al **Actualizar**, los datos anteriores se mantienen visibles con un aviso "Actualizando…". En el detalle, título y precio se ven al instante y solo la sinopsis espera. |
| **Optimización de las consultas** | Una **caché compartida** con TTL de 5 minutos: volver a una categoría ya visitada **no hace una petición nueva**. Las peticiones simultáneas a la misma URL se **deduplican**, lo que incluye el doble montaje de `StrictMode`. El listado no trae la sinopsis (solo el detalle), y las páginas se cargan bajo demanda con `React.lazy`. |
| **React Router** | `routes/AppRoutes.jsx`: rutas anidadas en `Layout` con `<Outlet>`, `NavLink` activos, `useParams` (`/categorias/:slug`, `/libros/:id`), `useLocation` (estado entre páginas) y una ruta comodín 404. Al navegar se actualizan el título del documento y el foco. |

## API REST mock

| Método y ruta | Respuesta |
| :--- | :--- |
| `GET /api/categorias` | `200` con `[{ slug, nombre, descripcion, total }]` |
| `GET /api/categorias/:slug/libros` | `200` con `[{ id, titulo, autor, anio, precio, color, categoria }]` |
| `GET /api/libros/:id` | `200` con el libro completo (incluye `sinopsis` y `paginas`), o `404` |

Los handlers usan el patrón `*/api/...`, que acepta cualquier origen. Por eso los mismos handlers sirven en el navegador y en las pruebas con Node.

### Cómo probar cada escenario

| Escenario | Cómo provocarlo | Qué se ve |
| :--- | :--- | :--- |
| Éxito y caché | Entrar a **Ficción**, volver al inicio y entrar de nuevo | La segunda vez los libros aparecen al instante, sin petición en la pestaña Network |
| **404** | Abrir `/categorias/no-existe` o `/libros/999` | "No encontramos lo que buscas", con el mensaje del servidor y enlaces a las categorías válidas |
| **500** | Entrar a **Terror**: la 1.ª, 3.ª, 5.ª… petición falla | "El servidor tuvo un problema" + **Reintentar**, que funciona en el segundo intento |
| **Última información disponible** | En Terror: Reintentar (éxito) y luego **Actualizar** (vuelve a fallar) | El error junto con los libros anteriores y el aviso "Mostrando la última información disponible" |
| **Error de red** | Entrar a **Misterio** (responde `HttpResponse.error()`) | "No hay conexión con el servidor" + Reintentar |
| **Vacío** | Entrar a **Poesía** (responde `[]`) | "Aún no hay libros en Poesía" + otras categorías |
| **API no disponible** | `npm run build && npm run preview` (sin MSW) | "La respuesta del servidor no es válida". `vite preview` responde las rutas desconocidas con `index.html` y estado 200, así que llega HTML en vez de JSON. No es un error de red. |

Al **recargar** la página se reinicia el contador del mock, y Terror vuelve a fallar en su primera petición. Es intencional, para poder repetir la demostración.

## Estrategia de carga y caché

`useConsulta(url)` (en `hooks/`) obtiene un recurso desde la caché compartida de `ConsultasProvider`. Esta regla decide si se pide al montar la página:

| Entrada en la caché | ¿Se pide? |
| :--- | :--- |
| No existe | Sí |
| Respuesta reciente (menos de 5 min) | No: se muestra al instante |
| Respuesta vencida | Sí, mostrando los datos anteriores mientras tanto |
| Cargando | No: se reutiliza la petición en curso |
| Error | Solo al volver a entrar a la página o con Reintentar o Actualizar. **Nunca sola.** |

Decisiones de diseño:

- **Un error nunca genera peticiones en bucle.** El efecto depende solo de la URL. La decisión de pedir lee la entrada actual con `useEffectEvent` (React 19.2+), que ve el último valor sin ser dependencia del efecto. Un error cambia la entrada pero no la URL, así que no vuelve a disparar el efecto.
- **La deduplicación usa un `Map`, no el estado.** En `StrictMode`, React monta, desmonta y vuelve a montar cada componente en desarrollo. El segundo montaje ocurre antes de que se aplique el `dispatch` del primero, así que solo el `Map` de peticiones en curso, que se actualiza al instante, sabe que ya hay una. Cada promesa sale del `Map` en un `finally`; si no, Reintentar devolvería siempre la misma promesa ya resuelta.
- **La limpieza asíncrona se resuelve por diseño.** No se usa `AbortController`. El estado de cada petición vive en el Provider, que está por encima de las rutas y nunca se desmonta. Una respuesta que llega después de cambiar de página se guarda en la caché, le sirve a la próxima visita y nunca intenta actualizar un componente desmontado.
- **La lógica es pura y está probada.** El reducer, la regla `necesitaCarga` y la fábrica `crearCargador` (con dobles de `fetch` y `dispatch`) están en `context/consultas.js`, con 15 pruebas.

## Mejoras según el feedback de la sumativa S3

| Observación del docente | Cómo se abordó |
| :--- | :--- |
| `window.confirm` tiene poco control visual y se ve distinto en cada navegador | Componente `DialogoConfirmacion` con `<dialog>` + `showModal()`, que trae el foco atrapado, Esc y el fondo inerte. Se agregaron el foco inicial en **Cancelar**, el clic fuera para cancelar, `aria-labelledby` y `aria-describedby`, y un botón destructivo con texto explícito ("Vaciar lista"). Se usa en **Mi lista** para quitar y vaciar. |
| El `value` del Provider se recreaba con cada cambio y regeneraba las funciones | `ListaProvider` y `ConsultasProvider` exponen **dos contextos**: el de estado y el de acciones. Las acciones se crean **una sola vez** (inicializador de `useState`) y solo usan `dispatch`, que React garantiza estable. |

**Por qué importan las referencias del contexto:** React vuelve a renderizar a quien consume un contexto cuando su `value` cambia **de referencia** (`Object.is`), aunque el contenido sea igual. Si el `value` es `{ datos, agregar: () => … }` y se recrea con cada cambio, **todos** los consumidores se vuelven a renderizar, incluso los que solo usan `agregar`, y las funciones nuevas invalidan los `useEffect` o `useCallback` que dependen de ellas. Con un contexto de acciones estable, un componente que solo despacha acciones no se vuelve a renderizar cuando cambian los datos.

**El límite que queda, como compromiso consciente:** un contexto no tiene "selectores". Quien lee el contexto de **estado** se vuelve a renderizar con cualquier cambio de ese estado. Por ejemplo, cada `useConsulta` se vuelve a renderizar cuando llega la respuesta de **otra** URL. En una aplicación de este tamaño no se nota. La alternativa sería `useSyncExternalStore` con suscripción por URL, que es lo que hacen librerías como TanStack Query.

## REST y GraphQL

La guía de la semana presenta las dos formas de integración. Las instrucciones de la forma B piden REST, que es lo que usa este proyecto.

| | REST (este proyecto) | GraphQL |
| :--- | :--- | :--- |
| Forma | Un endpoint por recurso: `/api/categorias`, `/api/libros/7` | Un solo endpoint, al que el cliente le envía una consulta |
| Qué datos llegan | Lo que define el servidor para ese recurso | Exactamente los campos que pide la consulta |
| Problemas típicos | **Over-fetching** (llegan campos que no se usan) y **under-fetching** (hacen falta varias peticiones para una pantalla) | Más complejidad en el servidor y una caché HTTP menos directa |

En este proyecto el under-fetching se nota en el detalle: título y precio ya venían en el listado, pero la sinopsis requiere otra petición. Por eso el listado se diseñó sin sinopsis, para evitar el over-fetching, y el detalle reutiliza el resumen mientras carga. Con GraphQL, el detalle sería una sola consulta del tipo `query { libro(id: 7) { titulo sinopsis paginas } }`. MSW también puede simularla con `graphql.query('DetalleLibro', …)`.

## Rutas

| Ruta | Página |
| :--- | :--- |
| `/` | Categorías (desde `GET /api/categorias`) |
| `/categorias/:slug` | Libros de la categoría |
| `/libros/:id` | Detalle del libro |
| `/mi-lista` | Mi lista de lectura (guardada en `localStorage`, con versión y validación) |
| `*` | Página 404 |

**Accesibilidad:**
- al cambiar de ruta se actualiza `document.title` y el foco pasa al `<h1>`, salvo en la primera carga;
- los indicadores de carga usan `<output>`;
- los errores usan `role="alert"`;
- hay foco visible en todo el sitio;
- las animaciones solo se activan con `motion-safe`.

## Decisiones respecto de la guía

- **Vite en vez de create-react-app.** CRA está deprecado, y Vite es la herramienta que recomienda hoy la documentación de React. Por eso `process.env.NODE_ENV` pasa a ser `import.meta.env.DEV`.
- **`react-router` 7 en vez de `react-router-dom`.** En la v7, `react-router-dom` solo reexporta `react-router`, que es el paquete recomendado.
- **El único estilo en línea** está en `Portada`: el color de cada portada viene de los datos del libro, así que no puede ser una clase fija de Tailwind.

## Estructura

```text
src/
├── main.jsx                  enableMocking() → render
├── App.jsx                   Providers + BrowserRouter
├── routes/AppRoutes.jsx      Rutas anidadas en Layout, páginas con React.lazy
├── mocks/                    datos.js, handlers.js (API REST simulada), browser.js
├── api/                      cliente.js (fetch + ErrorApi + MENSAJES), libreria.js (rutas)
├── context/                  consultas.js + ConsultasProvider (caché), lista.js + ListaProvider
├── hooks/                    useConsulta, useTituloPagina
├── components/               Layout, Encabezado, EncabezadoPagina, TarjetaCategoria, TarjetaLibro,
│                             Portada, EsqueletoTarjetas, MensajeError, OtrasCategorias,
│                             BotonLista, DialogoConfirmacion
├── pages/                    Inicio, Categoria, DetalleLibro, MiLista, NotFound
├── data/rutas.js             Menú principal
└── utils/formato.js          Precio CLP y título desde el slug
```

Las pruebas (`*.test.js`) están junto al módulo que prueban: handlers (10), cliente (8), caché (15), lista (16) y formato (5).

## Cómo ejecutar

```bash
npm install
npm run dev       # http://localhost:5173 (MSW se activa solo; en la consola aparece "[MSW] Mocking enabled")
npm test          # Vitest en modo watch (npm test -- --run para una sola pasada)
npm run lint
npm run build     # build de producción, sin MSW
npm run preview   # sirve el build: muestra el caso "API no disponible"
```

`public/mockServiceWorker.js` es el Service Worker de MSW, generado con `npx msw init public`. Debe estar presente para que el mock funcione.
