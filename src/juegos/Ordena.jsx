import { useEffect, useState } from 'react'

function barajar(items) {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  // Que no salga ya ordenado.
  return copia.every((x, i) => x === items[i]) ? barajar(items) : copia
}

export default function Ordena({ config, onSuperar }) {
  const { titulo, items } = config
  const [arriba] = useState(() => barajar(items))
  const [fila, setFila] = useState([])
  const [aviso, setAviso] = useState('')
  const ganado = fila.length === items.length && fila.every((x, i) => x === items[i])

  useEffect(() => {
    if (fila.length < items.length) return
    if (ganado) {
      const t = setTimeout(onSuperar, 1400)
      return () => clearTimeout(t)
    }
    const bien = fila.filter((x, i) => x === items[i]).length
    setAviso(`Casi: ${bien} de ${items.length} en su sitio`)
    setFila([])
  }, [fila])

  function colocar(item) {
    setAviso('')
    setFila(f => [...f, item])
  }

  return (
    <div className="ordena">
      <h2>{titulo}</h2>
      <p className="instrucciones">Tócalos del primero al último</p>
      <div className="fichas">
        {arriba.map(item => (
          <button key={item} className="ficha" disabled={fila.includes(item)} onClick={() => colocar(item)}>
            {item}
          </button>
        ))}
      </div>
      <ol className="fila">
        {items.map((_, i) => (
          <li key={i}>
            <span className="numero">{i + 1}</span>
            {fila[i] ? (
              <button className="ficha colocada" disabled={ganado}
                onClick={() => setFila(f => f.filter(x => x !== fila[i]))}>
                {fila[i]}
              </button>
            ) : <span className="hueco" />}
          </li>
        ))}
      </ol>
      {ganado && <p className="aviso bien">¡Perfecto!</p>}
      {aviso && <p className="aviso">{aviso}</p>}
    </div>
  )
}
