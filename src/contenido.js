// Todos los textos del juego. Cada push a main despliega, así que se puede corregir durante el juego.
// Ojo: antes del 2-dic no debe salir en pantalla ningún nombre de lugar. El nombre solo vive en FINAL.

export const CONTRASENA = 'Rincón de Palla'

export const INICIO = '2026-11-25'

// Carta del 25: se abre sola la primera vez que entra desde ese día.
export const MENSAJE_INICIAL = {
  titulo: 'Para ti, Maitia',
  foto: 'media/carta.jpg',
  texto: [
    'Bueno, Maitia, ha llegado el día de tu cumple, y más que pensar cómo igualar el regalo que me hiciste (es imposible), me he vuelto un poco loco intentando darte lo mínimo que te mereces.',
    'Eres increíble, y por eso te mereces descubrir las cosas de la forma más apasionante y divertida posible. Tu regalo físico empieza el 2 de diciembre a las 10:30, pero hasta entonces vas a poder ir descubriendo todo lo necesario gracias a esta web. ¡De aquí en adelante te va a enganchar más que Instagram!',
    'Que sepas que esto es 100 % casero y que lo he hecho con toda la ilusión del mundo, porque te mereces todo y más. Quédate con los detalles y abre bien los ojos, ¡que vienen curvas! Te quiero mucho ❤️',
  ],
}

export const DIAS = [
  {
    fecha: '2026-11-25',
    juego: 'ordena',
    // En el orden bueno; se pintan barajados.
    config: {
      titulo: 'Ordena nuestros primeros miniviajes',
      items: ['San Sebastián', 'Biarritz', 'Gernika', 'Markalain', 'Elgorriaga'],
    },
    pista: {
      titulo: 'Muy verde',
      texto: 'Salimos de Pamplona, y lo que nos espera es muy, muy verde.',
      foto: 'media/pista-25.jpg',
      nota: 'Esos fueron nuestros primeros miniviajes. Después vinieron muchos más... y el siguiente ya está en camino. ¡Feliz cumple, Maitia!',
    },
  },
  {
    fecha: '2026-11-26',
    juego: 'ahorcado',
    config: { palabra: 'GANDALF' },
    pista: {
      titulo: 'Magia y naturaleza',
      texto: 'Has encontrado el nexo entre la magia y la naturaleza: tus pelis favoritas y tus paseos con Summer. Ojalá encuentres esa misma magia y esa misma naturaleza mientras disfrutas de tu regalo.',
      foto: 'media/pista-26.jpg',
      nota: 'Sin tráfico y sin prisas. Solo tú y yo.',
    },
  },
  {
    fecha: '2026-11-27',
    juego: 'maleta',
    config: { buenos: ['🥾', '🧥', '🧣', '🧤'], malos: ['👠', '👙', '🕶️'], meta: 10, vidas: 3 },
    pista: {
      titulo: 'Botas',
      texto: 'Mete botas de monte y pantalón largo: te harán falta. Aunque no te preocupes, a priori no veremos nieve.',
      foto: 'media/pista-27.jpg',
      nota: 'El bikini... ya descubrirás el último día si hace falta llevarlo. Y los tacones no van a ser tu calzado más usado.',
    },
  },
  {
    fecha: '2026-11-28',
    juego: 'wordle',
    config: { palabra: 'RELAX', oportunidades: 2 },
    pista: {
      titulo: 'Burbujas',
      texto: 'Tus contracturas tienen los días contados, y al final del día te esperan agua caliente y burbujas.',
      foto: 'media/pista-29.jpg',
      nota: 'Con lo que tú me cuidas a mí, ya tocaba que alguien te cuidara a ti.',
    },
  },
  {
    fecha: '2026-11-29',
    juego: 'ovejas',
    config: { ovejas: 5, segundos: 60 },
    pista: {
      titulo: 'Vecinas lanudas',
      texto: 'Antes de que anochezca tendremos un trabajo: acompañar a unas vecinas lanudas a casa.',
      foto: 'media/pista-30.jpg',
      nota: 'Te veo muy capaz con el trabajo nuevo. Yo iré de ayudante.',
    },
  },
  {
    fecha: '2026-11-30',
    juego: 'brujula',
    // Objetivo y radio en % del ancho de la imagen.
    config: { imagen: 'media/brujula.svg', objetivo: { x: 45.8, y: 32.1 }, radio: 5 },
    pista: {
      titulo: 'Mar y montaña',
      texto: 'Donde la montaña baja a mirar el mar. Deja la maleta hecha la noche antes y que no falte el abrigo.',
      foto: 'media/pista-01.jpg',
      nota: 'Ya sabes hacia dónde mirar... pero el nombre todavía no. ¡Que vienen curvas!',
    },
  },
  {
    // La última pista: así da tiempo a confirmar el paseo a caballo o cambiarlo por un plan B.
    fecha: '2026-12-01',
    juego: 'memory',
    config: {
      fotos: ['media/memory-1.jpg', 'media/memory-2.jpg', 'media/memory-3.jpg',
        'media/memory-4.jpg', 'media/memory-5.jpg', 'media/memory-6.jpg'],
    },
    pista: {
      titulo: 'Cuatro patas',
      texto: 'Unos vecinos de cuatro patas querrán conocerte: les darás de comer y, si el cielo deja, alguno te llevará a pasear.',
      foto: 'media/pista-28.jpg',
      nota: 'Alguien por allí tiene muchas ganas de conocerte... y no soy yo, que ya te conozco. Mañana a estas horas ya sabrás el nombre.',
    },
  },
]

// Consejos para hacer la maleta: un cartel en el mapa entre la última parada y la meta, que se abre el 1-dic.
export const MALETA = {
  fecha: '2026-12-01',
  titulo: 'Para la maleta',
  texto: [
    'Mañana salimos de viaje, así que toca hacer la maleta.',
    'El sitio ya lo conoces: está escondido en los juegos. Las actividades también las sabes: tendremos algo de turismo, alguna que otra actividad rural, un poco de deporte… y algún rato para ponernos un poco elegantes.',
    'No te asustes, que no habrá que hacer nada extremo, pero sí nos hace falta un poco de todo.',
    'Y si dudas con algo, pregúntame: estoy autorizado a responderte sí o no a cualquier cosa que quieras meter en la maleta.',
  ],
}

// Summer, el labrador, pasea por el mapa. Si Leyre lo toca, hay que calmarle con sus premios;
// si no lo consigue, vuelve a la salida hasta que lo calme.
export const SUMMER = {
  premios: ['kong', 'pata'], // lamer Philadelphia del Kong y patas de gallina
  prohibidos: ['🍫', '🍇', '🧅'],
  meta: 8,
  segundos: 20,
}

export const FINAL = {
  fecha: '2026-12-02',
  nombre: 'La Montaña Mágica',
  texto: [
    '¡Nos vamos a La Montaña Mágica! Es una casería en un rincón de Llanes, en Asturias, donde la montaña baja a mirar el mar.',
    'Dos noches en la habitación especial (sí, la de las burbujas), caballos, vacas y ovejas que guardar al atardecer, un paseo a caballo si el cielo deja y un masaje solo para ti.',
    'Gracias por cada kilómetro que llevamos andado juntos. Este es el siguiente. Te quiero, Maitia ❤️',
  ],
  fotos: [
    { src: 'media/final-pareja.jpg', alt: 'Nosotros' },
    { src: 'media/final-1.jpg', alt: 'Por fuera' },
    { src: 'media/final-2.jpg', alt: 'Vistas' },
    { src: 'media/final-3.jpg', alt: 'La habitación' },
  ],
  // Vídeo del hotel en YouTube; solo se carga al abrir el final.
  video: { id: '_VaW7reGnu0', inicio: 206 },
  andado: ['media/andado-1.jpg', 'media/andado-2.jpg', 'media/andado-3.jpg', 'media/andado-4.jpg', 'media/andado-5.jpg'],
}
