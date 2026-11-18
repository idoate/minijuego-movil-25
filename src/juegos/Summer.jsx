import { useRef, useState } from 'react'
import { useBloquear, useBucle, useResultado } from './bucle.js'
import { Aviso } from './Maleta.jsx'
import { ladrar } from './ladrido.js'

// Summer: labrador beige, de perfil mirando a la derecha. Origen en las patas.
export function Perro({ contento = false }) {
  return (
    <g>
      <ellipse cy="1" rx="17" ry="3" fill="rgba(60,40,30,.15)" />
      <path className="cola" d="M-14,-16 C-22,-19 -23,-27 -19,-31" fill="none" stroke="#e2c690" strokeWidth="4" strokeLinecap="round" />
      <rect x="-12" y="-10" width="4.5" height="10" rx="2" fill="#d9bb84" />
      <rect x="-6" y="-10" width="4.5" height="10" rx="2" fill="#e2c690" />
      <rect x="5" y="-10" width="4.5" height="10" rx="2" fill="#d9bb84" />
      <rect x="10.5" y="-10" width="4.5" height="10" rx="2" fill="#e2c690" />
      <ellipse cy="-14" rx="16" ry="8.5" fill="#e8d0a2" />
      <path d="M-10,-9 C-4,-7 4,-7 10,-9" stroke="#d6b985" strokeWidth="1.2" fill="none" />
      <circle cx="15" cy="-24" r="8.5" fill="#e8d0a2" />
      <ellipse cx="22.5" cy="-21" rx="5.5" ry="4" fill="#f1dfbb" />
      <circle cx="27" cy="-22.5" r="2" fill="#4a3328" />
      <path d="M20,-18.5 Q22.5,-17 25,-18.5" stroke="#4a3328" strokeWidth=".9" fill="none" strokeLinecap="round" />
      {contento && <ellipse cx="22.5" cy="-16.5" rx="1.8" ry="2.6" fill="#e98aa0" />}
      <circle cx="18" cy="-26.5" r="1.4" fill="#3a2a25" />
      <ellipse cx="11" cy="-22" rx="3.6" ry="6.5" fill="#cfae76" transform="rotate(18 11 -22)" />
      <path d="M7.5,-19 C9,-14 11,-12 13,-12" stroke="#e98aa0" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </g>
  )
}

// Kong rojo con Philadelphia por encima.
function Kong() {
  return (
    <svg viewBox="-12 -16 24 30" className="premio-icono" aria-hidden="true">
      <ellipse cy="8" rx="10" ry="6" fill="#d8343a" />
      <ellipse cy="0" rx="7.5" ry="5" fill="#e04148" />
      <ellipse cy="-6.5" rx="5.5" ry="4" fill="#d8343a" />
      <path d="M-5,-9 C-4,-15 4,-15 5,-9 C3,-11 -3,-11 -5,-9Z" fill="#fffaf1" />
      <ellipse cx="-2" cy="-12" rx="1.5" ry="1" fill="#fff" />
    </svg>
  )
}

// Pata de gallina para perros.
function Pata() {
  return (
    <svg viewBox="-12 -14 24 28" className="premio-icono" aria-hidden="true">
      <g stroke="#d99a3a" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M0,12 L0,-1" />
        <path d="M0,-1 L-7,-10 M0,-1 L0,-12 M0,-1 L7,-10" />
      </g>
      <g stroke="#f1c36b" strokeWidth="1.2" strokeLinecap="round" fill="none">
        <path d="M0,10 L0,0" />
      </g>
    </svg>
  )
}

const DIBUJOS = { kong: <Kong />, pata: <Pata /> }

const ALTO_CAMPO = 360 // px, también en estilos.css

function nuevaPartida() {
  return { objetos: [], calma: 0, tiempo: 0, reloj: 0, id: 0, aviso: null }
}

// Minijuego: toca los premios de Summer antes de que desaparezcan y evita lo que le sienta mal.
export default function Summer({ config, enSalida, onSuperar, onFallar }) {
  const { premios, prohibidos, meta, segundos } = config
  const campo = useRef(null)
  const juego = useRef(nuevaPartida())
  const [fase, setFase] = useState('inicio') // inicio | jugando | perdido | ganado

  useBucle(dt => {
    const j = juego.current
    j.tiempo += dt
    j.reloj += dt
    if (j.reloj >= 0.55 && j.objetos.length < 4) {
      j.reloj = 0
      const bueno = Math.random() < 0.58
      const lista = bueno ? premios : prohibidos
      // Lejos del centro, donde está Summer.
      let x, y
      do {
        x = 0.1 + Math.random() * 0.8
        y = 0.1 + Math.random() * 0.8
      } while (Math.hypot(x - 0.5, (y - 0.5) * 1.2) < 0.3)
      j.objetos.push({ id: j.id++, bueno, cual: lista[Math.floor(Math.random() * lista.length)], x, y, vida: 1.1 })
    }
    j.objetos = j.objetos.filter(o => (o.vida -= dt) > 0)
    if (j.aviso && (j.aviso.vida -= dt) <= 0) j.aviso = null

    if (j.calma >= meta) setFase('ganado')
    else if (j.tiempo >= segundos) {
      setFase('perdido')
      ladrar(3)
    }
  }, fase === 'jugando')

  // Una vez empezada, no se puede escapar cerrando la tarjeta.
  useBloquear(fase === 'jugando')
  useResultado(fase === 'ganado' || fase === 'perdido', fase === 'ganado' ? onSuperar : onFallar, 2200)

  function tocar(o) {
    const j = juego.current
    j.objetos = j.objetos.filter(x => x.id !== o.id)
    if (o.bueno) {
      j.calma++
      j.aviso = { texto: '¡Ñam!', bien: true, vida: 0.6 }
    } else {
      j.calma = Math.max(j.calma - 2, 0)
      ladrar(1)
      j.aviso = { texto: '¡Eso no, que le sienta fatal!', bien: false, vida: 1.2 }
    }
  }

  const j = juego.current
  const nervios = 1 - j.calma / meta
  const quedan = Math.max(Math.ceil(segundos - j.tiempo), 0)

  return (
    <div className="arcade summer">
      <h2>{enSalida ? 'Summer sigue alterado' : '¡Oh no! Has alterado a Summer'}</h2>
      <p className="instrucciones">
        {enSalida
          ? 'Cálmale con sus premios favoritos para volver a tu sitio en el camino.'
          : 'Ahora vas a tener que calmarle con sus premios favoritos para no volver al principio del camino.'}
      </p>
      <div className="marcador">
        <span>{Array.from({ length: meta }, (_, i) => (i < j.calma ? '💛' : '🤍')).join('')}</span>
        <span>⏱️ {quedan} s</span>
      </div>
      <div className="campo summer-campo" ref={campo}>
        <svg className="summer-perro" viewBox="-30 -36 62 40"
          style={{ animationDuration: `${0.25 + (1 - nervios) * 0.9}s`, '--salto': `${4 + nervios * 10}px` }}>
          <Perro contento={fase === 'ganado'} />
        </svg>
        {j.objetos.map(o => (
          <button key={o.id} className={`premio ${o.bueno ? '' : 'prohibido'}`}
            style={{ left: `${o.x * 100}%`, top: `${o.y * 100}%`, opacity: Math.min(o.vida / 0.3, 1) }}
            onPointerDown={() => tocar(o)} aria-label={o.bueno ? 'Premio' : 'Prohibido'}>
            {DIBUJOS[o.cual] ?? o.cual}
          </button>
        ))}
        {j.aviso && <p className={`summer-aviso ${j.aviso.bien ? 'bien' : ''}`}>{j.aviso.texto}</p>}

        {fase === 'inicio' && (
          <Aviso
            texto={<>Sus favoritos: lamer Philadelphia del Kong <span className="mini"><Kong /></span> y patas de gallina <span className="mini"><Pata /></span>. ¡Ni chocolate, ni uvas, ni cebolla!</>}
            boton="¡Calmar a Summer!" onClick={() => { juego.current = nuevaPartida(); setFase('jugando') }} />
        )}
        {fase === 'ganado' && <Aviso texto="¡Summer ya está tranquilo! 🐾" />}
        {fase === 'perdido' && <Aviso texto={enSalida ? 'Summer sigue nervioso… inténtalo otra vez cuando quieras.' : '¡Summer sigue nervioso! Vuelves a la salida del camino…'} />}
      </div>
    </div>
  )
}
