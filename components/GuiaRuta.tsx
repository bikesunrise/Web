'use client';
// Guía de ruta al estilo de las fichas de bikepacking.com: barra de datos, dificultad por partes, mapa
// interactivo (Leaflet + OpenTopoMap) con puntos de interés, perfil de desnivel enlazado al mapa,
// pestañas de recomendaciones y lista de lugares por kilómetro. Datos en data/guias/<ruta>.json.
import { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { ICONOS, conIconos } from '@/lib/iconos';

type Punto = [number, number, number, number]; // lat, lon, km, altitud
type Poi = { tipo: string; nombre: string; km: number; lat: number; lon: number };
export type Guia = {
  track: Punto[];
  pois: Poi[];
  ficha: {
    stats: [string, string, string, string][];
    dificultad: { total: number; partes: [string, number, string][] };
    dificultad_texto: string;
    pestanas: { id: string; titulo: string; icono: string; html: string }[];
  };
};

const TIPO: Record<string, { nombre: string; icono: string; color: string }> = {
  pueblo: { nombre: 'Pueblos', icono: 'mapa', color: '#294334' },
  agua: { nombre: 'Fuentes', icono: 'agua', color: '#2f6f8f' },
  taller: { nombre: 'Tiendas y talleres de bicis', icono: 'bici', color: '#b55332' },
  camping: { nombre: 'Campings', icono: 'dormir', color: '#4f7a52' },
  albergue: { nombre: 'Albergues', icono: 'dormir', color: '#7a5b2f' },
  mirador: { nombre: 'Miradores', icono: 'resumen', color: '#6b4f8a' },
};
const Icono = ({ n }: { n: string }) => <span className="gr-ico" dangerouslySetInnerHTML={{ __html: ICONOS[n] ?? '' }} />;

function Perfil({ track, onKm, km }: { track: Punto[]; onKm: (km: number | null) => void; km: number | null }) {
  const W = 1000, H = 190, P = 34;
  const max = Math.max(...track.map((p) => p[3])), min = Math.min(...track.map((p) => p[3]));
  const top = Math.ceil((max + 50) / 100) * 100, base = Math.max(0, Math.floor((min - 20) / 100) * 100);
  const total = track[track.length - 1][2];
  const x = (k: number) => P + (k / total) * (W - P - 8);
  const y = (a: number) => 10 + (1 - (a - base) / (top - base)) * (H - 40);
  const linea = track.map((p, i) => `${i ? 'L' : 'M'}${x(p[2]).toFixed(1)},${y(p[3]).toFixed(1)}`).join('');
  const area = `${linea}L${x(total).toFixed(1)},${H - 30}L${x(0)},${H - 30}Z`;
  const cerca = km == null ? null : track.reduce((a, b) => (Math.abs(b[2] - km) < Math.abs(a[2] - km) ? b : a));
  const ref = useRef<SVGSVGElement>(null);
  const mover = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const k = (((e.clientX - r.left) / r.width) * W - P) / (W - P - 8) * total;
    onKm(Math.max(0, Math.min(total, k)));
  };
  const marcas = [];
  for (let a = base; a <= top; a += 100) marcas.push(a);
  return (
    <svg ref={ref} className="gr-perfil" viewBox={`0 0 ${W} ${H}`} onPointerMove={mover} onPointerLeave={() => onKm(null)} role="img" aria-label="Perfil de desnivel de la ruta">
      {marcas.map((a) => <g key={a}><line x1={P} x2={W - 8} y1={y(a)} y2={y(a)} stroke="#d8d1bf" strokeWidth="1" /><text x={P - 6} y={y(a) + 4} textAnchor="end">{a}</text></g>)}
      <path d={area} fill="#e8d8c4" />
      <path d={linea} fill="none" stroke="#b55332" strokeWidth="2.4" strokeLinejoin="round" />
      {[0, 0.25, 0.5, 0.75, 1].map((f) => <text key={f} x={x(f * total)} y={H - 10} textAnchor={f === 0 ? 'start' : f === 1 ? 'end' : 'middle'}>{Math.round(f * total)} km</text>)}
      {cerca && <g><line x1={x(cerca[2])} x2={x(cerca[2])} y1={8} y2={H - 30} stroke="#294334" strokeWidth="1.5" /><circle cx={x(cerca[2])} cy={y(cerca[3])} r="5" fill="#294334" />
        <rect x={Math.min(x(cerca[2]) + 8, W - 150)} y={12} width="138" height="26" rx="6" fill="#294334" /><text x={Math.min(x(cerca[2]) + 8, W - 150) + 69} y={30} textAnchor="middle" fill="#fff" className="gr-perfil-dato">km {cerca[2].toFixed(1)} · {cerca[3]} m</text></g>}
    </svg>
  );
}

export default function GuiaRuta({ guia, faqHtml, conclusionHtml }: { guia: Guia; faqHtml?: string; conclusionHtml?: string }) {
  const { track, pois, ficha } = guia;
  const mapaRef = useRef<HTMLDivElement>(null);
  const marcador = useRef<any>(null);
  const capas = useRef<Record<string, any>>({});
  const [km, setKm] = useState<number | null>(null);
  const [tab, setTab] = useState(ficha.pestanas[0]?.id);
  const tipos = useMemo(() => Object.keys(TIPO).filter((t) => pois.some((p) => p.tipo === t)), [pois]);
  const [visibles, setVisibles] = useState<string[]>(['pueblo', 'taller', 'camping', 'albergue', 'mirador']);
  const [filtro, setFiltro] = useState('pueblo');

  useEffect(() => {
    let mapa: any;
    (async () => {
      const L = (await import('leaflet')).default;
      if (!mapaRef.current || (mapaRef.current as any)._leaflet_id) return;
      mapa = L.map(mapaRef.current, { scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 16,
        attribution: 'Mapa: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Estilo: © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
      }).addTo(mapa);
      const linea = L.polyline(track.map((p) => [p[0], p[1]]), { color: '#b55332', weight: 5, opacity: 0.95 }).addTo(mapa);
      mapa.fitBounds(linea.getBounds(), { padding: [24, 24] });
      L.circleMarker([track[0][0], track[0][1]], { radius: 8, color: '#fff', weight: 3, fillColor: '#294334', fillOpacity: 1 }).bindTooltip('Salida').addTo(mapa);
      L.circleMarker([track[track.length - 1][0], track[track.length - 1][1]], { radius: 8, color: '#fff', weight: 3, fillColor: '#b55332', fillOpacity: 1 }).bindTooltip('Llegada').addTo(mapa);
      for (const t of Object.keys(TIPO)) {
        const g = L.layerGroup();
        for (const p of pois.filter((x) => x.tipo === t)) {
          L.circleMarker([p.lat, p.lon], { radius: t === 'pueblo' ? 6 : 5, color: '#fff', weight: 2, fillColor: TIPO[t].color, fillOpacity: 1 })
            .bindTooltip(`${p.nombre || TIPO[t].nombre.replace(/s$/, '')} · km ${p.km}`).addTo(g);
        }
        capas.current[t] = g;
      }
      marcador.current = L.circleMarker([track[0][0], track[0][1]], { radius: 7, color: '#fff', weight: 3, fillColor: '#294334', fillOpacity: 0 });
      marcador.current.addTo(mapa);
      (mapaRef.current as any).__mapa = mapa;
      setVisibles((v) => [...v]);
    })();
    return () => { if (mapa) mapa.remove(); };
  }, [track, pois]);

  useEffect(() => {
    const mapa = (mapaRef.current as any)?.__mapa;
    if (!mapa) return;
    for (const [t, g] of Object.entries(capas.current)) {
      if (visibles.includes(t)) g.addTo(mapa); else g.remove();
    }
  }, [visibles]);

  useEffect(() => {
    if (!marcador.current) return;
    if (km == null) { marcador.current.setStyle({ fillOpacity: 0, opacity: 0 }); return; }
    const p = track.reduce((a, b) => (Math.abs(b[2] - km) < Math.abs(a[2] - km) ? b : a));
    marcador.current.setLatLng([p[0], p[1]]).setStyle({ fillOpacity: 1, opacity: 1 });
  }, [km, track]);

  const lista = pois.filter((p) => p.tipo === filtro && (p.nombre || filtro === 'agua'));
  return (
    <div className="guia-ruta">
      <ul className="gr-stats">
        {ficha.stats.map(([ic, et, v, nota]) => <li key={et}><Icono n={ic} /><span>{et}</span><strong>{v}</strong><small>{nota}</small></li>)}
      </ul>

      <section className="gr-dificultad" aria-labelledby="gr-dif">
        <div className="gr-dif-cab"><h2 id="gr-dif">Dificultad de la ruta</h2><p className="gr-nota-total"><strong>{ficha.dificultad.total}</strong>/10 <span>Valoración de Bikesunrise</span></p></div>
        <div className="gr-dif-partes">
          {ficha.dificultad.partes.map(([n, v, txt]) => (
            <div key={n}><p className="gr-dif-n"><span>{n}</span><strong>{v}/10</strong></p><div className="gr-barra" role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={v} aria-label={`${n}: ${v} de 10`}><i style={{ width: `${v * 10}%` }} /></div><p>{txt}</p></div>
          ))}
        </div>
        <div className="gr-dif-texto" dangerouslySetInnerHTML={{ __html: ficha.dificultad_texto }} />
      </section>

      <section className="gr-mapa-sec" aria-labelledby="gr-mapa">
        <h2 id="gr-mapa">Mapa y perfil</h2>
        <div className="gr-capas" role="group" aria-label="Qué mostrar en el mapa">
          {tipos.map((t) => (
            <button key={t} type="button" aria-pressed={visibles.includes(t)} onClick={() => setVisibles((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]))}>
              <i style={{ background: TIPO[t].color }} />{TIPO[t].nombre} <span>{pois.filter((p) => p.tipo === t).length}</span>
            </button>
          ))}
        </div>
        <div ref={mapaRef} className="gr-mapa" aria-label="Mapa interactivo de la ruta" />
        <Perfil track={track} km={km} onKm={setKm} />
        <p className="gr-fuente">Pasa el dedo o el ratón por el perfil para ver el punto en el mapa. Traza: OpenStreetMap. Altitudes: EU-DEM.</p>
      </section>

      <section className="gr-tabs-sec" aria-label="Recomendaciones">
        <div className="gr-tabs" role="tablist">
          {ficha.pestanas.map((p) => (
            <button key={p.id} role="tab" id={`tab-${p.id}`} aria-selected={tab === p.id} aria-controls={`panel-${p.id}`} onClick={() => setTab(p.id)}><Icono n={p.icono} />{p.titulo}</button>
          ))}
        </div>
        {ficha.pestanas.map((p) => (
          <div key={p.id} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} hidden={tab !== p.id} className="gr-panel" dangerouslySetInnerHTML={{ __html: p.html }} />
        ))}
      </section>

      <section className="gr-lugares" aria-labelledby="gr-lug">
        <h2 id="gr-lug">Lugares en el camino</h2>
        <div className="gr-filtros" role="group" aria-label="Tipo de lugar">
          {tipos.map((t) => <button key={t} type="button" aria-pressed={filtro === t} onClick={() => setFiltro(t)}><Icono n={TIPO[t].icono} />{TIPO[t].nombre}</button>)}
        </div>
        <ol className="gr-lista">
          {lista.map((p, i) => (
            <li key={i} onMouseEnter={() => setKm(p.km)} onMouseLeave={() => setKm(null)}>
              <span className="gr-km">km {p.km}</span><strong>{p.nombre || 'Fuente'}</strong>
            </li>
          ))}
        </ol>
      </section>

      {conclusionHtml && <div className="rich-block bs-bloque" dangerouslySetInnerHTML={{ __html: conIconos(conclusionHtml) }} />}
      {faqHtml && <section className="gr-faq" aria-labelledby="gr-faq-t"><h2 id="gr-faq-t">Preguntas frecuentes</h2><div className="rich-block" dangerouslySetInnerHTML={{ __html: faqHtml }} /></section>}
    </div>
  );
}
