/**
 * Portada de un libro generada con CSS (sin imágenes externas). Es decorativa:
 * el título y el autor ya se muestran como texto junto a ella.
 *
 * @param {boolean} compacta - Miniatura sin texto (para listas).
 */
function Portada({ titulo, autor, color, compacta = false, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`flex aspect-2/3 flex-col justify-between overflow-hidden rounded-xl text-white shadow-md ring-1 ring-black/10 ${compacta ? 'p-2' : 'p-3'} ${className}`}
      // El color viene de los datos de cada libro: no puede ser una clase fija de Tailwind
      style={{ backgroundColor: color }}
    >
      <span className="h-1 w-8 max-w-full rounded bg-white/60" />
      {!compacta && (
        <>
          <span className="font-titulo text-base leading-tight font-bold">{titulo}</span>
          <span className="text-xs text-white/80">{autor}</span>
        </>
      )}
    </div>
  )
}

export default Portada
