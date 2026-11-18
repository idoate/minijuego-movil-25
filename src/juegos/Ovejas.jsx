import { useRef, useState } from 'react'
import { useBucle, useResultado } from './bucle.js'
import { Aviso } from './Maleta.jsx'

const ALTO_CAMPO = 420 // px, también en estilos.css
const REDIL = 135 // px, cuadrado en la esquina de arriba a la derecha
const OLFATO = 45 // px: tan cerca del redil, entran solas
const MIEDO = 110 // px: a esta distancia del dedo empiezan a huir
const RADIO = 14 // px, media oveja

function nuevaPartida(n, ancho) {
  const ovejas = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: RADIO + Math.random() * (ancho * 0.55),
    y: ALTO_CAMPO * 0.45 + Math.random() * (ALTO_CAMPO * 0.5 - RADIO),
    rumbo: Math.random() * Math.PI * 2,
    vx: 0, vy: 0, dentro: false,
  }))
  return { ovejas, dedo: null, tiempo: 0 }
}

export default function Ovejas({ config, onSuperar }) {
  const { ovejas: total, segundos } = config
  const campo = useRef(null)
  const juego = useRef(nuevaPartida(total, 340))
  const [fase, setFase] = useState('inicio') // inicio | jugando | noche | ganado

  function empezar() {
    juego.current = nuevaPartida(total, campo.current?.clientWidth ?? 340)
    setFase('jugando')
  }

  useBucle(dt => {
    const j = juego.current
    const ancho = campo.current?.clientWidth ?? 340
    j.tiempo += dt

    for (const o of j.ovejas) {
      if (o.dentro) continue
      // Pasean despacio cambiando un poco de rumbo...
      o.rumbo += (Math.random() - 0.5) * 2.5 * dt
      let vx = Math.cos(o.rumbo) * 22
      let vy = Math.sin(o.rumbo) * 22
      // ...y huyen del dedo, más rápido cuanto más cerca.
      if (j.dedo) {
        const dx = o.x - j.dedo.x, dy = o.y - j.dedo.y
        const d = Math.hypot(dx, dy) || 1
        if (d < MIEDO) {
          const fuerza = 170 * (1 - d / MIEDO)
          vx += (dx / d) * fuerza
          vy += (dy / d) * fuerza
          o.rumbo = Math.atan2(dy, dx)
        }
      }
      // Cerca del redil, lo huelen y van hacia él.
      const hastaRedilX = Math.max(ancho - REDIL - o.x, 0), hastaRedilY = Math.max(o.y - REDIL, 0)
      if (Math.hypot(hastaRedilX, hastaRedilY) < OLFATO) {
        vx += 60
        vy -= 60
      }
      // Suaviza para que no den tirones.
      o.vx += (vx - o.vx) * Math.min(dt * 6, 1)
      o.vy += (vy - o.vy) * Math.min(dt * 6, 1)
      o.x += o.vx * dt
      o.y += o.vy * dt
      // Rebotan en las vallas del prado.
      if (o.x < RADIO || o.x > ancho - RADIO) { o.x = Math.min(Math.max(o.x, RADIO), ancho - RADIO); o.rumbo = Math.PI - o.rumbo }
      if (o.y < RADIO || o.y > ALTO_CAMPO - RADIO) { o.y = Math.min(Math.max(o.y, RADIO), ALTO_CAMPO - RADIO); o.rumbo = -o.rumbo }
      // La que entra en el redil se queda.
      if (o.x > ancho - REDIL && o.y < REDIL) o.dentro = true
    }

    if (j.ovejas.every(o => o.dentro)) setFase('ganado')
    else if (j.tiempo >= segundos) setFase('noche')
  }, fase === 'jugando')

  useResultado(fase === 'ganado', onSuperar, 1400)

  function dedo(e) {
    const r = campo.current.getBoundingClientRect()
    juego.current.dedo = { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const j = juego.current
  const t = Math.min(j.tiempo / segundos, 1)
  const dentro = j.ovejas.filter(o => o.dentro).length
  const quedan = Math.max(Math.ceil(segundos - j.tiempo), 0)

  return (
    <div className="arcade">
      <h2>Guarda las ovejas</h2>
      <p className="instrucciones">Acércate con el dedo y llévalas al redil antes de que anochezca</p>
      <div className="marcador">
        <span>🐑 {dentro} / {total}</span>
        <span>{t < 0.5 ? '☀️' : t < 0.85 ? '🌇' : '🌙'} {quedan} s</span>
      </div>
      <div className="campo prado" ref={campo}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); dedo(e) }}
        onPointerMove={e => { if (juego.current.dedo) dedo(e) }}
        onPointerUp={() => { juego.current.dedo = null }}
        onPointerCancel={() => { juego.current.dedo = null }}>
        <div className="redil" style={{ width: REDIL, height: REDIL }} />
        {j.ovejas.map(o => (
          <span key={o.id} className="oveja"
            style={{ transform: `translate(${o.x - RADIO}px, ${o.y - RADIO}px) scaleX(${o.vx > 0 ? -1 : 1})` }}>
            🐑
          </span>
        ))}
        {j.dedo && <span className="pastora" style={{ transform: `translate(${j.dedo.x - 14}px, ${j.dedo.y - 46}px)` }}>👱‍♀️</span>}
        {/* De tarde a atardecer y a noche. */}
        <div className="cielo" style={{
          background: `linear-gradient(rgba(255, 140, 90, ${0.35 * Math.sin(Math.PI * Math.min(t * 1.3, 1))}), rgba(30, 30, 80, ${0.7 * t * t}))`,
        }} />

        {fase === 'inicio' && <Aviso texto="Las ovejas huyen de ti: llévalas a la esquina del redil" boton="¡Empezar!" onClick={empezar} />}
        {fase === 'noche' && <Aviso texto="Se ha hecho de noche, ¿otra vez?" boton="¡Otra vez!" onClick={empezar} />}
        {fase === 'ganado' && <Aviso texto="¡Todas en casa!" />}
      </div>
    </div>
  )
}
