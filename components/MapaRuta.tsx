'use client';
// Mapa interactivo para artículos de ruta (Leaflet con fondo Positron de OpenFreeMap, ver lib/mapaBase.ts): varios tramos con su color y leyenda,
// puntos con su kilómetro y, si hay datos, el perfil de altitud enlazado al mapa.
// Se inserta en el contenido con <div class="bs-mapa-ruta" data-mapa="…"></div> (lib/mapas.ts).
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fondoMapa } from '@/lib/mapaBase';
import { Perfil, type Punto, type Poi } from '@/components/GuiaRuta';

export type DatosMapa = {
  // puntos: una línea, o varias piezas (rutas largas como las EuroVelo, con cortes y variantes)
  segmentos: { nombre: string; color: string; discontinuo?: boolean; puntos: [number, number][] | [number, number][][] }[];
  pois: { nombre: string; km?: string | number | null; lat: number; lon: number; tipo?: string }[];
  perfil?: Punto[];
  nota?: string;
};
const COLOR: Record<string, string> = { tunel: '#4a3f35', viaducto: '#2f6f8f' };

export default function MapaRuta({ datos }: { datos: DatosMapa }) {
  const ref = useRef<HTMLDivElement>(null);
  const marcador = useRef<any>(null);
  const [km, setKm] = useState<number | null>(null);
  useEffect(() => {
    let mapa: any;
    (async () => {
      const L = (await import('leaflet')).default;
      if (!ref.current || (ref.current as any)._leaflet_id) return;
      mapa = L.map(ref.current, { scrollWheelZoom: false, zoomSnap: 0.25 });
      await fondoMapa(L, mapa);
      // Rutas de escala europea: línea más fina para que no tape el mapa
      const fina = datos.segmentos.some((s) => Array.isArray(s.puntos[0]?.[0]));
      for (const s of datos.segmentos) L.polyline(s.puntos as any, { color: '#fff', weight: fina ? 6 : 9, opacity: 0.9 }).addTo(mapa);
      const capas = datos.segmentos.map((s) => L.polyline(s.puntos as any, { color: s.color, weight: fina ? 3 : 5, opacity: 0.95, dashArray: s.discontinuo ? '8 8' : undefined }).bindTooltip(s.nombre).addTo(mapa));
      mapa.fitBounds(L.featureGroup(capas).getBounds(), { padding: [20, 20] });
      for (const p of datos.pois) {
        const menor = p.tipo === 'tunel' || p.tipo === 'viaducto';
        L.circleMarker([p.lat, p.lon], { radius: menor ? 4 : 6.5, color: '#fff', weight: menor ? 1.5 : 2.5, fillColor: COLOR[p.tipo || ''] || '#1f3328', fillOpacity: 1 })
          .bindTooltip(p.km != null && p.km !== '' ? `${p.nombre} · km ${p.km}` : p.nombre).addTo(mapa);
      }
      if (datos.perfil) marcador.current = L.circleMarker([datos.perfil[0][0], datos.perfil[0][1]], { radius: 7, color: '#fff', weight: 3, fillColor: '#1f3328', fillOpacity: 0, opacity: 0 }).addTo(mapa);
    })();
    return () => { if (mapa) mapa.remove(); };
  }, [datos]);
  useEffect(() => {
    if (!marcador.current || !datos.perfil) return;
    if (km == null) { marcador.current.setStyle({ fillOpacity: 0, opacity: 0 }); return; }
    const p = datos.perfil.reduce((a, b) => (Math.abs(b[2] - km) < Math.abs(a[2] - km) ? b : a));
    marcador.current.setLatLng([p[0], p[1]]).setStyle({ fillOpacity: 1, opacity: 1 });
  }, [km, datos]);
  const pueblos: Poi[] = datos.pois.filter((p) => !p.tipo && p.km != null).map((p) => ({ tipo: 'pueblo', nombre: p.nombre, km: Number(String(p.km).replace(',', '.')), lat: p.lat, lon: p.lon }));
  return (
    <figure className="bs-mapa-ruta-fig guia-ruta">
      <div ref={ref} className="bs-mapa-ruta-map" aria-label="Mapa interactivo de la ruta" />
      {datos.perfil && <Perfil track={datos.perfil} pueblos={pueblos} km={km} onKm={setKm} />}
      <figcaption>
        <ul>
          {datos.segmentos.map((s) => <li key={s.nombre}><i style={{ background: s.color, opacity: s.discontinuo ? 0.6 : 1 }} />{s.nombre}</li>)}
          {datos.pois.some((p) => p.tipo === 'tunel') && <li><b style={{ background: COLOR.tunel }} />Túneles</li>}
          {datos.pois.some((p) => p.tipo === 'viaducto') && <li><b style={{ background: COLOR.viaducto }} />Viaductos</li>}
        </ul>
        <p>{datos.nota || 'Toca un punto o un tramo para ver su nombre.'} Traza: © colaboradores de OpenStreetMap (ODbL).</p>
      </figcaption>
    </figure>
  );
}
