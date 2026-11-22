// Iconos propios de Bikesunrise para los bloques de información de artículos y reseñas.
// Dibujados a mano en una retícula de 32 px: trazo de tinta (currentColor) algo irregular, como el
// de los mapas y las cabeceras, y un acento de color (var(--bs-acento)) en un solo detalle.
// En el HTML del contenido se escriben como <i class="bs-i" data-i="nombre"></i>; ArticleBody los
// sustituye por el SVG.

const T = 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';
const A = 'fill="var(--bs-acento,#b55332)"';
const svg = (cuerpo: string) => `<svg class="bs-icono" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${cuerpo}</svg>`;

export const ICONOS: Record<string, string> = {
  // consejo: farolillo de acampada con la llama encendida
  consejo: svg(`<path ${T} d="M12.2 9.2c.3-2.6 1.8-4 3.9-4s3.6 1.4 3.8 4"/><path ${T} d="M10.6 9.4h10.9M11.3 9.6c-.6 4.3-.5 9.6.2 14.3m9.3-14.3c.6 4.3.5 9.6-.2 14.3"/><path ${T} d="M10.4 24.1c3.6.6 7.4.6 11.2-.1M12.1 27.2h7.9"/><path ${A} d="M16 12.6c1.7 1.7 2.4 3.2 2.1 4.6-.3 1.4-1.1 2.2-2.2 2.2s-2-.8-2.2-2.1c-.2-1.4.6-3 2.3-4.7z"/>`),
  // aviso: señal de peligro clavada en el suelo
  aviso: svg(`<path ${T} d="M16.1 4.4c-2.7 4.7-5.6 9.6-8.6 14.6 5.8.3 11.4.3 17.1-.1-2.6-4.8-5.4-9.6-8.5-14.5z"/><path ${T} d="M16 19.2v8.6M12.3 28c2.4-.4 5-.4 7.5 0"/><path ${A} d="M15.2 9.6h1.7l-.3 4.9h-1.1zM16 15.6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>`),
  // experiencia: cuaderno de viaje abierto con un lápiz
  experiencia: svg(`<path ${T} d="M4.6 8.1c3.7-.9 7.4-.4 11.3 1.8 3.8-2.2 7.6-2.7 11.4-1.8l-.3 15.8c-3.8-.8-7.5-.3-11.1 1.9-3.7-2.2-7.4-2.7-11.1-1.9z"/><path ${T} d="M15.9 9.9v15.5M7.7 12.4c1.9-.3 3.8 0 5.6.8M7.7 16c1.9-.3 3.8 0 5.6.8"/><path ${A} d="M19.6 18.9l5.8-7.4 1.6 1.2-5.7 7.5-2.2.8z"/>`),
  // resumen: brújula
  resumen: svg(`<path ${T} d="M16.2 4.8c6.3-.2 11.1 4.6 11 11.1-.1 6.4-4.9 11.1-11.2 11.1C9.8 27 4.9 22.3 4.9 16 4.9 9.7 9.8 5 16.2 4.8z"/><path ${T} d="M16 7.3v2M16 22.7v2M7.4 16h2M22.6 16h2"/><path ${A} d="M19.9 12.1l-2.6 5.3-5.2 2.6 2.6-5.3z"/>`),
  // ficha: etiqueta de equipaje con cordel
  ficha: svg(`<path ${T} d="M9.3 5.4l13.6.1c.6 0 1 .4 1 1l-.2 19.9c0 .6-.4 1-1 1H9.1c-.6 0-1-.4-1-1l.2-19.9c0-.6.4-1.1 1-1.1z"/><path ${T} d="M12 13.4h8.2M12 17.3h8.2M12 21.2h5.3"/><path ${T} d="M16.1 5.5c-.4-2.1.9-3.1 2.4-2.6"/><circle ${A} cx="16.1" cy="8.9" r="1.4"/>`),
  // pros: pulgar hacia arriba con guante
  pros: svg(`<path ${T} d="M10.2 14.1l4.4-7.6c.5-.9 1.8-1 2.4-.1.5.7.5 1.6.2 2.4l-1.3 3.9h6.9c1.5 0 2.5 1.4 2.1 2.8l-2.1 8.4c-.3 1.1-1.3 1.8-2.4 1.8h-10z"/><path ${T} d="M5.2 14.4h4.9l.2 11.5H5.1z"/><circle ${A} cx="7.6" cy="22.6" r="1.2"/>`),
  // contras: pulgar hacia abajo
  contras: svg(`<path ${T} d="M10.2 17.9l4.4 7.6c.5.9 1.8 1 2.4.1.5-.7.5-1.6.2-2.4l-1.3-3.9h6.9c1.5 0 2.5-1.4 2.1-2.8l-2.1-8.4c-.3-1.1-1.3-1.8-2.4-1.8h-10z"/><path ${T} d="M5.2 17.6h4.9l.2-11.5H5.1z"/><circle ${A} cx="7.6" cy="9.4" r="1.2"/>`),
  // distancia: camino que serpentea entre dos puntos
  distancia: svg(`<path ${T} d="M7.3 25.8c3.6-.9 5.7-2.6 6.1-5.2.5-3.4-4.3-4.3-3.9-7.6.3-2.6 3.4-3.6 7.1-3.4 3.4.2 6.3-.9 7.5-3.3" stroke-dasharray="2.6 3.2"/><path ${T} d="M7.3 21.3c-1.9 0-3.2 1.4-3.2 3.1 0 2.2 3.2 4.7 3.2 4.7s3.2-2.5 3.2-4.7c0-1.7-1.3-3.1-3.2-3.1z"/><path ${A} d="M24.6 2.8c-1.9 0-3.2 1.4-3.2 3.1 0 2.2 3.2 4.7 3.2 4.7s3.2-2.5 3.2-4.7c0-1.7-1.3-3.1-3.2-3.1zm0 2.1a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>`),
  // desnivel: dos montañas con la cima nevada
  desnivel: svg(`<path ${T} d="M2.8 25.9c3.3-5.9 6.9-11.9 10.9-17.9 3.1 4.4 5.9 9 8.6 13.8M15.7 25.9c2.7-4.6 5.5-9 8.4-13.3 1.9 4.4 3.6 8.8 5.1 13.3M2.6 26.1c9 .4 17.9.4 26.8-.1"/><path ${A} d="M13.7 8c-1.3 1.9-2.5 3.8-3.6 5.7l1.8-.9 1.5 1.3 1.4-1.4 1.6.6c-.9-1.8-1.8-3.6-2.7-5.3z"/>`),
  // dias: el sol saliendo sobre el horizonte (la salida del sol de Bikesunrise)
  dias: svg(`<path ${T} d="M3.4 23.9c8.4.4 16.8.4 25.2-.1M7.9 27.3c5.3.3 10.8.3 16.2 0"/><path ${T} d="M9.7 23.6c-.3-3.8 2.6-6.9 6.3-6.9s6.6 3.1 6.4 6.9"/><path ${T} d="M16 6.9v3.2M7.3 10.6l2.2 2.3M24.7 10.6l-2.2 2.3M3.9 17.6l3 .8M28.1 17.6l-3 .8"/><path ${A} d="M12.4 23.6c0-2.2 1.6-3.9 3.6-3.9s3.6 1.7 3.6 3.9z"/>`),
  // temporada: hoja que cae, con el nervio marcado
  temporada: svg(`<path ${T} d="M24.9 6.1C14.6 5.4 7.6 10.3 7.1 18.8c-.1 1.6.2 3.2.9 4.6 8.9.6 16-4.2 16.9-13.1.1-1.5.1-2.9 0-4.2z"/><path ${T} d="M5.2 27.4c4.2-6.8 9.4-11.9 15.6-15.6"/><path ${A} d="M12.6 16.2c.3 1.6 1.2 2.7 2.9 3.1-1.6.6-3.4.3-4.6-.8.4-.9.9-1.7 1.7-2.3z"/>`),
  // agua: bidón de bici con una gota
  agua: svg(`<path ${T} d="M12.8 4.6h6.5M13.4 4.7c-.1 1.4-.4 2.4-1.2 3.4l-1 1.1c-.6.7-.9 1.6-.9 2.5l.3 13.7c0 1.1.9 1.9 2 1.9h6.9c1.1 0 2-.8 2-1.9l.2-13.7c0-.9-.3-1.8-.9-2.5l-1-1.1c-.8-1-1.1-2-1.2-3.4"/><path ${T} d="M10.6 13.7c3.6.5 7.2.5 10.9 0"/><path ${A} d="M16 16.4c1.6 2 2.5 3.4 2.5 4.6 0 1.4-1.1 2.4-2.5 2.4s-2.5-1-2.5-2.4c0-1.2.9-2.6 2.5-4.6z"/>`),
  // dormir: tienda de campaña con la puerta abierta
  dormir: svg(`<path ${T} d="M3.3 25.6c4.3-6.4 8.4-12.9 12.6-19.6 4.4 6.6 8.6 13.1 12.7 19.6M2.6 25.8c9 .3 17.9.3 26.8 0"/><path ${T} d="M15.9 6.1l-.6 19.5"/><path ${A} d="M15.9 13.1c1.9 3.9 3.6 8.1 5 12.5h-5.4z"/><path ${T} d="M14.1 4.1l1.8 2 1.9-2.1"/>`),
  // cocina: hornillo con un cazo humeante
  cocina: svg(`<path ${T} d="M7.4 14.1h17.2l-.6 6.6c-.1 1.1-1 1.9-2.1 1.9H10.1c-1.1 0-2-.8-2.1-1.9zM24.6 15.4l3.9-.9"/><path ${T} d="M9.4 26.9l2.4-4.3M22.6 26.9l-2.4-4.3M16 22.7v4.3"/><path ${T} d="M12.6 10.6c-.9-1.4.9-2.1 0-3.7M16.2 10.6c-.9-1.4.9-2.1 0-3.7M19.8 10.6c-.9-1.4.9-2.1 0-3.7"/><path ${A} d="M13.2 25.3c1.6-.7 2.3-2 2.8-3 .6 1 1.3 2.3 2.8 3z"/>`),
  // peso: báscula de gancho con la pesa
  peso: svg(`<path ${T} d="M16 3.8v3.1M13.6 6.9h4.8"/><path ${T} d="M11.4 11.1c.7-2.6 2.4-4 4.6-4s3.9 1.4 4.6 4"/><path ${T} d="M9.6 11.2l12.9-.1c.7 0 1.2.5 1.3 1.2l1.8 12.6c.2 1.2-.8 2.3-2 2.3H8.4c-1.2 0-2.2-1.1-2-2.3l1.9-12.5c.1-.7.6-1.2 1.3-1.2z"/><path ${A} d="M9.1 19.4h13.8l.9 5.8c.1.6-.4 1.1-1 1.1H9.2c-.6 0-1.1-.5-1-1.1z"/>`),
  // precio: etiqueta de precio atada con cordel
  precio: svg(`<path ${T} d="M16.8 4.9l9.9.1c.7 0 1.3.6 1.3 1.3l.1 9.9c0 .5-.2 1-.6 1.3L16.6 28.1c-.5.5-1.4.5-1.9 0L4 17.4c-.5-.5-.5-1.4 0-1.9L15.5 5.4c.4-.3.8-.5 1.3-.5z"/><path ${T} d="M22.2 7.9c1.6-2.4 3.6-3.5 5.9-3.2"/><circle ${A} cx="22.2" cy="9.9" r="1.9"/><path ${T} d="M10.9 16.6l5.3 5.3M13.6 13.9l5.3 5.3"/>`),
  // bici: bicicleta de cicloturismo con alforja
  bici: svg(`<circle ${T} cx="8" cy="21.3" r="5.4"/><circle ${T} cx="24.1" cy="21.3" r="5.4"/><path ${T} d="M8 21.3l5.2-9.4h8.3l2.6 9.4M13.2 11.9l3.6 9.4h-8.8M21.5 11.9l-4.7 9.4M11.6 9.1h3.4M21.5 11.9l-.6-3.3 2.6-.3"/><path ${A} d="M3.7 11.6h5.7l.6 5.3H4.4z"/>`),
  // mapa: mapa plegado en tres con la ruta marcada
  mapa: svg(`<path ${T} d="M4.3 7.6l7.1-2.4 9.2 2.6 7.1-2.4.2 18.9-7.2 2.5-9.2-2.6-7.2 2.4z"/><path ${T} d="M11.4 5.3l-.1 18.8M20.6 7.8l.1 18.9"/><path ${A} d="M6.5 19.7c2-2.8 4.4-2.4 6.4-4.2 1.9-1.7 2.5-4.1 5.3-4.4 2.2-.2 3.6 1 5.6.5l.5 1.6c-2.4.6-4-.6-5.9-.4-2 .2-2.4 2.1-4.4 3.9-2.3 2-4.8 1.8-6.4 4z"/>`),
  // seguro: escudo con una cruz de primeros auxilios
  seguro: svg(`<path ${T} d="M16.1 3.9c3 2.3 6.6 3.4 10.3 3.6-.1 9.7-3.6 16.2-10.4 20.6C9.3 23.7 5.8 17.2 5.6 7.5c3.8-.2 7.3-1.3 10.5-3.6z"/><path ${A} d="M14.5 10.9h3.1v3.4H21v3.1h-3.4v3.4h-3.1v-3.4h-3.4v-3.1h3.4z"/>`),
  // pregunta: bocadillo de conversación con interrogante
  pregunta: svg(`<path ${T} d="M6.2 6.5c6.6-1.2 13.2-1.2 19.7 0 1.1.2 1.9 1.2 1.9 2.3l-.1 10.6c0 1.1-.8 2-1.9 2.2-3.4.6-6.8.9-10.2.9L9.9 26.8l.4-4.6c-1.4-.1-2.8-.3-4.2-.5-1.1-.2-1.9-1.1-1.9-2.2l.1-10.7c0-1.1.8-2.1 1.9-2.3z"/><path ${A} d="M13.1 11.3c.4-1.8 1.6-2.7 3.2-2.7 1.9 0 3.3 1.2 3.3 2.9 0 1.4-.8 2.1-1.8 2.8-.8.5-1 .9-1 1.7h-1.7c0-1.4.4-2.2 1.5-2.9.8-.5 1.2-.9 1.2-1.6 0-.8-.6-1.3-1.5-1.3-.8 0-1.4.5-1.6 1.4zm2.9 6.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/>`),
};

/** Sustituye <i class="bs-i" data-i="nombre"></i> por el SVG del icono. */
export function conIconos(html: string): string {
  return html.replace(/<i class="bs-i" data-i="([a-z]+)"><\/i>/g, (m, n) => ICONOS[n] ?? '');
}
