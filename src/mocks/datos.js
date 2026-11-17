/**
 * Datos del backend simulado. En un sistema real vendrían de una base de datos;
 * aquí los usan solo los handlers de MSW (la app nunca los importa directamente).
 * color: tono de la portada generada con CSS.
 */
export const categorias = [
  { slug: 'ficcion', nombre: 'Ficción', descripcion: 'Novelas contemporáneas y clásicos de la literatura.' },
  { slug: 'ciencia-ficcion', nombre: 'Ciencia ficción', descripcion: 'Futuros posibles, viajes espaciales y tecnología.' },
  { slug: 'fantasia', nombre: 'Fantasía', descripcion: 'Mundos imaginarios, magia y grandes aventuras.' },
  { slug: 'historia', nombre: 'Historia', descripcion: 'Ensayos y relatos sobre el pasado de la humanidad.' },
  { slug: 'terror', nombre: 'Terror', descripcion: 'Relatos para leer con la luz encendida.' },
  { slug: 'misterio', nombre: 'Misterio', descripcion: 'Detectives, enigmas y crímenes por resolver.' },
  { slug: 'poesia', nombre: 'Poesía', descripcion: 'Versos de autores chilenos y del mundo.' },
]

export const libros = [
  { id: 1, categoria: 'ficcion', titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio: 1967, paginas: 471, precio: 18990, color: '#b45309', sinopsis: 'La historia de la familia Buendía a lo largo de siete generaciones en el pueblo de Macondo.' },
  { id: 2, categoria: 'ficcion', titulo: 'La casa de los espíritus', autor: 'Isabel Allende', anio: 1982, paginas: 448, precio: 16990, color: '#9d174d', sinopsis: 'Cuatro generaciones de la familia Trueba atraviesan la historia política y social de un país latinoamericano.' },
  { id: 3, categoria: 'ficcion', titulo: 'Rayuela', autor: 'Julio Cortázar', anio: 1963, paginas: 600, precio: 17490, color: '#1d4ed8', sinopsis: 'Una novela que puede leerse en distinto orden, entre París y Buenos Aires.' },
  { id: 4, categoria: 'ficcion', titulo: 'El túnel', autor: 'Ernesto Sabato', anio: 1948, paginas: 160, precio: 10990, color: '#374151', sinopsis: 'El pintor Juan Pablo Castel relata desde la cárcel cómo llegó a cometer un crimen.' },
  { id: 5, categoria: 'ficcion', titulo: 'Pedro Páramo', autor: 'Juan Rulfo', anio: 1955, paginas: 128, precio: 9990, color: '#92400e', sinopsis: 'Juan Preciado viaja a Comala en busca de su padre y encuentra un pueblo habitado por murmullos.' },
  { id: 6, categoria: 'ficcion', titulo: 'Los detectives salvajes', autor: 'Roberto Bolaño', anio: 1998, paginas: 624, precio: 21990, color: '#0f766e', sinopsis: 'Dos poetas recorren el mundo tras la pista de una escritora desaparecida.' },
  { id: 7, categoria: 'ciencia-ficcion', titulo: 'Fundación', autor: 'Isaac Asimov', anio: 1951, paginas: 296, precio: 14990, color: '#1e3a8a', sinopsis: 'Un matemático predice la caída del Imperio Galáctico y planea acortar la era de oscuridad.' },
  { id: 8, categoria: 'ciencia-ficcion', titulo: 'Dune', autor: 'Frank Herbert', anio: 1965, paginas: 704, precio: 22990, color: '#c2410c', sinopsis: 'En el planeta desértico Arrakis, Paul Atreides se convierte en el centro de una lucha por el poder.' },
  { id: 9, categoria: 'ciencia-ficcion', titulo: 'Fahrenheit 451', autor: 'Ray Bradbury', anio: 1953, paginas: 192, precio: 11990, color: '#b91c1c', sinopsis: 'En una sociedad donde los libros están prohibidos, un bombero se dedica a quemarlos.' },
  { id: 10, categoria: 'ciencia-ficcion', titulo: 'La mano izquierda de la oscuridad', autor: 'Ursula K. Le Guin', anio: 1969, paginas: 336, precio: 15990, color: '#475569', sinopsis: 'Un enviado llega a un planeta helado cuyos habitantes no tienen un sexo fijo.' },
  { id: 11, categoria: 'ciencia-ficcion', titulo: 'Neuromante', autor: 'William Gibson', anio: 1984, paginas: 320, precio: 14490, color: '#047857', sinopsis: 'Un hacker caído en desgracia recibe una última oportunidad en el ciberespacio.' },
  { id: 12, categoria: 'ciencia-ficcion', titulo: 'Un mundo feliz', autor: 'Aldous Huxley', anio: 1932, paginas: 256, precio: 12990, color: '#7c3aed', sinopsis: 'Una sociedad perfecta en apariencia, donde la felicidad se fabrica en laboratorios.' },
  { id: 13, categoria: 'fantasia', titulo: 'El hobbit', autor: 'J. R. R. Tolkien', anio: 1937, paginas: 320, precio: 15990, color: '#166534', sinopsis: 'Bilbo Bolsón deja su hogar para acompañar a trece enanos en busca de un tesoro.' },
  { id: 14, categoria: 'fantasia', titulo: 'Un mago de Terramar', autor: 'Ursula K. Le Guin', anio: 1968, paginas: 224, precio: 13990, color: '#0e7490', sinopsis: 'Ged, un joven con un gran talento para la magia, libera por orgullo una sombra que lo persigue.' },
  { id: 15, categoria: 'fantasia', titulo: 'La historia interminable', autor: 'Michael Ende', anio: 1979, paginas: 496, precio: 16990, color: '#9f1239', sinopsis: 'Bastián lee un libro que lo lleva al reino de Fantasía, que está a punto de desaparecer.' },
  { id: 16, categoria: 'fantasia', titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', anio: 2007, paginas: 880, precio: 24990, color: '#7f1d1d', sinopsis: 'Kvothe, un héroe convertido en posadero, cuenta la verdadera historia de su vida.' },
  { id: 17, categoria: 'fantasia', titulo: 'Coraline', autor: 'Neil Gaiman', anio: 2002, paginas: 176, precio: 9990, color: '#312e81', sinopsis: 'Una niña encuentra una puerta que lleva a una versión inquietante de su propia casa.' },
  { id: 18, categoria: 'historia', titulo: 'Sapiens', autor: 'Yuval Noah Harari', anio: 2011, paginas: 496, precio: 19990, color: '#a16207', sinopsis: 'Un recorrido por la historia de la humanidad, desde los primeros humanos hasta hoy.' },
  { id: 19, categoria: 'historia', titulo: 'Las venas abiertas de América Latina', autor: 'Eduardo Galeano', anio: 1971, paginas: 400, precio: 15990, color: '#991b1b', sinopsis: 'Un ensayo sobre la explotación económica del continente desde la colonia.' },
  { id: 20, categoria: 'historia', titulo: 'Armas, gérmenes y acero', autor: 'Jared Diamond', anio: 1997, paginas: 592, precio: 20990, color: '#3f6212', sinopsis: 'Por qué unas sociedades dominaron a otras: geografía, agricultura y enfermedades.' },
  { id: 21, categoria: 'historia', titulo: 'Historia de Chile', autor: 'Sergio Villalobos', anio: 1974, paginas: 352, precio: 17990, color: '#1e40af', sinopsis: 'Una síntesis de la historia del país desde los pueblos originarios hasta el siglo XX.' },
  { id: 22, categoria: 'historia', titulo: 'El diario de Ana Frank', autor: 'Ana Frank', anio: 1947, paginas: 368, precio: 11990, color: '#57534e', sinopsis: 'El diario de una adolescente judía escondida durante la ocupación nazi de Ámsterdam.' },
  { id: 23, categoria: 'terror', titulo: 'Drácula', autor: 'Bram Stoker', anio: 1897, paginas: 488, precio: 12990, color: '#450a0a', sinopsis: 'Jonathan Harker viaja a Transilvania y descubre la verdadera naturaleza de su anfitrión.' },
  { id: 24, categoria: 'terror', titulo: 'Frankenstein', autor: 'Mary Shelley', anio: 1818, paginas: 280, precio: 10990, color: '#14532d', sinopsis: 'Víctor Frankenstein da vida a una criatura y debe enfrentar las consecuencias.' },
  { id: 25, categoria: 'terror', titulo: 'It', autor: 'Stephen King', anio: 1986, paginas: 1504, precio: 26990, color: '#b91c1c', sinopsis: 'Un grupo de amigos se enfrenta a una criatura que despierta cada 27 años en el pueblo de Derry.' },
  { id: 26, categoria: 'terror', titulo: 'Cuentos de amor, de locura y de muerte', autor: 'Horacio Quiroga', anio: 1917, paginas: 208, precio: 9490, color: '#365314', sinopsis: 'Relatos que exploran el miedo, la naturaleza salvaje y la fragilidad humana.' },
  { id: 27, categoria: 'misterio', titulo: 'El nombre de la rosa', autor: 'Umberto Eco', anio: 1980, paginas: 640, precio: 18990, color: '#78350f', sinopsis: 'En una abadía medieval, un fraile investiga una serie de muertes misteriosas.' },
  { id: 28, categoria: 'misterio', titulo: 'Asesinato en el Orient Express', autor: 'Agatha Christie', anio: 1934, paginas: 256, precio: 11990, color: '#1e3a8a', sinopsis: 'Hércules Poirot investiga un crimen en un tren detenido por la nieve.' },
  { id: 29, categoria: 'misterio', titulo: 'El sabueso de los Baskerville', autor: 'Arthur Conan Doyle', anio: 1902, paginas: 256, precio: 10490, color: '#3f3f46', sinopsis: 'Sherlock Holmes enfrenta la leyenda de un perro infernal en los páramos ingleses.' },
  { id: 30, categoria: 'misterio', titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', anio: 2001, paginas: 576, precio: 17990, color: '#44403c', sinopsis: 'Un joven descubre un libro olvidado y decide averiguar por qué alguien quema las obras de su autor.' },
]
