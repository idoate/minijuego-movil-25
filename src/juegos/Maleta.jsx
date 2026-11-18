import { useEffect, useRef, useState } from 'react'
import { useBucle } from './bucle.js'

const ANCHO_MALETA = 64 // px
const ALTO_CAMPO = 420 // px, también en estilos.css

function nuevaPartida() {
  return { maleta: 0.5, objetos: [], puntos: 0, vidas: null, reloj: 0, siguiente: 0.6, id: 0, tiempo: 0 }
}

export default function Maleta({ config, onSuperar }) {
  const { buenos, malos, meta, vidas } = config
  const campo = useRef(null)
  const juego = useRef(nuevaPartida())
  const [fase, setFase] = useState('inicio') // inicio | jugando | perdido | ganado

  function empezar() {
    juego.current = { ...nuevaPartida(), vidas }
    setFase('jugando')
  }

  useBucle(dt => {
    const j = juego.current
    const ancho = campo.current?.clientWidth ?? 340
    j.tiempo += dt
    const velocidad = Math.min(140 + j.tiempo * 6 + j.puntos * 8, 380)

    // Caen objetos cada vez más a menudo.
    j.reloj += dt
    if (j.reloj >= j.siguiente) {
      j.reloj = 0
      j.siguiente = Math.max(1.0 - j.tiempo * 0.015, 0.45)
      const bueno = Math.random() < 0.62
      const lista = bueno ? buenos : malos
      j.objetos.push({
        id: j.id++, bueno, emoji: lista[Math.floor(Math.random() * lista.length)],
        x: 0.08 + Math.random() * 0.84, y: -30, v: velocidad * (0.85 + Math.random() * 0.3),
      })
    }

    // Mueve y mira qué cae en la maleta.
    const arriba = ALTO_CAMPO - 70, abajo = ALTO_CAMPO - 20
    j.objetos = j.objetos.filter(o => {
      o.y += o.v * dt
      const dentro = o.y >= arriba && o.y <= abajo && Math.abs(o.x - j.maleta) * ancho < ANCHO_MALETA / 2 + 10
      if (dentro) {
        if (o.bueno) j.puntos++
        else j.vidas--
        return false
      }
      if (o.y < ALTO_CAMPO + 30) return true
      // Si se le escapa uno bueno, también pierde una vida.
      if (o.bueno) j.vidas--
      return false
    })

    if (j.puntos >= meta) setFase('ganado')
    else if (j.vidas <= 0) setFase('perdido')
  }, fase === 'jugando')

  useEffect(() => {
    if (fase !== 'ganado') return
    const t = setTimeout(onSuperar, 1400)
    return () => clearTimeout(t)
  }, [fase])

  function mover(e) {
    if (!campo.current) return
    const r = campo.current.getBoundingClientRect()
    juego.current.maleta = Math.min(Math.max((e.clientX - r.left) / r.width, 0.06), 0.94)
  }

  const j = juego.current
  return (
    <div className="arcade">
      <h2>Haz la maleta</h2>
      <p className="instrucciones">
        Atrapa {buenos.join(' ')} sin dejar caer ninguno, y esquiva {malos.join(' ')}
      </p>
      <div className="marcador">
        <span>🧳 {j.puntos} / {meta}</span>
        <span>{Array.from({ length: vidas }, (_, i) => (i < (j.vidas ?? vidas) ? '❤️' : '🤍')).join(' ')}</span>
      </div>
      <div className="campo maleta-campo" ref={campo}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); mover(e) }}
        onPointerMove={mover}>
        {j.objetos.map(o => (
          <span key={o.id} className="objeto" style={{ left: `${o.x * 100}%`, transform: `translate(-50%, ${o.y}px)` }}>
            {o.emoji}
          </span>
        ))}
        <span className="maleta" style={{ left: `${j.maleta * 100}%` }}>🧳</span>

        {fase === 'inicio' && <Aviso texto="Mueve la maleta con el dedo" boton="¡Empezar!" onClick={empezar} />}
        {fase === 'perdido' && <Aviso texto="¡Uy! Esa maleta no está lista" boton="¡Otra vez!" onClick={empezar} />}
        {fase === 'ganado' && <Aviso texto="¡Maleta lista!" />}
      </div>
    </div>
  )
}

export function Aviso({ texto, boton, onClick }) {
  return (
    <div className="campo-aviso" onPointerDown={e => e.stopPropagation()}>
      <p>{texto}</p>
      {boton && <button className="boton" onClick={onClick}>{boton}</button>}
    </div>
  )
}
