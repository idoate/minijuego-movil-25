import { useRef, useState } from 'react'
import { useResultado } from './bucle.js'

// Ningún nombre de lugar: solo frío o caliente.
function pista(distancia, radio) {
  if (distancia <= radio) return { texto: '¡Aquí!', clase: 'aqui' }
  if (distancia <= radio * 2.5) return { texto: '¡Caliente!', clase: 'caliente' }
  if (distancia <= radio * 5) return { texto: 'Templado...', clase: 'templado' }
  return { texto: 'Frío, frío', clase: 'frio' }
}

export default function Brujula({ config, onSuperar }) {
  const { imagen, objetivo, radio } = config
  const mapa = useRef(null)
  const [toque, setToque] = useState(null) // { x, y } en %, y la pista
  const encontrado = toque?.pista.clase === 'aqui'

  useResultado(encontrado, onSuperar, 1600)

  function tocar(e) {
    if (encontrado) return
    const r = mapa.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    // Distancia en % del ancho, para que no la deforme la proporción del mapa.
    const dx = x - objetivo.x
    const dy = ((y - objetivo.y) * r.height) / r.width
    setToque({ x, y, pista: pista(Math.hypot(dx, dy), radio) })
  }

  return (
    <div className="brujula">
      <h2>¿Hacia dónde vamos?</h2>
      <p className="instrucciones">Toca el mapa: te diré si estás frío o caliente</p>
      <div className="brujula-mapa" ref={mapa} onPointerDown={tocar}>
        <img src={imagen} alt="Mapa sin nombres" draggable="false" />
        {toque && (
          <span className={`marca ${toque.pista.clase}`} style={{ left: `${toque.x}%`, top: `${toque.y}%` }}>
            {encontrado ? '❤️' : ''}
          </span>
        )}
      </div>
      <p className={`aviso brujula-pista ${toque?.pista.clase ?? ''}`}>{toque ? toque.pista.texto : ' '}</p>
    </div>
  )
}
