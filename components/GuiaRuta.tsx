'use client';
// Guía de ruta con la estructura de las fichas de ruta de bikepacking.com (referencia del Àlex):
// portada a sangre con el título · franja de datos con iconos y tarjeta de dificultad · entradilla
// destacada y texto en columna · mosaico de fotos · caja de dificultad · galería oscura · «Mapa y GPS»
// con perfil y descarga del GPX · pestañas · aviso de uso · más rutas · preguntas frecuentes.
// Datos en data/guias/<ruta>.json; mapa con Leaflet y fondo Positron de OpenFreeMap (lib/mapaBase.ts).
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fondoMapa } from '@/lib/mapaBase';
import { ICONOS, conIconos } from '@/lib/iconos';

export type Punto = [number, number, number, number]; // lat, lon, km, altitud
export type Poi = { tipo: string; nombre: string; km: number; // en guías sin traza puede venir null
  lat: number; lon: number; fijo?: boolean };
type Foto = { src: string; alt: string; credito: string; enlace?: string };
export type Segmento = { nombre: string; color: string; discontinuo?: boolean; puntos: [number, number][] };
export type Guia = {
  // track: traza continua con altitudes (mapa, perfil y marcas de km). Puede ir vacía en rutas sin
  // traza abierta en OpenStreetMap; entonces el mapa muestra solo los segmentos y los lugares.
  track: Punto[];
  segmentos?: Segmento[];
  pois: Poi[];
  ficha: {
    lugar: string;
    gpx?: string;
    track_oficial?: { texto: string; url: string };
    stats: [string, string, string, string][];
    // nota: de dónde sale la valoración (por defecto, «Valoración de Bikesunrise»)
    dificultad?: { total: number; partes: [string, number, string][]; nota?: string };
    entradilla: string;
    // Bloques de texto opcionales: las guías generadas desde el artículo llevan su texto en las pestañas.
    cuerpo_1?: string;
    cuerpo_2?: string;
    dificultad_html?: string;
    desarrollo_html?: string;
    pestanas: { id: string; titulo: string; icono: string; html: string }[];
    fotos: Foto[];
  };
};
export type Relacionada = { path: string; title: string; image: string };

const TIPO: Record<string, { nombre: string; icono: string; color: string }> = {
  pueblo: { nombre: 'Pueblos', icono: 'mapa', color: '#294334' },
  agua: { nombre: 'Fuentes', icono: 'agua', color: '#2f6f8f' },
  taller: { nombre: 'Talleres de bicis', icono: 'bici', color: '#b55332' },
  camping: { nombre: 'Campings', icono: 'dormir', color: '#4f7a52' },
  albergue: { nombre: 'Albergues', icono: 'dormir', color: '#7a5b2f' },
  mirador: { nombre: 'Miradores', icono: 'resumen', color: '#6b4f8a' },
};
const Icono = ({ n }: { n: string }) => <span className="gr-ico" dangerouslySetInnerHTML={{ __html: ICONOS[n] ?? '' }} />;
const Cinta = ({ children }: { children: string }) => <div className="gr-cinta"><span>{children}</span></div>;
const Html = ({ html, className }: { html: string; className?: string }) => <div className={className} dangerouslySetInnerHTML={{ __html: conIconos(html) }} />;

// Barra de pestañas en una sola fila, sin desplazamiento lateral: columnas iguales (el título puede ir
// en dos líneas) y, si no caben todas, la última columna es «Más», un menú con el resto.
function Pestanas({ lista, activa, onElegir }: { lista: { id: string; titulo: string }[]; activa?: string; onElegir: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [cabe, setCabe] = useState(8);
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setCabe(Math.max(3, Math.floor(el.clientWidth / (el.clientWidth < 640 ? 84 : 102))));
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    if (!abierto) return;
    const cerrar = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setAbierto(false);
    };
    document.addEventListener('mousedown', cerrar);
    document.addEventListener('keydown', cerrar);
    return () => { document.removeEventListener('mousedown', cerrar); document.removeEventListener('keydown', cerrar); };
  }, [abierto]);
  const todas = lista.length <= cabe;
  const vistas = todas ? lista : lista.slice(0, cabe - 1);
  const resto = todas ? [] : lista.slice(cabe - 1);
  const enResto = resto.find((p) => p.id === activa);
  const columnas = vistas.length + (resto.length ? 1 : 0);
  return (
    <div ref={ref} className="gr-tabs" role="tablist" style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))` }}>
      {vistas.map((p) => (
        <button key={p.id} type="button" role="tab" id={`tab-${p.id}`} aria-selected={activa === p.id} aria-controls={`panel-${p.id}`} onClick={() => onElegir(p.id)}>{p.titulo}</button>
      ))}
      {resto.length > 0 && (
        <div className="gr-tabs-mas">
          <button type="button" aria-haspopup="true" aria-expanded={abierto} aria-selected={!!enResto} className={enResto ? 'activa' : undefined} onClick={() => setAbierto((v) => !v)}>
            {enResto ? enResto.titulo : `Más (${resto.length})`}<svg viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
          {abierto && (
            <ul className="gr-tabs-menu">
              {resto.map((p) => (
                <li key={p.id}><button type="button" role="tab" id={`tab-${p.id}`} aria-selected={activa === p.id} aria-controls={`panel-${p.id}`} onClick={() => { onElegir(p.id); setAbierto(false); }}>{p.titulo}</button></li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function Perfil({ track, pueblos, onKm, km }: { track: Punto[]; pueblos: Poi[]; onKm: (km: number | null) => void; km: number | null }) {
  const W = 1100, H = 320, IZ = 64, DE = 60, AR = 86, AB = 46; // márgenes: izquierda, derecha, arriba (pueblos), abajo (km)
  const alts = track.map((p) => p[3]);
  const max = Math.max(...alts), min = Math.min(...alts);
  const top = Math.ceil((max + 40) / 100) * 100, base = Math.max(0, Math.floor((min - 10) / 100) * 100);
  const total = track[track.length - 1][2];
  const x = (k: number) => IZ + (k / total) * (W - IZ - DE);
  const y = (a: number) => AR + (1 - (a - base) / (top - base)) * (H - AR - AB);
  const linea = track.map((p, i) => `${i && !(p[2] === track[i - 1][2] && p[0] !== track[i - 1][0]) ? 'L' : 'M'}${x(p[2]).toFixed(1)},${y(p[3]).toFixed(1)}`).join('');
  const area = `${linea}L${x(total).toFixed(1)},${H - AB}L${x(0)},${H - AB}Z`;
  const alto = track.reduce((a, b) => (b[3] > a[3] ? b : a));
  const cerca = km == null ? null : track.reduce((a, b) => (Math.abs(b[2] - km) < Math.abs(a[2] - km) ? b : a));
  const pueblo = cerca ? pueblos.reduce((a, b) => (Math.abs(b.km - cerca[2]) < Math.abs(a.km - cerca[2]) ? b : a), pueblos[0]) : null;
  // pueblos que se rotulan: salida, llegada y los marcados como fijos (o Girona) siempre; el resto,
  // separados al menos 9 km, o una undécima parte de la ruta en las largas, para que no se pisen
  const hueco = Math.max(9, total / 11);
  const fijos = pueblos.filter((p, i) => i === 0 || i === pueblos.length - 1 || p.fijo || p.nombre === 'Girona');
  const rotulos: Poi[] = [...fijos];
  for (const p of pueblos) if (rotulos.every((r) => Math.abs(r.km - p.km) >= hueco)) rotulos.push(p);
  rotulos.sort((a, b) => a.km - b.km);
  const corto = (n: string) => n.replace(/^Sant /, 'St. ');
  const ref = useRef<SVGSVGElement>(null);
  const mover = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    onKm(Math.max(0, Math.min(total, ((((e.clientX - r.left) / r.width) * W - IZ) / (W - IZ - DE)) * total)));
  };
  const marcas: number[] = [];
  for (let a = base; a <= top; a += top - base > 600 ? 200 : 100) marcas.push(a);
  // rayas del eje cada 10 km y rótulos cada 20 km; en rutas largas, más espaciados (máximo ~12 rótulos)
  const rotulo = [20, 50, 100, 200, 500].find((r) => total / r <= 12) ?? 500;
  const raya = rotulo / 2;
  const kms: number[] = [];
  for (let k = 0; k <= total; k += raya) kms.push(k);
  const tx = cerca ? Math.min(Math.max(x(cerca[2]) - 95, IZ), W - DE - 190) : 0;
  return (
    <figure className="gr-perfil-fig">
      <svg ref={ref} className="gr-perfil" viewBox={`0 0 ${W} ${H}`} onPointerMove={mover} onPointerDown={mover} onPointerLeave={() => onKm(null)} role="img" aria-label={`Perfil de desnivel: de ${alts[0]} m a ${alts[alts.length - 1]} m, punto más alto ${alto[3]} m en el km ${alto[2].toFixed(0)}`}>
        <defs>
          <linearGradient id="gr-relleno" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b55332" stopOpacity=".42" /><stop offset="1" stopColor="#b55332" stopOpacity=".04" /></linearGradient>
        </defs>
        {marcas.map((a) => <g key={a} className="gr-p-rej"><line x1={IZ} x2={W - DE} y1={y(a)} y2={y(a)} /><text x={IZ - 10} y={y(a) + 4} textAnchor="end">{a} m</text></g>)}
        {kms.map((k) => <g key={k} className="gr-p-km"><line x1={x(k)} x2={x(k)} y1={H - AB} y2={H - AB + 6} />{k % rotulo === 0 && <text x={x(k)} y={H - AB + 22} textAnchor="middle">{k} km</text>}</g>)}
        {rotulos.map((p) => (
          <g key={p.nombre} className="gr-p-pueblo">
            <line x1={x(p.km)} x2={x(p.km)} y1={AR - 6} y2={H - AB} />
            {p.km > total * 0.85 ? <text textAnchor="end" transform={`translate(${x(p.km) - 3},${AR - 10}) rotate(35)`}>{corto(p.nombre)}</text> : <text transform={`translate(${x(p.km) + 3},${AR - 10}) rotate(-35)`}>{corto(p.nombre)}</text>}
          </g>
        ))}
        <path d={area} fill="url(#gr-relleno)" />
        <path d={linea} fill="none" stroke="#b55332" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <line x1={IZ} x2={W - DE} y1={H - AB} y2={H - AB} stroke="#1f3328" strokeWidth="1.5" />
        <g className="gr-p-alto"><circle cx={x(alto[2])} cy={y(alto[3])} r="5" /><text x={x(alto[2]) + 10} y={y(alto[3]) - 8}>{alto[3]} m</text></g>
        {cerca && (
          <g className="gr-p-cursor">
            <line x1={x(cerca[2])} x2={x(cerca[2])} y1={AR - 6} y2={H - AB} />
            <circle cx={x(cerca[2])} cy={y(cerca[3])} r="7" />
            <rect x={tx} y={6} width="190" height="44" rx="10" />
            <text x={tx + 14} y={25} className="gr-p-c1">km {cerca[2].toFixed(1)} · {cerca[3]} m</text>
            {pueblo && <text x={tx + 14} y={42} className="gr-p-c2">cerca de {pueblo.nombre}</text>}
          </g>
        )}
      </svg>
      <figcaption className="gr-perfil-datos">
        <span><b>{Math.round(alts.slice(1).reduce((s, a, i) => s + Math.max(0, a - alts[i]), 0) / 10) * 10} m</b> de subida</span>
        <span><b>{Math.round(alts.slice(1).reduce((s, a, i) => s + Math.max(0, alts[i] - a), 0) / 10) * 10} m</b> de bajada</span>
        <span><b>{max} m</b> punto más alto</span>
        <span><b>{min} m</b> punto más bajo</span>
      </figcaption>
    </figure>
  );
}

function Galeria({ fotos }: { fotos: Foto[] }) {
  const [i, setI] = useState(0);
  if (!fotos.length) return null;
  const f = fotos[i];
  const ir = (d: number) => setI((v) => (v + d + fotos.length) % fotos.length);
  return (
    <section className="gr-galeria" aria-roledescription="carrusel" aria-label="Galería de fotos">
      <Cinta>Galería de fotos</Cinta>
      <div className="gr-gal-marco">
        <button type="button" className="gr-gal-flecha" onClick={() => ir(-1)} aria-label="Foto anterior">‹</button>
        <figure><img src={f.src} alt={f.alt} /><figcaption>{f.alt} · Foto: {f.enlace ? <a href={f.enlace} target="_blank" rel="noopener noreferrer">{f.credito}</a> : f.credito}</figcaption></figure>
        <button type="button" className="gr-gal-flecha" onClick={() => ir(1)} aria-label="Foto siguiente">›</button>
      </div>
      <div className="gr-gal-puntos">{fotos.map((_, k) => <button key={k} type="button" aria-label={`Foto ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} />)}</div>
    </section>
  );
}

export default function GuiaRuta({ guia, titulo, portada, faqHtml, conclusionHtml, relacionadas }: {
  guia: Guia; titulo: string; portada: string; faqHtml?: string; conclusionHtml?: string; relacionadas: Relacionada[];
}) {
  const { track, pois, ficha } = guia;
  const segmentos = guia.segmentos ?? [];
  const hayTraza = track.length > 1;
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
      mapa = L.map(mapaRef.current, { scrollWheelZoom: false, zoomSnap: 0.25 });
      await fondoMapa(L, mapa);
      const encuadre: any[] = [];
      for (const sg of segmentos) {
        L.polyline(sg.puntos, { color: '#fff', weight: 9, opacity: 0.9 }).addTo(mapa);
        encuadre.push(L.polyline(sg.puntos, { color: sg.color, weight: 5, opacity: 1, dashArray: sg.discontinuo ? '8 8' : undefined }).bindTooltip(sg.nombre).addTo(mapa));
      }
      // La traza se corta donde OpenStreetMap tiene un hueco (dos puntos seguidos con el mismo km).
      const partes: [number, number][][] = [[]];
      track.forEach((p, i) => {
        if (i && p[2] === track[i - 1][2] && (p[0] !== track[i - 1][0] || p[1] !== track[i - 1][1])) partes.push([]);
        partes[partes.length - 1].push([p[0], p[1]]);
      });
      if (hayTraza) {
        L.polyline(partes, { color: '#fff', weight: 9, opacity: 0.95 }).addTo(mapa);
        encuadre.push(L.polyline(partes, { color: '#b55332', weight: 5, opacity: 1 }).addTo(mapa));
      }
      // sin traza, el encuadre incluye también los pueblos de etapa
      if (!hayTraza) encuadre.push(...pois.filter((p) => p.tipo === 'pueblo').map((p) => L.marker([p.lat, p.lon])));
      mapa.fitBounds(L.featureGroup(encuadre).getBounds(), { padding: [24, 24] });
      // Marcas de kilómetro, como en las apps de rutas: cada 10 km, o cada 20/50/100/200 km si con el zoom
      // actual quedarían montadas unas sobre otras.
      const marcas = new Map<number, any>();
      for (let k = 10; hayTraza && k < track[track.length - 1][2]; k += 10) {
        const p = track.reduce((a, b) => (Math.abs(b[2] - k) < Math.abs(a[2] - k) ? b : a));
        marcas.set(k, L.marker([p[0], p[1]], { icon: L.divIcon({ className: 'gr-km', html: String(k), iconSize: [24, 24] }), keyboard: false, interactive: false }));
      }
      const repartir = () => {
        const pasos = [10, 20, 50, 100, 200].filter((paso) => {
          const pts = [...marcas].filter(([k]) => k % paso === 0).map(([, m]) => mapa.latLngToContainerPoint(m.getLatLng()));
          return pts.every((pt, i) => i === 0 || pt.distanceTo(pts[i - 1]) >= 34);
        });
        for (const [k, m] of marcas) { if (pasos.length && k % pasos[0] === 0) m.addTo(mapa); else m.remove(); }
      };
      repartir();
      mapa.on('zoomend', repartir);
      if (hayTraza) {
        L.circleMarker([track[0][0], track[0][1]], { radius: 8, color: '#fff', weight: 3, fillColor: '#1f3328', fillOpacity: 1 }).bindTooltip('Salida').addTo(mapa);
        L.circleMarker([track[track.length - 1][0], track[track.length - 1][1]], { radius: 8, color: '#fff', weight: 3, fillColor: '#b55332', fillOpacity: 1 }).bindTooltip('Llegada').addTo(mapa);
      }
      for (const t of Object.keys(TIPO)) {
        const g = L.layerGroup();
        for (const p of pois.filter((x) => x.tipo === t)) {
          // Sin traza, los pueblos de etapa son la referencia del mapa: más grandes y con el nombre siempre visible.
          const etapa = !hayTraza && t === 'pueblo';
          L.circleMarker([p.lat, p.lon], { radius: etapa ? 8 : t === 'pueblo' ? 6 : 5, color: '#fff', weight: etapa ? 3 : 2, fillColor: etapa ? '#b55332' : TIPO[t].color, fillOpacity: 1 })
            .bindTooltip(`${p.nombre || TIPO[t].nombre.replace(/s$/, '')}${p.km != null ? ` · km ${p.km}` : ''}`, etapa ? { permanent: true, direction: 'right', className: 'gr-etiqueta' } : undefined).addTo(g);
        }
        capas.current[t] = g;
      }
      if (hayTraza) marcador.current = L.circleMarker([track[0][0], track[0][1]], { radius: 7, color: '#fff', weight: 3, fillColor: '#1f3328', fillOpacity: 0, opacity: 0 }).addTo(mapa);
      (mapaRef.current as any).__mapa = mapa;
      setVisibles((v) => [...v]);
    })();
    return () => { if (mapa) mapa.remove(); };
  }, [track, pois]);

  useEffect(() => {
    const mapa = (mapaRef.current as any)?.__mapa;
    if (!mapa) return;
    for (const [t, g] of Object.entries(capas.current)) { if (visibles.includes(t)) g.addTo(mapa); else g.remove(); }
  }, [visibles]);

  useEffect(() => {
    if (!marcador.current) return;
    if (km == null) { marcador.current.setStyle({ fillOpacity: 0, opacity: 0 }); return; }
    const p = track.reduce((a, b) => (Math.abs(b[2] - km) < Math.abs(a[2] - km) ? b : a));
    marcador.current.setLatLng([p[0], p[1]]).setStyle({ fillOpacity: 1, opacity: 1 });
  }, [km, track]);

  const mosaico = ficha.fotos.slice(0, 5);
  const lista = pois.filter((p) => p.tipo === filtro && (p.nombre || filtro === 'agua'));
  return (
    <div className="guia-ruta">
      <header className="gr-portada" style={{ backgroundImage: `url('${portada}')` }}>
        <div className="gr-portada-txt">
          <Link className="gr-volver" href="/rutas/">← Rutas</Link>
          <h1>{titulo}</h1>
          <p className="gr-lugar"><Icono n="mapa" />{ficha.lugar}</p>
        </div>
      </header>

      <section className="gr-franja" aria-label="Datos de la ruta">
        <div className="gr-franja-in">
          <ul className="gr-stats">
            {ficha.stats.map(([ic, et, v, nota]) => <li key={et}><span className="gr-st-et">{et}</span><div className="gr-st-v"><Icono n={ic} /><strong className={v.length > 14 ? 'largo' : undefined}>{v}</strong></div>{nota && <small>{nota}</small>}</li>)}
          </ul>
          {ficha.dificultad && (
            <aside className="gr-tarjeta" aria-label="Dificultad">
              <p className="gr-tarjeta-k">Dificultad</p>
              <p className="gr-tarjeta-n"><strong>{ficha.dificultad!.total}</strong>/10</p>
              <ul>{ficha.dificultad!.partes.map(([n, v, et]) => <li key={n}><span>{n}</span><b>{v}</b><em>{et}</em></li>)}</ul>
              <p className="gr-tarjeta-nota">{ficha.dificultad!.nota || 'Valoración de Bikesunrise'}</p>
            </aside>
          )}
        </div>
      </section>

      <div className="gr-columna">
        <Html className="gr-entradilla" html={ficha.entradilla} />
        {ficha.cuerpo_1 && <Html className="gr-texto" html={ficha.cuerpo_1} />}
      </div>
      {mosaico.length >= 3 && (
        <div className="gr-mosaico">
          {mosaico.map((f, k) => <figure key={k} className={k < 2 ? 'ancha' : ''}><img src={f.src} alt={f.alt} loading="lazy" /></figure>)}
        </div>
      )}
      <div className="gr-columna">
        {ficha.cuerpo_2 && <Html className="gr-texto" html={ficha.cuerpo_2} />}
        {ficha.dificultad_html && <section className="gr-cajadif" aria-labelledby="gr-dif"><h2 id="gr-dif">Dificultad de la ruta</h2><Html className="gr-texto" html={ficha.dificultad_html} /></section>}
        {ficha.desarrollo_html && <section className="gr-desarrollo" aria-labelledby="gr-des"><h2 id="gr-des">Cómo la hice</h2><Html className="gr-texto" html={ficha.desarrollo_html} /></section>}
      </div>

      <Galeria fotos={ficha.fotos} />

      <section className="gr-mapa-sec" aria-label="Mapa y GPS">
        <Cinta>Mapa y GPS</Cinta>
        <div className="gr-ancho">
          <div className="gr-capas" role="group" aria-label="Qué mostrar en el mapa">
            {tipos.map((t) => (
              <button key={t} type="button" aria-pressed={visibles.includes(t)} onClick={() => setVisibles((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]))}>
                <i style={{ background: TIPO[t].color }} />{TIPO[t].nombre} <span>{pois.filter((p) => p.tipo === t).length}</span>
              </button>
            ))}
          </div>
          <div ref={mapaRef} className="gr-mapa" aria-label="Mapa interactivo de la ruta" />
          {segmentos.length > 0 && <ul className="gr-leyenda">{segmentos.filter((sg, i) => segmentos.findIndex((o) => o.nombre === sg.nombre) === i).map((sg) => <li key={sg.nombre}><i style={{ background: sg.color, opacity: sg.discontinuo ? 0.6 : 1 }} />{sg.nombre}</li>)}</ul>}
          {hayTraza && <Perfil track={track} pueblos={pois.filter((p) => p.tipo === 'pueblo')} km={km} onKm={setKm} />}
          <div className="gr-acciones">
            {ficha.gpx && <a className="gr-boton" href={ficha.gpx} download><Icono n="distancia" />Descargar GPX</a>}
            {ficha.track_oficial && <a className="gr-boton" href={ficha.track_oficial.url} target="_blank" rel="noopener"><Icono n="distancia" />{ficha.track_oficial.texto}</a>}
            <Link className="gr-boton gr-boton--claro" href="/contacto/"><Icono n="aviso" />Avisar de un cambio en la ruta</Link>
          </div>
          <p className="gr-fuente">{hayTraza ? 'Pasa el dedo o el ratón por el perfil para ver el punto en el mapa. Traza: © colaboradores de OpenStreetMap (ODbL). Altitudes: EU-DEM.' : 'Lugares y tramos: © colaboradores de OpenStreetMap (ODbL).'}</p>
        </div>
      </section>

      <section className="gr-pestanas" aria-label="Información práctica">
        <Pestanas lista={[...ficha.pestanas, { id: 'lugares', titulo: 'Lugares' }]} activa={tab} onElegir={setTab} />
        <div className="gr-paneles">
          {ficha.pestanas.map((p) => <div key={p.id} role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`} hidden={tab !== p.id} className={'gr-panel rich-block ' + (p.id === 'lo-mejor' ? 'gr-panel--dos' : '')} dangerouslySetInnerHTML={{ __html: conIconos(p.html) }} />)}
          <div role="tabpanel" id="panel-lugares" aria-labelledby="tab-lugares" hidden={tab !== 'lugares'} className="gr-panel">
            <div className="gr-filtros" role="group" aria-label="Tipo de lugar">
              {tipos.map((t) => <button key={t} type="button" aria-pressed={filtro === t} onClick={() => setFiltro(t)}><Icono n={TIPO[t].icono} />{TIPO[t].nombre}</button>)}
            </div>
            <ol className="gr-lista">
              {lista.map((p, i) => <li key={i} onMouseEnter={() => setKm(p.km)} onMouseLeave={() => setKm(null)}>{p.km != null && <span className="gr-km">km {p.km}</span>}<strong>{p.nombre || 'Fuente'}</strong></li>)}
            </ol>
          </div>
        </div>
      </section>

      <div className="gr-columna gr-final">
        {conclusionHtml && <Html className="rich-block bs-bloque" html={conclusionHtml} />}
        <p className="gr-aviso"><em>Antes de salir:</em> esta guía es una ayuda para planificar, no una garantía. Comprueba el estado de la vía, el tiempo y los cierres en las webs oficiales, respeta la señalización y la normativa de cada tramo y viaja con el material adecuado. Si haces la ruta, lo haces bajo tu responsabilidad.</p>
        {relacionadas.length > 0 && (
          <section className="gr-mas" aria-labelledby="gr-mas-t">
            <h2 id="gr-mas-t">Más rutas</h2>
            <div>{relacionadas.map((r) => <Link key={r.path} href={r.path + '/'}><img src={r.image} alt="" loading="lazy" /><span>Ruta</span><strong>{r.title}</strong></Link>)}</div>
          </section>
        )}
        {faqHtml && <section className="gr-faq" aria-labelledby="gr-faq-t"><h2 id="gr-faq-t">Preguntas frecuentes</h2><Html className="rich-block" html={faqHtml} /></section>}
      </div>
    </div>
  );
}
