import { DIAS, FINAL, INICIO } from './contenido.js'

const CLAVE = 'nuestro-camino'
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
  'septiembre', 'octubre', 'noviembre', 'diciembre']

// La fecha de ?fecha=AAAA-MM-DD, para probar cualquier día (también en la web publicada), o null.
export function fechaSimulada() {
  const simulada = new URLSearchParams(location.search).get('fecha')
  return /^\d{4}-\d{2}-\d{2}$/.test(simulada ?? '') ? simulada : null
}

// 'AAAA-MM-DD' en la hora local del móvil, salvo que se simule otra.
export function hoy() {
  const simulada = fechaSimulada()
  if (simulada) return simulada
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Minúsculas, sin acentos ni espacios.
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase()
}

const VACIO = { entrada: false, cartaLeida: false, superados: [], fallados: [] }

export function leerProgreso() {
  try {
    return { ...VACIO, ...JSON.parse(localStorage.getItem(CLAVE)) }
  } catch {
    return { ...VACIO }
  }
}

export function guardarProgreso(progreso) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(progreso))
  } catch {
    // Sin localStorage el juego sigue funcionando; solo se pierde al recargar.
  }
}

// 'cerrada' | 'abierta' | 'fallada' | 'jugar'
export function estadoEtapa(fecha, hoy, progreso) {
  if (fecha > hoy) return 'cerrada'
  if (fecha < hoy || progreso.superados.includes(fecha)) return 'abierta'
  return progreso.fallados.includes(fecha) ? 'fallada' : 'jugar'
}

// -1 antes del 25, 0..6 del 25 al 1, 7 desde el 2-dic.
export function paradaActual(hoy) {
  if (hoy < INICIO) return -1
  if (hoy >= FINAL.fecha) return DIAS.length
  return DIAS.findIndex(d => d.fecha === hoy)
}

export function fechaLarga(fecha) {
  const [, m, d] = fecha.split('-').map(Number)
  return `${d} de ${MESES[m - 1]}`
}

export function fechaCorta(fecha) {
  const [, m, d] = fecha.split('-').map(Number)
  return `${d} ${MESES[m - 1].slice(0, 3)}`
}
