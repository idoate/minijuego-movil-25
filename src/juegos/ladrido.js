// Ladrido de Summer sintetizado con Web Audio: sin ficheros de sonido.
// Los móviles solo dejan sonar audio tras un toque, así que se llama siempre desde un toque.
let contexto = null

function guau(ctx, cuando, tono) {
  // Un golpe de voz: diente de sierra que cae de tono, filtrado para que suene grave.
  const voz = ctx.createOscillator()
  voz.type = 'sawtooth'
  voz.frequency.setValueAtTime(520 * tono, cuando)
  voz.frequency.exponentialRampToValueAtTime(190 * tono, cuando + 0.13)

  // Un poco de ruido para que no suene a pitido.
  const ruido = ctx.createBufferSource()
  const datos = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate)
  const canal = datos.getChannelData(0)
  for (let i = 0; i < canal.length; i++) canal[i] = Math.random() * 2 - 1
  ruido.buffer = datos

  const filtro = ctx.createBiquadFilter()
  filtro.type = 'lowpass'
  filtro.frequency.setValueAtTime(1400, cuando)
  filtro.Q.value = 4

  const volumen = ctx.createGain()
  volumen.gain.setValueAtTime(0.0001, cuando)
  volumen.gain.exponentialRampToValueAtTime(0.5, cuando + 0.015)
  volumen.gain.exponentialRampToValueAtTime(0.0001, cuando + 0.16)

  const volumenRuido = ctx.createGain()
  volumenRuido.gain.value = 0.25

  voz.connect(filtro)
  ruido.connect(volumenRuido).connect(filtro)
  filtro.connect(volumen).connect(ctx.destination)
  voz.start(cuando)
  ruido.start(cuando)
  voz.stop(cuando + 0.18)
  ruido.stop(cuando + 0.18)
}

export function ladrar(veces = 2) {
  try {
    contexto ??= new (window.AudioContext || window.webkitAudioContext)()
    contexto.resume?.()
    const ahora = contexto.currentTime + 0.02
    for (let i = 0; i < veces; i++) guau(contexto, ahora + i * 0.22, 1 + (i % 2) * 0.08)
  } catch {
    // Sin audio, el juego sigue igual.
  }
}
