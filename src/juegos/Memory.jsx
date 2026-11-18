import { useEffect, useState } from 'react'

function barajar(items) {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export default function Memory({ config, onSuperar }) {
  const [cartas] = useState(() => barajar([...config.fotos, ...config.fotos]))
  const [vistas, setVistas] = useState([]) // índices boca arriba sin emparejar (0, 1 o 2)
  const [parejas, setParejas] = useState([]) // fotos ya emparejadas
  const ganado = parejas.length === config.fotos.length

  useEffect(() => {
    if (vistas.length < 2) return
    const [a, b] = vistas
    if (cartas[a] === cartas[b]) {
      setParejas(p => [...p, cartas[a]])
      setVistas([])
      return
    }
    const t = setTimeout(() => setVistas([]), 900)
    return () => clearTimeout(t)
  }, [vistas])

  useEffect(() => {
    if (!ganado) return
    const t = setTimeout(onSuperar, 1400)
    return () => clearTimeout(t)
  }, [ganado])

  function voltear(i) {
    if (vistas.length === 2 || vistas.includes(i) || parejas.includes(cartas[i])) return
    setVistas(v => [...v, i])
  }

  return (
    <div className="memory">
      <h2>Busca las parejas</h2>
      <div className="cartas">
        {cartas.map((foto, i) => {
          const arriba = vistas.includes(i) || parejas.includes(foto)
          return (
            <button key={i} className={`carta ${arriba ? 'arriba' : ''}`} onClick={() => voltear(i)}
              aria-label={arriba ? 'Carta descubierta' : 'Carta tapada'}>
              <span className="dorso">❤</span>
              <img src={foto} alt="" />
            </button>
          )
        })}
      </div>
      {ganado && <p className="aviso bien">¡Todas!</p>}
    </div>
  )
}
