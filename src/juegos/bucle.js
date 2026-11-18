import { useEffect, useRef, useState } from 'react'

// Llama a paso(dt en segundos) en cada fotograma mientras activo sea true, y vuelve a pintar el componente.
// Se para solo al desmontar (al cerrar la tarjeta).
export function useBucle(paso, activo) {
  const ultimoPaso = useRef(paso)
  ultimoPaso.current = paso
  const [, pintar] = useState(0)

  useEffect(() => {
    if (!activo) return
    let id
    let antes = performance.now()
    function fotograma(ahora) {
      const dt = Math.min((ahora - antes) / 1000, 0.05) // si la pestaña se dormía, que no salte
      antes = ahora
      ultimoPaso.current(dt)
      pintar(n => n + 1)
      id = requestAnimationFrame(fotograma)
    }
    id = requestAnimationFrame(fotograma)
    return () => cancelAnimationFrame(id)
  }, [activo])
}
