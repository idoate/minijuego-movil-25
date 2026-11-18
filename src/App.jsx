import { useState } from 'react'
import Camino from './Camino.jsx'
import { CONTRASENA, DIAS, FINAL, INICIO, MALETA, MENSAJE_INICIAL } from './contenido.js'
import { estadoEtapa, fechaLarga, fechaSimulada, guardarProgreso, hoy, leerProgreso, normalizar } from './logica.js'
import Ahorcado from './juegos/Ahorcado.jsx'
import Brujula from './juegos/Brujula.jsx'
import Maleta from './juegos/Maleta.jsx'
import Memory from './juegos/Memory.jsx'
import Ordena from './juegos/Ordena.jsx'
import Ovejas from './juegos/Ovejas.jsx'
import Wordle from './juegos/Wordle.jsx'

const JUEGOS = {
  ordena: Ordena, ahorcado: Ahorcado, maleta: Maleta, wordle: Wordle, ovejas: Ovejas, brujula: Brujula, memory: Memory,
}

export default function App() {
  const [progreso, setProgreso] = useState(leerProgreso)
  const [tarjeta, setTarjeta] = useState(null)
  const fecha = hoy()

  function actualizar(cambio) {
    setProgreso(p => {
      const nuevo = { ...p, ...cambio(p) }
      guardarProgreso(nuevo)
      return nuevo
    })
  }

  if (!progreso.entrada) return <Contrasena onEntrar={() => actualizar(() => ({ entrada: true }))} />

  const dia = typeof tarjeta === 'number' ? DIAS[tarjeta] : null
  const carta = tarjeta === null && !progreso.cartaLeida && fecha >= INICIO

  return (
    <main className="pagina">
      {fechaSimulada() && <p className="simulada">🧪 Probando el {fechaLarga(fecha)}</p>}
      <header className="cabecera">
        <h1>Nuestro camino</h1>
        {fecha < INICIO && <p>Tu viaje empieza el 25 de noviembre</p>}
      </header>
      <Camino hoy={fecha} progreso={progreso} onAbrir={setTarjeta} />

      {carta && (
        <Tarjeta onCerrar={() => actualizar(() => ({ cartaLeida: true }))}>
          <article className="carta-inicial">
            <h2>{MENSAJE_INICIAL.titulo}</h2>
            <Foto src={MENSAJE_INICIAL.foto} alt="Nosotros" />
            {MENSAJE_INICIAL.texto.map((p, i) => <p key={i}>{p}</p>)}
          </article>
        </Tarjeta>
      )}

      {dia && (
        <Tarjeta onCerrar={() => setTarjeta(null)}>
          <p className="antetitulo">Etapa {tarjeta + 1} · {fechaLarga(dia.fecha)}</p>
          <Etapa
            key={dia.fecha}
            dia={dia}
            estado={estadoEtapa(dia.fecha, fecha, progreso)}
            onSuperar={() => actualizar(p => ({ superados: [...p.superados, dia.fecha] }))}
            onFallar={() => actualizar(p => ({ fallados: [...p.fallados, dia.fecha] }))}
          />
        </Tarjeta>
      )}

      {tarjeta === 'maleta' && (
        <Tarjeta onCerrar={() => setTarjeta(null)}>
          {fecha >= MALETA.fecha ? (
            <article className="pista">
              <h2>{MALETA.titulo}</h2>
              {MALETA.texto.map((p, i) => <p key={i}>{p}</p>)}
            </article>
          ) : <Espera texto={`Aún no. Este cartel se abre el ${fechaLarga(MALETA.fecha)}.`} />}
        </Tarjeta>
      )}

      {tarjeta === 'final' && (
        <Tarjeta onCerrar={() => setTarjeta(null)}>
          {fecha >= FINAL.fecha ? <Final /> : <Espera texto={`Aquí te espero el ${fechaLarga(FINAL.fecha)}.`} />}
        </Tarjeta>
      )}
    </main>
  )
}

function Contrasena({ onEntrar }) {
  const [valor, setValor] = useState('')
  const [error, setError] = useState(false)

  function enviar(e) {
    e.preventDefault()
    if (normalizar(valor) === normalizar(CONTRASENA)) onEntrar()
    else setError(true)
  }

  return (
    <main className="pagina entrada">
      <Corazon />
      <h1>¿Dónde surgió la chispa?</h1>
      <form onSubmit={enviar}>
        <input
          value={valor}
          onChange={e => { setValor(e.target.value); setError(false) }}
          autoCapitalize="none"
          autoComplete="off"
          aria-label="Contraseña"
        />
        <button className="boton">Entrar</button>
      </form>
      {error && <p className="aviso">Casi... prueba otra vez</p>}
    </main>
  )
}

function Corazon() {
  return (
    <svg viewBox="-8 -8 16 16" className="corazon-grande" aria-hidden="true">
      <path className="corazon" d="M0,-1 C0,-5 -6,-6 -6,-1.5 C-6,2 -2,4.5 0,7 C2,4.5 6,2 6,-1.5 C6,-6 0,-5 0,-1Z" />
    </svg>
  )
}

function Tarjeta({ children, onCerrar }) {
  return (
    <div className="velo">
      <section className="tarjeta">
        {children}
        <button className="boton secundario" onClick={onCerrar}>Volver al mapa</button>
      </section>
    </div>
  )
}

function Etapa({ dia, estado, onSuperar, onFallar }) {
  if (estado === 'jugar') {
    const Juego = JUEGOS[dia.juego]
    return Juego
      ? <Juego config={dia.config} onSuperar={onSuperar} onFallar={onFallar} />
      : <Espera texto="En preparación" />
  }
  if (estado === 'fallada') return <Espera icono="🌙" texto="Mañana verás esta pista" />
  if (estado === 'cerrada') return <Espera texto={`Aún no. Esta etapa se abre el ${fechaLarga(dia.fecha)}.`} />

  const { titulo, texto, foto, nota } = dia.pista
  return (
    <article className="pista">
      <h2>{titulo}</h2>
      <Foto src={foto} alt={titulo} />
      <p>{texto}</p>
      {nota && <p className="nota">{nota}</p>}
    </article>
  )
}

function Espera({ icono = '⏳', texto }) {
  return (
    <div className="espera">
      <span className="espera-icono">{icono}</span>
      <p>{texto}</p>
    </div>
  )
}

function Final() {
  return (
    <article className="pista final">
      <h2>{FINAL.nombre}</h2>
      {FINAL.texto.map((p, i) => <p key={i}>{p}</p>)}
      {FINAL.video && (
        <iframe
          className="video"
          src={`https://www.youtube-nocookie.com/embed/${FINAL.video.id}?start=${FINAL.video.inicio}&rel=0`}
          title="Vídeo del sitio"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
      <div className="galeria">
        {FINAL.fotos.map(f => <Foto key={f.src} src={f.src} alt={f.alt} />)}
      </div>
      <h3>Lo que llevamos andado</h3>
      <div className="collage">
        {FINAL.andado.map(src => <Foto key={src} src={src} alt="" />)}
      </div>
    </article>
  )
}

// Si una foto falta, no se pinta el icono roto.
function Foto({ src, alt }) {
  return <img src={src} alt={alt} loading="lazy" onError={e => { e.currentTarget.hidden = true }} />
}
