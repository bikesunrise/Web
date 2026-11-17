// Página de historia por país con el estilo de la portada (atlas ilustrado, sellos, fotos con borde pintado).
// El contenido sale de data/content.json; en América las fotos son fotogramas 4K reales de los vídeos
// (components/historia-v2/fotos.json, generado por bocetos/historias-v2/exportar_fotos.py).
import Link from 'next/link';
import type { Entry, Block } from '@/lib/content';
import { imageFor } from '@/lib/content';
import fotosAmerica from './historia-v2/fotos.json';
import HistoriaCliente from './historia-v2/HistoriaCliente';
import { pie, filtroTinta } from './portada-v2/pie';

type Foto = { src: string; alt: string; ep?: number; t?: number; yt?: string };
const ORDEN = ['', 'francia', 'italia', 'eslovenia', 'croacia', 'bosnia', 'montenegro', 'albania', 'macedonia-del-norte', 'grecia', 'turquia',
  'pakistan', 'la-india', 'nepal', 'canada', 'estados-unidos', 'mexico', 'guatemala', 'el-salvador', 'nicaragua', 'costa-rica', 'panama',
  'colombia', 'ecuador', 'peru'];
const NOMBRES: Record<string, string> = { francia: 'Francia', italia: 'Italia', eslovenia: 'Eslovenia', croacia: 'Croacia', bosnia: 'Bosnia',
  montenegro: 'Montenegro', albania: 'Albania', 'macedonia-del-norte': 'Macedonia del Norte', grecia: 'Grecia', turquia: 'Turquía', pakistan: 'Pakistán',
  'la-india': 'India', nepal: 'Nepal', canada: 'Canadá', 'estados-unidos': 'Estados Unidos', mexico: 'México', guatemala: 'Guatemala',
  'el-salvador': 'El Salvador', nicaragua: 'Nicaragua', 'costa-rica': 'Costa Rica', panama: 'Panamá', colombia: 'Colombia', ecuador: 'Ecuador', peru: 'Perú' };
const CONT = (slug: string) => (ORDEN.indexOf(slug) <= 9 ? 'Europa' : ORDEN.indexOf(slug) <= 13 ? 'Asia' : 'América');

// --- utilidades de dibujo (mismas formas que la portada)
function azar(semilla: number) { let a = semilla >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function mascara(seed: number, inset = 5, escala = 9, freq = 0.09) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='5' seed='${seed}'/><feDisplacementMap in='SourceGraphic' scale='${escala}'/><feGaussianBlur stdDeviation='.7'/></filter><rect x='${inset}' y='${inset}' width='${100 - 2 * inset}' height='${100 - 2 * inset}' fill='white' filter='url(#f)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
function borde(seed: number, alto = 46) {
  const r = azar(seed), medio = alto * 0.55; let x = 0, y = medio + (r() * 8 - 4), d = `M0,${alto} L0,${y.toFixed(1)}`, k = 0;
  while (x < 1440) { const paso = 150 + r() * 60, amp = (7 + r() * 5) * (k++ % 2 ? 1 : -1), x2 = Math.min(1440, x + paso), y2 = medio + (r() * 8 - 4);
    d += ` C${(x + paso * 0.35).toFixed(1)},${(y - amp).toFixed(1)} ${(x2 - paso * 0.35).toFixed(1)},${(y2 + amp).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`; x = x2; y = y2; }
  return d + ` L1440,${alto} Z`;
}
function Borde({ seed, cls = 'arriba' }: { seed: number; cls?: string }) {
  return <svg className={'h-borde ' + cls} viewBox="0 0 1440 46" preserveAspectRatio="none" aria-hidden="true"><path d={borde(seed)} /></svg>;
}
const mmss = (s = 0) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// --- lectura de los bloques
const texto = (v: Block['value']) => (Array.isArray(v) ? v.join(' ') : v);
function fotoDe(b: Block, titulo: string): Foto | null {
  if (b.type === 'figure' && typeof b.value === 'string' && b.value.startsWith('/images/')) return { src: b.value, alt: `Fotografía del viaje por ${titulo}` };
  if (b.type === 'html' && typeof b.value === 'string' && /^\s*<figure/.test(b.value)) {
    const m = b.value.match(/src="([^"]+)"/); const a = b.value.match(/alt="([^"]*)"/);
    return m ? { src: m[1], alt: a?.[1] || `Fotografía del viaje por ${titulo}` } : null;
  }
  return null;
}
type Capitulo = { titulo: string; bloques: Block[]; fotos: Foto[] };

export default function HistoriaV2({ entry }: { entry: Entry }) {
  const slug = entry.path.split('-por-')[1] || '';
  const pais = NOMBRES[slug] || entry.title.replace('Viajar en bicicleta por ', '');
  const am = (fotosAmerica as Record<string, { hero: Foto; fotos: Foto[] }>)[slug];
  const videos: string[] = [];
  const intro: Block[] = [];
  const caps: Capitulo[] = [];
  const galeria: Foto[] = [];
  const esTexto = (b: Block) => b.type === 'p' || b.type === 'h3' || b.type === 'blockquote' || b.type === 'ul' || b.type === 'ol' || (b.type === 'html' && !fotoDe(b, pais));
  // frases sueltas de la web antigua que anunciaban una lista que ya no existe («En esta página hablamos de:»)
  const sobra = (b: Block) => b.type === 'p' && /:\s*$/.test(texto(b.value)) && texto(b.value).length < 70;
  type Bruto = { titulo: string; bloques: Block[] };
  const brutos: Bruto[] = [];
  for (const b of entry.blocks) {
    if (b.type === 'html' && typeof b.value === 'string' && b.value.includes('episode-card')) { videos.push(b.value); continue; }
    if (b.type === 'h2') { brutos.push({ titulo: texto(b.value), bloques: [] }); continue; }
    if (sobra(b)) continue;
    if (brutos.length) brutos[brutos.length - 1].bloques.push(b); else intro.push(b);
  }
  for (const c of brutos) {
    const tieneTexto = c.bloques.some(esTexto);
    if (!tieneTexto) { if (!am) c.bloques.forEach((b) => { const f = fotoDe(b, pais); if (f) galeria.push(f); }); continue; }   // «Imágenes del viaje…» → galería
    if (am) { caps.push({ titulo: c.titulo, bloques: c.bloques.filter(esTexto), fotos: [] }); continue; }
    // Europa y Asia: un capítulo largo con fotos intercaladas se parte en tramos, cada uno con su foto
    let buf: Block[] = [], primero = true;
    for (const b of c.bloques) {
      const f = fotoDe(b, pais);
      if (f) {
        if (buf.length) { caps.push({ titulo: primero ? c.titulo : '', bloques: buf, fotos: [f] }); buf = []; primero = false; }
        else if (caps.length) caps[caps.length - 1].fotos.push(f); else galeria.push(f);
        continue;
      }
      buf.push(b);
    }
    if (buf.length) caps.push({ titulo: primero ? c.titulo : '', bloques: buf, fotos: [] });
  }
  // la entrada: el texto antes del primer capítulo o, si no hay, el primer párrafo de la historia
  if (!intro.some((b) => b.type === 'p') && caps.length && caps[0].bloques[0]?.type === 'p') intro.push(caps[0].bloques.shift() as Block);
  // las fotos de más en un tramo pasan a la galería (cada tramo lleva dos como mucho)
  caps.forEach((c) => { if (c.fotos.length > 2) galeria.unshift(...c.fotos.splice(2)); });
  const capitulos = caps.filter((c) => c.bloques.length);
  // América: los fotogramas van en orden de episodio, así que se reparten en orden entre los capítulos
  if (am) {
    const n = capitulos.length, L = am.fotos.length;
    let previo = -1;
    capitulos.forEach((c, k) => {
      const a = Math.floor((k * L) / n), b = Math.floor(((k + 1) * L) / n);
      c.fotos = a === previo ? [] : am.fotos.slice(a, Math.max(a + 1, Math.min(b, a + 2)));
      previo = a;
    });
  }
  const hero: Foto = am?.hero || { src: imageFor(entry), alt: `Paisaje del viaje en bicicleta por ${pais}` };
  const lede = intro.find((b) => b.type === 'p');
  const titulados = capitulos.map((c, k) => ({ t: c.titulo, k })).filter((x) => x.t);
  const resumen = entry.summary?.length ? entry.summary : titulados.map((x) => x.t);
  const nFotos = am ? 1 + am.fotos.length : capitulos.reduce((n, c) => n + c.fotos.length, 0) + galeria.length;
  const i = ORDEN.indexOf(slug);
  const sig = ORDEN[i + 1];
  const ant = i > 1 ? ORDEN[i - 1] : '';

  const pieFoto = (f: Foto) => (f.yt ? <> {f.alt} · <a href={`https://www.youtube.com/watch?v=${f.yt}&t=${f.t}s`} target="_blank" rel="noopener noreferrer">EP.{f.ep}, {mmss(f.t)}</a></> : null);
  const FotoRasgada = ({ f, seed, cls }: { f: Foto; seed: number; cls: string }) => (
    <figure className={cls}>
      <span className="h-rasgada" style={{ ['--m' as string]: mascara(seed) }}><img src={f.src} alt={f.alt} loading="lazy" /></span>
      {f.yt ? <figcaption>{pieFoto(f)}</figcaption> : null}
    </figure>
  );

  return (
    <div className="hv2">
      <div dangerouslySetInnerHTML={{ __html: filtroTinta }} />
      <section className="h-hero">
        <img src={hero.src} alt={hero.alt} fetchPriority="high" />
        <div className="h-hero-txt">
          <Link className="h-volver" href="/portfolio/viajes/">← Todas las historias</Link>
          <p className="h-cont">{CONT(slug)} · Viajar en bicicleta por</p>
          <h1>{pais}</h1>
        </div>
        {hero.yt ? <p className="h-hero-pie">{pieFoto(hero)}</p> : null}
        <Borde seed={i * 7 + 3} cls="h-hero-borde" />
      </section>

      <section className="h-intro">
        <div className="h-intro-txt">
          <div id="hv2-sello" className="pv2 h-sello" aria-hidden="true" />
          {lede ? <p className="h-lede">{texto(lede.value)}</p> : <p className="h-lede">{entry.excerpt}</p>}
          <div className="h-cifras">
            <div><b>{capitulos.length}</b><span>{titulados.length < capitulos.length ? "tramos" : "capítulos"}</span></div>
            <div><b>{nFotos}</b><span>{am ? 'fotogramas' : 'fotos'}</span></div>
            {entry.coverage ? <div><b>{(entry.coverage.match(/\d+/g) || []).length}</b><span>episodios</span></div> : null}
          </div>
        </div>
        <div className="pv2 h-mapa-pv2">
          <div className="mapa-caja h-mapa"><div className="mapa-rollo" id="hv2-mapa"><p className="h-cargando">Cargando el mapa…</p></div></div>
          <p className="h-mapa-nota">{CONT(slug) === 'América' ? 'Recorrido real con las paradas verificadas en los vídeos.' : 'Línea esquemática entre países: no es un track GPS.'} Toca otro país para ir a su historia.</p>
        </div>
      </section>

      <section className="h-vistazo">
        <div className="h-vistazo-in">
          <div>
            <p className="h-pista">antes de empezar</p>
            <h2>De un vistazo</h2>
            {entry.coverage ? <p className="h-cobertura">{entry.coverage}</p> : null}
          </div>
          <ol>{resumen.map((r, k) => <li key={k}>{entry.summary?.length ? r : <a href={`#cap-${titulados[k].k + 1}`}>{r}</a>}</li>)}</ol>
        </div>
      </section>

      <div className="h-capitulos" id="hv2-capitulos">
        <svg className="h-trazo" aria-hidden="true"><defs><mask id="h-revela"><path className="h-revela" fill="none" stroke="#fff" strokeWidth="8" /></mask></defs><path className="h-base" mask="url(#h-revela)" /><g className="h-puntos" /></svg>
        {capitulos.map((c, k) => {
          const lado = k % 2 ? 'der' : 'izq';
          const banda = k % 3 === 1 ? ' arena' : k % 3 === 2 && k === capitulos.length - 2 ? ' oscuro' : '';
          const [f1, f2, ...resto] = c.fotos;
          return (
            <section className={`h-cap ${lado}${banda}`} id={`cap-${k + 1}`} key={k} aria-labelledby={c.titulo ? `h-cap-${k + 1}` : undefined}>
              {k > 0 ? <Borde seed={k * 13 + i} /> : null}
              <div className="h-cap-in">
                {f1 ? <div className="h-fotos"><FotoRasgada f={f1} seed={k * 3 + i} cls="h-f1" />{f2 ? <FotoRasgada f={f2} seed={k * 5 + i + 100} cls="h-f2" /> : null}</div> : null}
                <div className={'h-cuerpo' + (f1 ? '' : ' solo')}>
                  <span className="h-ancla" aria-hidden="true" />
                  <span className="h-num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                  {c.titulo ? <h2 id={`h-cap-${k + 1}`}>{c.titulo}</h2> : null}
                  {c.bloques.map((b, j) => b.type === 'p' ? <p key={j}>{texto(b.value)}</p>
                    : b.type === 'h3' ? <h3 key={j}>{texto(b.value)}</h3>
                    : b.type === 'blockquote' ? <blockquote key={j}>{texto(b.value)}</blockquote>
                    : (b.type === 'ul' || b.type === 'ol') && Array.isArray(b.value) ? <ul key={j}>{b.value.map((x, n) => <li key={n}>{x}</li>)}</ul>
                    : b.type === 'html' && typeof b.value === 'string' ? <div key={j} className="h-rico" dangerouslySetInnerHTML={{ __html: b.value }} /> : null)}
                </div>
              </div>
              {resto.length ? <div className="h-galeria">{resto.map((f, n) => <img key={n} src={f.src} alt={f.alt} loading="lazy" />)}</div> : null}
            </section>
          );
        })}
      </div>

      {galeria.length ? (
        <section className="h-fotos-viaje" aria-labelledby="h-galeria">
          <Borde seed={i + 9} />
          <div className="h-dentro">
            <h2 id="h-galeria">Imágenes del viaje</h2>
            <p className="h-pista">{galeria.length} fotos de {pais}</p>
            <div className="h-mosaico">{galeria.map((f, n) => <img key={n} src={f.src} alt={f.alt} loading="lazy" />)}</div>
          </div>
        </section>
      ) : null}
      {videos.length ? (
        <section className="h-videos" aria-labelledby="h-videos">
          <Borde seed={i + 21} />
          <div className="h-dentro">
            <h2 id="h-videos">El viaje, en vídeo</h2>
            <p className="h-pista">los episodios de {pais}</p>
            <div className="h-rejilla" dangerouslySetInnerHTML={{ __html: videos.join('') }} />
          </div>
        </section>
      ) : null}

      <section className="h-siguiente" aria-labelledby="h-sig">
        <Borde seed={i + 33} />
        <div className="h-dentro h-sig-in">
          {sig ? <>
            <div id="hv2-sig" className="pv2 h-sello-sig" aria-hidden="true" />
            <div>
              <p className="h-pista">siguiente país</p>
              <h2 id="h-sig">{NOMBRES[sig]}</h2>
              <Link className="h-boton" href={`/viajes/viajar-en-bicicleta-por-${sig}/`}>Seguir a {NOMBRES[sig]} <span aria-hidden="true">→</span></Link>
              {ant ? <p className="h-ant"><Link href={`/viajes/viajar-en-bicicleta-por-${ant}/`}>← Volver a {NOMBRES[ant]}</Link></p> : null}
            </div>
          </> : <div>
            <p className="h-pista">fin del tramo pedaleado</p>
            <h2 id="h-sig">Aquí termina, de momento</h2>
            <Link className="h-boton" href="/#atlas">Volver al atlas <span aria-hidden="true">→</span></Link>
          </div>}
        </div>
      </section>
      <div className="pv2" dangerouslySetInnerHTML={{ __html: pie }} />
      <HistoriaCliente slug={slug} sig={sig || null} />
    </div>
  );
}
