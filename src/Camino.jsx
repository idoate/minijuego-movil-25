import { useEffect, useRef, useState } from 'react'
import Fondo from './Fondo.jsx'
import { Perro } from './juegos/Summer.jsx'
import { DIAS, FINAL, MALETA } from './contenido.js'
import { estadoEtapa, fechaCorta, paradaActual } from './logica.js'

// Salida, 7 paradas y meta, en zigzag de arriba abajo (viewBox 360×1000).
const PUNTOS = [
  { x: 180, y: 60 },
  { x: 90, y: 170 },
  { x: 270, y: 280 },
  { x: 90, y: 390 },
  { x: 270, y: 500 },
  { x: 90, y: 610 },
  { x: 270, y: 720 },
  { x: 90, y: 830 },
  { x: 180, y: 935 },
]

const CAMINO = PUNTOS.map((p, i) => {
  if (i === 0) return `M${p.x},${p.y}`
  const a = PUNTOS[i - 1]
  return `C${a.x},${a.y + 55} ${p.x},${p.y - 55} ${p.x},${p.y}`
}).join(' ')

// El punto medio de cada tramo cae sobre el camino.
const CORAZONES = PUNTOS.slice(1).map((p, i) => ({ x: (p.x + PUNTOS[i].x) / 2, y: (p.y + PUNTOS[i].y) / 2 }))

export default function Camino({ hoy, progreso, onAbrir }) {
  // Si no ha calmado a Summer, Leyre espera en la salida.
  const actual = progreso.enSalida ? -1 : paradaActual(hoy)
  const leyreRef = useRef(null)
  const llegado = actual === DIAS.length
  const punto = PUNTOS[actual + 1]
  const lado = llegado ? -48 : punto.x < 180 ? 48 : punto.x > 180 ? -48 : 44

  // Con un pequeño retraso, para que no lo pise la restauración del scroll del navegador.
  useEffect(() => {
    const t = setTimeout(() => leyreRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 300)
    return () => clearTimeout(t)
  }, [actual])

  return (
    <svg className="camino" viewBox="0 0 360 1000" role="img" aria-label="Nuestro camino">
      <defs>
        <clipPath id="circulo">
          <circle r="27" />
        </clipPath>
      </defs>

      <Fondo />
      {/* El camino es una pasarela de rejilla con barandilla, como la de la foto. */}
      <path d={CAMINO} className="pasarela-sombra" transform="translate(2,5)" />
      <path d={CAMINO} className="pasarela" />
      <path d={CAMINO} className="pasarela-rejilla" />
      <path d={CAMINO} className="barandilla" transform="translate(0,-7)" />
      {CORAZONES.map((c, i) => <Corazon key={i} x={c.x} y={c.y} tam={0.9} />)}

      <g transform={`translate(${PUNTOS[0].x},${PUNTOS[0].y})`}>
        <circle r="16" className="salida" />
        <text y="5" className="rotulo pequeno">Salida</text>
      </g>

      {DIAS.map((dia, i) => (
        <Parada
          key={dia.fecha}
          punto={PUNTOS[i + 1]}
          numero={i}
          dia={dia}
          estado={estadoEtapa(dia.fecha, hoy, progreso)}
          onAbrir={onAbrir}
        />
      ))}

      <Cartel x={280} y={833} abierto={hoy >= MALETA.fecha} onAbrir={() => onAbrir('maleta')} />
      <Meta punto={PUNTOS[8]} abierta={hoy >= FINAL.fecha} onAbrir={() => onAbrir('final')} />
      <El x={PUNTOS[8].x + 50} y={PUNTOS[8].y + 22} />
      <Leyre ref={leyreRef} x={punto.x + lado} y={punto.y + (actual === -1 ? 26 : 25)} />
      <SummerPaseando onTocar={() => onAbrir('summer')} />
    </svg>
  )
}

// Summer da vueltas por el mapa al trote: elige un sitio al azar, va hasta él y descansa un poco.
function SummerPaseando({ onTocar }) {
  const [paseo, setPaseo] = useState({ x: 300, y: 540, mira: -1, segundos: 0 })

  useEffect(() => {
    let t
    function siguiente(desde) {
      const x = 70 + Math.random() * 220
      const y = 110 + Math.random() * 850
      const segundos = Math.hypot(x - desde.x, y - desde.y) / 45
      const nuevo = { x, y, mira: x < desde.x ? -1 : 1, segundos }
      setPaseo(nuevo)
      t = setTimeout(() => siguiente(nuevo), (segundos + 0.6 + Math.random() * 1.8) * 1000)
    }
    t = setTimeout(() => siguiente(paseo), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <g className="summer-mapa" onClick={onTocar} role="button" aria-label="Summer"
      style={{ transform: `translate(${paseo.x}px, ${paseo.y}px)`, transitionDuration: `${paseo.segundos}s` }}>
      <circle r="26" cy="-14" fill="transparent" />
      <g transform={`scale(${paseo.mira}, 1)`}>
        <g className="trote"><Perro /></g>
      </g>
    </g>
  )
}

function Parada({ punto, numero, dia, estado, onAbrir }) {
  const abierta = estado === 'abierta'
  return (
    <g
      className={`parada ${estado}`}
      transform={`translate(${punto.x},${punto.y})`}
      onClick={() => onAbrir(numero)}
      role="button"
      aria-label={`Etapa ${numero + 1}`}
    >
      <circle r="30" className="parada-fondo" />
      {abierta ? (
        <image href={dia.pista.foto} x="-27" y="-27" width="54" height="54"
          preserveAspectRatio="xMidYMid slice" clipPath="url(#circulo)" />
      ) : (
        <text y={estado === 'jugar' ? 11 : 8} className={estado === 'jugar' ? 'interrogante' : 'icono'}>
          {estado === 'jugar' ? '?' : estado === 'fallada' ? '🌙' : '⏳'}
        </text>
      )}
      {abierta && <text y="49" className="rotulo">{dia.pista.titulo}</text>}
      <text y={abierta ? 64 : 49} className="rotulo fecha">{fechaCorta(dia.fecha)}</text>
    </g>
  )
}

function Meta({ punto, abierta, onAbrir }) {
  return (
    <g className={`meta ${abierta ? 'brilla' : ''}`} transform={`translate(${punto.x},${punto.y})`}
      onClick={onAbrir} role="button" aria-label="Meta">
      <Corazon x={0} y={-6} tam={4.2} />
      {!abierta && <text y="6" className="icono">⏳</text>}
      <text y="44" className="rotulo fecha">{fechaCorta(FINAL.fecha)}</text>
    </g>
  )
}

// Cartel de madera con los consejos para la maleta.
function Cartel({ x, y, abierto, onAbrir }) {
  return (
    <g className={`cartel ${abierto ? 'abierto' : ''}`} transform={`translate(${x},${y})`}
      onClick={onAbrir} role="button" aria-label="Para la maleta">
      <rect x="-2.5" y="-4" width="5" height="34" rx="1.5" fill="#8a6a48" />
      <rect x="-24" y="-26" width="48" height="26" rx="5" fill="#d9a86a" stroke="#9b7a4c" strokeWidth="2" />
      <text y="-6" className="icono">{abierto ? '🧳' : '⏳'}</text>
    </g>
  )
}

function Corazon({ x, y, tam }) {
  return (
    <path className="corazon" transform={`translate(${x},${y}) scale(${tam})`}
      d="M0,-1 C0,-5 -6,-6 -6,-1.5 C-6,2 -2,4.5 0,7 C2,4.5 6,2 6,-1.5 C6,-6 0,-5 0,-1Z" />
  )
}

const PIEL = '#f6d6bd'
const OJOS = '#3a2a25'

// Leyre: coleta alta rubia con mechas, plumas crema, vaqueros y zapatillas blancas. Origen en los pies.
function Leyre({ x, y, ref }) {
  return (
    <g ref={ref} className="personaje" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <g className="andando">
        <ellipse cy="1" rx="13" ry="3" fill="rgba(60,40,30,.15)" />
        <path d="M5,-57 C20,-62 24,-46 15,-33 C15,-42 12,-50 5,-52Z" fill="#e6bd62" />
        <path d="M10,-55 C17,-55 18,-46 15,-39" stroke="#f6dfa0" strokeWidth="1.5" fill="none" />
        <rect x="-7" y="-19" width="6" height="17" rx="2" fill="#5b7fb5" />
        <rect x="1" y="-19" width="6" height="17" rx="2" fill="#5b7fb5" />
        <ellipse cx="-4.5" cy="-1.5" rx="5" ry="2.8" fill="#fff" stroke="#d9d2c7" />
        <ellipse cx="4.5" cy="-1.5" rx="5" ry="2.8" fill="#fff" stroke="#d9d2c7" />
        <rect x="-15" y="-34" width="6" height="15" rx="3" fill="#f3e6cc" stroke="#e0cfae" />
        <rect x="9" y="-34" width="6" height="15" rx="3" fill="#f3e6cc" stroke="#e0cfae" />
        <circle cx="-12" cy="-18" r="2.6" fill={PIEL} />
        <circle cx="12" cy="-18" r="2.6" fill={PIEL} />
        <rect x="-11" y="-37" width="22" height="22" rx="7" fill="#f3e6cc" stroke="#e0cfae" />
        <path d="M-10,-30 H10 M-10,-23 H10" stroke="#e0cfae" />
        <circle cy="-47" r="12" fill={PIEL} />
        <path d="M-12.5,-45 C-14,-62 14,-62 12.5,-45 C10,-53 -2,-56 -12.5,-45Z" fill="#e6bd62" />
        <path d="M-12.5,-46 C-14,-40 -13,-36 -11,-34 C-11,-39 -11,-43 -10,-47Z" fill="#e6bd62" />
        <path d="M12.5,-46 C14,-40 13,-36 11,-34 C11,-39 11,-43 10,-47Z" fill="#e6bd62" />
        <path d="M-7,-55 C-3,-58 2,-58 6,-56" stroke="#f6dfa0" strokeWidth="1.5" fill="none" />
        <circle cx="6" cy="-57" r="2.2" fill="#e98aa0" />
        <circle cx="-4" cy="-46" r="1.4" fill={OJOS} />
        <circle cx="4" cy="-46" r="1.4" fill={OJOS} />
        <ellipse cx="-7.5" cy="-42" rx="2.2" ry="1.3" fill="#e98aa0" opacity=".55" />
        <ellipse cx="7.5" cy="-42" rx="2.2" ry="1.3" fill="#e98aa0" opacity=".55" />
        <path d="M-2.5,-41.5 Q0,-39 2.5,-41.5" stroke={OJOS} strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

// Él: pelo rubio corto hacia arriba, candado muy cortito (bigote y perilla), polo negro y vaqueros, con un corazón.
function El({ x, y }) {
  return (
    <g transform={`translate(${x},${y}) scale(1.08)`}>
      <ellipse cy="1" rx="13" ry="3" fill="rgba(60,40,30,.15)" />
      <rect x="-7" y="-19" width="6" height="17" rx="2" fill="#4f74ad" />
      <rect x="1" y="-19" width="6" height="17" rx="2" fill="#4f74ad" />
      <rect x="-8" y="-20" width="16" height="4" rx="1.5" fill="#4f74ad" />
      <ellipse cx="-4.5" cy="-1.5" rx="5" ry="2.8" fill="#fff" stroke="#d9d2c7" />
      <ellipse cx="4.5" cy="-1.5" rx="5" ry="2.8" fill="#fff" stroke="#d9d2c7" />
      <rect x="-14.5" y="-33" width="5" height="14" rx="2.5" fill={PIEL} />
      <rect x="9.5" y="-33" width="5" height="14" rx="2.5" fill={PIEL} />
      <circle cx="-12" cy="-18" r="2.6" fill={PIEL} />
      <path d="M-11,-36 L-16,-31 L-13.5,-27 L-10,-29Z M11,-36 L16,-31 L13.5,-27 L10,-29Z" fill="#1e1e22" />
      <rect x="-11" y="-37" width="22" height="20" rx="5" fill="#1e1e22" />
      <path d="M-5,-37.5 L0,-34 L-2,-31 Z M5,-37.5 L0,-34 L2,-31 Z" fill="#3a3a40" />
      <path d="M0,-34 V-28" stroke="#3a3a40" strokeWidth="1" />
      <circle cy="-31.5" r=".7" fill="#8a8a92" />
      <circle cy="-29" r=".7" fill="#8a8a92" />
      <circle cy="-47" r="12" fill={PIEL} />
      <g fill="none" stroke="#b8893f" strokeLinecap="round" opacity=".5">
        <path d="M-3.8,-43.6 Q0,-45 3.8,-43.6" strokeWidth="1.3" />
        <path d="M-3.8,-43.6 Q-4.6,-40 -2,-37.4 Q0,-36.6 2,-37.4 Q4.6,-40 3.8,-43.6" strokeWidth="1.3" />
      </g>
      <ellipse cy="-37.2" rx="2" ry="1.1" fill="#b8893f" opacity=".5" />
      <path d="M-12.6,-46 C-14,-55 -9,-60 -3,-59 C-1,-64 7,-65 10,-60 C13,-57 13.5,-51 12.6,-46 C10,-51 4,-53 -2,-52.5 C-7,-52 -10.5,-50 -12.6,-46Z" fill="#dcb257" />
      <path d="M-4,-57 C-2,-61 3,-62 6,-60 M-9,-54 C-8,-57 -6,-58 -4,-58" stroke="#f1d58e" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <circle cx="-4" cy="-47" r="1.4" fill={OJOS} />
      <circle cx="4" cy="-47" r="1.4" fill={OJOS} />
      <path d="M-2.5,-42.5 Q0,-40.5 2.5,-42.5" stroke={OJOS} strokeWidth="1" fill="none" strokeLinecap="round" />
      <g transform="translate(16,-24) scale(1.4)">
        <path className="corazon" d="M0,-1 C0,-5 -6,-6 -6,-1.5 C-6,2 -2,4.5 0,7 C2,4.5 6,2 6,-1.5 C6,-6 0,-5 0,-1Z" />
      </g>
    </g>
  )
}
