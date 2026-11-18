import { useEffect, useState } from 'react'

const INTENTOS = 6
const FILAS_TECLADO = ['QWERTYUIOP', 'ASDFGHJKLÑ', '+ZXCVBNM-']
const ORDEN = { gris: 1, amarilla: 2, verde: 3 }

// Colores de un intento, con letras repetidas bien contadas: primero verdes y luego amarillas con lo que sobra.
function colorear(intento, palabra) {
  const colores = Array(palabra.length).fill('gris')
  const sobran = {}
  ;[...palabra].forEach((l, i) => {
    if (intento[i] === l) colores[i] = 'verde'
    else sobran[l] = (sobran[l] ?? 0) + 1
  })
  ;[...intento].forEach((l, i) => {
    if (colores[i] !== 'verde' && sobran[l]) {
      colores[i] = 'amarilla'
      sobran[l]--
    }
  })
  return colores
}

export default function Wordle({ config, onSuperar, onFallar }) {
  const palabra = config.palabra.toUpperCase()
  const largo = palabra.length
  const oportunidades = config.oportunidades ?? 1
  const [ronda, setRonda] = useState(1)
  const [intentos, setIntentos] = useState([])
  const [actual, setActual] = useState('')
  const ganado = intentos.includes(palabra)
  const sinIntentos = !ganado && intentos.length >= INTENTOS
  const otraOportunidad = sinIntentos && ronda < oportunidades
  const perdido = sinIntentos && !otraOportunidad
  const terminado = ganado || sinIntentos

  useEffect(() => {
    if (!ganado && !perdido) return
    const t = setTimeout(ganado ? onSuperar : onFallar, 1600)
    return () => clearTimeout(t)
  }, [ganado, perdido])

  function otraVez() {
    setRonda(r => r + 1)
    setIntentos([])
    setActual('')
  }

  function pulsar(tecla) {
    if (terminado) return
    if (tecla === '-') setActual(a => a.slice(0, -1))
    else if (tecla === '+') {
      if (actual.length === largo) {
        setIntentos(i => [...i, actual])
        setActual('')
      }
    } else setActual(a => (a.length < largo ? a + tecla : a))
  }

  // También con teclado físico.
  useEffect(() => {
    function alPulsar(e) {
      if (e.key === 'Enter') pulsar('+')
      else if (e.key === 'Backspace') pulsar('-')
      else if (/^[a-zñ]$/i.test(e.key)) pulsar(e.key.toUpperCase())
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  })

  // El mejor color que ha tenido cada letra, para el teclado.
  const teclas = {}
  intentos.forEach(intento => colorear(intento, palabra).forEach((c, i) => {
    const l = intento[i]
    if (!teclas[l] || ORDEN[c] > ORDEN[teclas[l]]) teclas[l] = c
  }))

  const filas = Array.from({ length: INTENTOS }, (_, f) =>
    f < intentos.length ? intentos[f] : f === intentos.length ? actual : '')

  return (
    <div className="wordle">
      <h2>Adivina la palabra</h2>
      <p className="instrucciones">
        {largo} letras, {INTENTOS} intentos
        {oportunidades > 1 && ` · oportunidad ${ronda} de ${oportunidades}`}
      </p>
      <div className="rejilla">
        {filas.map((fila, f) => {
          const colores = f < intentos.length ? colorear(fila, palabra) : []
          return (
            <div key={f} className="fila-wordle">
              {Array.from({ length: largo }, (_, i) => (
                <span key={i} className={`casilla ${colores[i] ?? ''} ${fila[i] ? 'llena' : ''}`}>{fila[i]}</span>
              ))}
            </div>
          )
        })}
      </div>
      {ganado && <p className="aviso bien">¡Bien hecho!</p>}
      {otraOportunidad && (
        <>
          <p className="aviso">Se acabaron los intentos... ¡pero te queda otra oportunidad!</p>
          <button className="boton" onClick={otraVez}>¡Otra vez!</button>
        </>
      )}
      {perdido && <p className="aviso">Se acabaron los intentos</p>}
      <div className="teclado-wordle">
        {FILAS_TECLADO.map(fila => (
          <div key={fila}>
            {[...fila].map(t => (
              <button key={t} className={`${teclas[t] ?? ''} ${t === '+' || t === '-' ? 'ancha' : ''}`}
                onClick={() => pulsar(t)} aria-label={t === '+' ? 'Enviar' : t === '-' ? 'Borrar' : t}>
                {t === '+' ? 'Enviar' : t === '-' ? '⌫' : t}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
