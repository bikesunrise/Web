// Fondo común de los mapas de la web: estilo «Positron» de OpenFreeMap, un mapa vectorial muy limpio
// (casi gris) sobre el que destaca la ruta. Es gratuito y no necesita clave. Se pinta con MapLibre
// dentro del mapa de Leaflet, así que capas, puntos y perfil siguen funcionando igual.
import type * as Leaflet from 'leaflet';

export const ESTILO_MAPA = 'https://tiles.openfreemap.org/styles/positron';
const ATRIBUCION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> · Datos © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>';

export async function fondoMapa(L: typeof Leaflet, mapa: Leaflet.Map) {
  // El complemento busca maplibregl como variable global.
  (window as any).maplibregl = (await import('maplibre-gl')).default;
  await import('@maplibre/maplibre-gl-leaflet');
  (L as any).maplibreGL({ style: ESTILO_MAPA, attribution: ATRIBUCION }).addTo(mapa);
}
