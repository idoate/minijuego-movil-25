import { createContext, useContext, useEffect, useRef, useState } from 'react'

// La tarjeta da aquí su función para bloquear el botón "Volver al mapa".
export const Bloqueo = createContext(() => {})

// Mientras activo sea true, no se puede cerrar la tarjeta.
export function useBloquear(activo) {
  const bloquear = useContext(Bloqueo)
  useEffect(() => {
    if (!activo) return
    bloquear(true)
    return () => bloquear(false)
  }, [activo])
}

// Avisa del resultado (avisar) cuando listo pasa a true, tras una pausa de ms para ver el mensaje.
// Si la tarjeta se cierra antes de que acabe la pausa, avisa en ese momento: el resultado nunca se pierde.
// Mientras dura la pausa, la tarjeta no se puede cerrar, para que se vea el mensaje.
export function useResultado(listo, avisar, ms) {
  const ultimo = useRef(avisar)
  ultimo.current = avisar
  const [enPausa, setEnPausa] = useState(false)
  useBloquear(enPausa)

  useEffect(() => {
    if (!listo) return
    let avisado = false
    setEnPausa(true)
    const t = setTimeout(() => { avisado = true; setEnPausa(false); ultimo.current() }, ms)
    return () => {
      clearTimeout(t)
      if (!avisado) ultimo.current()
    }
  }, [listo])
}

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
