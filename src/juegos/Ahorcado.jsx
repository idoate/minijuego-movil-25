import { useEffect, useState } from 'react'

const LETRAS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('')
const VIDAS = 4

export default function Ahorcado({ config, onSuperar }) {
  const palabra = config.palabra.toUpperCase()
  const [usadas, setUsadas] = useState([])
  const fallos = usadas.filter(l => !palabra.includes(l)).length
  const ganado = [...palabra].every(l => usadas.includes(l))
  const perdido = fallos >= VIDAS

  // Una pausa para ver la palabra completa antes de pasar a la pista.
  useEffect(() => {
    if (!ganado) return
    const t = setTimeout(onSuperar, 1400)
    return () => clearTimeout(t)
  }, [ganado])

  return (
    <div className="ahorcado">
      <h2>Adivina la palabra</h2>
      <p className="vidas" aria-label={`${VIDAS - fallos} intentos`}>
        {Array.from({ length: VIDAS }, (_, i) => (i < VIDAS - fallos ? '❤️' : '🤍')).join(' ')}
      </p>
      <p className="palabra">
        {[...palabra].map((l, i) => (
          <span key={i}>{usadas.includes(l) ? l : ''}</span>
        ))}
      </p>
      {ganado && <p className="aviso bien">¡Bien hecho!</p>}
      {perdido && (
        <>
          <p className="aviso">Se acabaron las vidas</p>
          <button className="boton" onClick={() => setUsadas([])}>¡Otra vez!</button>
        </>
      )}
      <div className="teclado">
        {LETRAS.map(l => (
          <button
            key={l}
            className={usadas.includes(l) ? (palabra.includes(l) ? 'acierto' : 'fallo') : ''}
            disabled={usadas.includes(l) || ganado || perdido}
            onClick={() => setUsadas(u => [...u, l])}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  )
}
