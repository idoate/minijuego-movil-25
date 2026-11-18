// Fondo del mapa (viewBox 360×1000): un desfiladero con paredes de roca naranja, un río turquesa
// y mucho verde, inspirado en la foto de Leyre en las pasarelas.

import { useLayoutEffect, useRef, useState } from 'react'

// Aleatorio con semilla: el fondo sale igual en cada visita.
function aleatorio(semilla) {
  return () => {
    semilla = (semilla + 0x6d2b79f5) | 0
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const VERDES = ['#8cc26b', '#a7d18a', '#6fae55', '#b9dc9f']

const azar = aleatorio(25112026)
const MATAS = Array.from({ length: 70 }, () => ({
  x: 30 + azar() * 300,
  y: 40 + azar() * 960,
  r: 7 + azar() * 10,
  color: VERDES[Math.floor(azar() * VERDES.length)],
}))
const CHOPOS = [
  { x: 128, y: 120 }, { x: 236, y: 205 }, { x: 140, y: 330 }, { x: 228, y: 450 },
  { x: 132, y: 560 }, { x: 235, y: 650 }, { x: 140, y: 770 }, { x: 230, y: 880 },
]

const RIO = 'M182,-20 C240,60 120,120 176,200 S240,330 182,410 S118,540 182,620 S246,760 180,840 S140,960 182,1020'

const ROCA_IZQ = 'M0,0 H58 C40,70 66,140 46,215 C28,290 58,350 42,430 C26,510 60,590 44,670 C30,750 60,830 42,905 C32,950 52,985 46,1000 H0Z'
const ROCA_DER = 'M360,0 H300 C320,80 292,150 314,230 C332,300 300,370 318,450 C334,530 298,600 316,680 C330,760 300,840 318,915 C326,955 306,985 314,1000 H360Z'

export default function Fondo() {
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id="suelo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6ebc0" />
          <stop offset="1" stopColor="#c2dfa8" />
        </linearGradient>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ccaf0" />
          <stop offset="1" stopColor="#8ccaf0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="roca-izq" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c46a38" />
          <stop offset="1" stopColor="#e8a468" />
        </linearGradient>
        <linearGradient id="roca-der" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#c46a38" />
          <stop offset="1" stopColor="#e8a468" />
        </linearGradient>
      </defs>

      <rect width="360" height="1000" fill="url(#suelo)" />
      <rect width="360" height="110" fill="url(#cielo)" />

      {/* El río, con sus orillas de piedra clara. */}
      <path d={RIO} fill="none" stroke="#ece5d3" strokeWidth="46" strokeLinecap="round" />
      <path d={RIO} fill="none" stroke="#5fd0c6" strokeWidth="28" strokeLinecap="round" />
      <path d={RIO} fill="none" stroke="#9fe9e0" strokeWidth="10" strokeLinecap="round" />
      <path d={RIO} fill="none" stroke="#e6fbf8" strokeWidth="2" strokeDasharray="14 30" strokeLinecap="round" />

      {MATAS.map((m, i) => (
        <g key={i} fill={m.color} opacity=".85">
          <circle cx={m.x - m.r * 0.7} cy={m.y + m.r * 0.2} r={m.r * 0.75} />
          <circle cx={m.x + m.r * 0.7} cy={m.y + m.r * 0.2} r={m.r * 0.75} />
          <circle cx={m.x} cy={m.y - m.r * 0.3} r={m.r} />
        </g>
      ))}
      {CHOPOS.map((c, i) => (
        <g key={i} transform={`translate(${c.x},${c.y})`}>
          <rect x="-1.5" y="0" width="3" height="14" fill="#8a6a48" />
          <ellipse cy="-10" rx="8" ry="20" fill="#5f9e47" />
          <ellipse cx="-2" cy="-14" rx="4" ry="12" fill="#7fbb60" />
        </g>
      ))}

      {/* Paredes de roca a los dos lados, con sus vetas y matas colgando. */}
      <path d={ROCA_IZQ} fill="url(#roca-izq)" />
      <path d={ROCA_DER} fill="url(#roca-der)" />
      <g fill="none" stroke="#b25a2c" strokeWidth="1.5" opacity=".45" strokeLinecap="round">
        {[90, 260, 400, 560, 720, 880].map(y => <path key={y} d={`M4,${y} q16,-8 34,-2`} />)}
        {[150, 330, 490, 640, 800, 950].map(y => <path key={y} d={`M356,${y} q-16,-8 -34,-2`} />)}
      </g>
      <g opacity=".9">
        {[60, 180, 300, 470, 590, 760, 870, 975].map((y, i) => (
          <circle key={y} cx={i % 2 ? 50 : 40} cy={y} r={i % 3 ? 9 : 12} fill={VERDES[i % 4]} />
        ))}
        {[110, 240, 380, 520, 660, 790, 930].map((y, i) => (
          <circle key={y} cx={i % 2 ? 314 : 322} cy={y} r={i % 3 ? 9 : 12} fill={VERDES[(i + 2) % 4]} />
        ))}
      </g>

      <Firma />
    </g>
  )
}

// «Bienvenida a las pasarelas de Alquézar Leyre», con Alquézar tachado. Cada trozo es un <text> aparte
// y se mide con getComputedTextLength (otra vez cuando cargan las fuentes): Safari mide mal los <tspan>
// y el tachado de CSS no se ve igual en todos los móviles.
const X_FIRMA = 18, Y_FIRMA = 22, HUECO = 4

function Firma() {
  const inicio = useRef(null)
  const lugar = useRef(null)
  const [medidas, setMedidas] = useState({ inicio: 150, lugar: 42 })

  useLayoutEffect(() => {
    const medir = () => {
      if (!inicio.current || !lugar.current) return
      setMedidas({ inicio: inicio.current.getComputedTextLength(), lugar: lugar.current.getComputedTextLength() })
    }
    medir()
    document.fonts?.ready.then(medir)
  }, [])

  const xLugar = X_FIRMA + medidas.inicio + HUECO
  const xNombre = xLugar + medidas.lugar + HUECO
  return (
    <g className="firma">
      <text ref={inicio} x={X_FIRMA} y={Y_FIRMA}>Bienvenida a las pasarelas de</text>
      <text ref={lugar} x={xLugar} y={Y_FIRMA}>Alquézar</text>
      <line x1={xLugar - 1} x2={xLugar + medidas.lugar + 1} y1={Y_FIRMA - 4} y2={Y_FIRMA - 4} className="firma-raya" />
      <text x={xNombre} y={Y_FIRMA} className="firma-nombre">Leyre</text>
    </g>
  )
}
