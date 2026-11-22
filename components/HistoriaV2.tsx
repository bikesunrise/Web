// Página de historia por país con el estilo de la portada (atlas ilustrado, sellos, fotos con borde pintado).
// El contenido sale de data/content.json; en América las fotos son fotogramas 4K reales de los vídeos
// (components/historia-v2/fotos.json, generado por bocetos/historias-v2/exportar_fotos.py).
import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import type React from 'react';
import type { Entry, Block } from '@/lib/content';
import { imageFor, byPath } from '@/lib/content';
import fotosAmerica from './historia-v2/fotos.json';
import trazos from './historia-v2/trazos.json';
import heroes from './historia-v2/heroes.json';
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

// cabecera ilustrada por capas (bocetos/historias-v2/heroes_ilustrados.py): el fondo (cielo y cordilleras), el título
// y, delante, las colinas cercanas con el rasgo del país. Medidas en fracciones del dibujo (0 a 1):
// fx/fxm: punto que queda a la vista al recortar (fxm en móvil); fin/finm: dónde tiene que acabar el título; base/basem: su línea base
type Ilu = { fx: number; fxm: number; fy: number; fin: number; finm: number; base: number; basem: number; tam: number; alt: string; tinta: string; cielo: string; ar: number };
export const heroIlustrado = (slug: string): Ilu | null =>
  (heroes as Record<string, Ilu>)[slug] && fs.existsSync(path.join(process.cwd(), 'public/historias', slug, 'hero-frente.svg')) ? (heroes as Record<string, Ilu>)[slug] : null;

type Trazo = { w: number; h: number; puntos: { x: number; y: number; modo: string }[]; inicio: { lugar: string; ep: number | null }; fin: { lugar: string; ep: number | null } };
// trazo del recorrido por el país (bocetos/historias-v2/trazos.py): línea continua en bici, discontinua en bus, ferry o avión
function TrazoRuta({ t, pais }: { t: Trazo; pais: string }) {
  const P = t.puntos, a = P[0], z = P[P.length - 1];
  const tramos = P.slice(1).map((q, n) => ({ d: `M${P[n].x},${P[n].y} L${q.x},${q.y}`, salto: q.modo !== 'pedal' }));
  // la etiqueta del inicio va encima del punto y la del final debajo, así no pisan la línea
  const ancla = (q: { x: number }) => (q.x < t.w * 0.3 ? 'start' : q.x > t.w * 0.7 ? 'end' : 'middle');
  const dx = (q: { x: number }) => (ancla(q) === 'start' ? -4 : ancla(q) === 'end' ? 4 : 0);
  return (
    <svg className="b-trazo" viewBox={`-50 -34 ${t.w + 100} ${t.h + 80}`} role="img" aria-label={`Recorrido en bicicleta por ${pais}, de ${t.inicio.lugar} a ${t.fin.lugar}`}>
      {tramos.map((s2, n) => <path key={n} d={s2.d} className={s2.salto ? 'salto' : undefined} />)}
      {P.map((q, n) => (n === 0 || n === P.length - 1 ? null : <circle key={n} cx={q.x} cy={q.y} r="1.6" className="parada" />))}
      {[a, z].map((q, n) => <circle key={'e' + n} cx={q.x} cy={q.y} r="4.2" className="extremo" />)}
      {([[a, t.inicio, -1], [z, t.fin, 1]] as const).map(([q, e, v], n) => (
        <text key={'t' + n} textAnchor={ancla(q)}>
          {e.ep ? <tspan className="ep" x={q.x + dx(q)} y={v < 0 ? q.y - 25 : q.y + 22}>EP.{e.ep}</tspan> : null}
          <tspan className="lugar" x={q.x + dx(q)} y={v < 0 ? q.y - 11 : q.y + (e.ep ? 37 : 24)}>{e.lugar}</tspan>
        </text>
      ))}
    </svg>
  );
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
  const capa = heroIlustrado(slug);
  const hero: Foto = am?.hero || { src: imageFor(entry), alt: `Paisaje del viaje en bicicleta por ${pais}` };
  const lede = intro.find((b) => b.type === 'p');
  const titulados = capitulos.map((c, k) => ({ t: c.titulo, k })).filter((x) => x.t);
  const resumen = entry.summary?.length ? entry.summary : titulados.map((x) => x.t);
  const i = ORDEN.indexOf(slug);
  const sig = ORDEN[i + 1];
  const ant = i > 1 ? ORDEN[i - 1] : '';
  const portadaDe = (s2: string) => (fotosAmerica as Record<string, { hero: Foto }>)[s2]?.hero.src
    || imageFor(byPath.get(`/viajes/viajar-en-bicicleta-por-${s2}`) || entry);
  // el resto de países del viaje, en orden, para el lateral
  const vecinas = ORDEN.filter((s2) => s2 && s2 !== slug);
  // fotos: la primera de cada capítulo va a lo ancho tras el primer párrafo; la segunda, emparejada con otra
  // de la galería, va más abajo en el mismo capítulo, así las imágenes acompañan todo el relato
  const pares: Foto[][] = capitulos.map((c) => {
    const resto = c.fotos.slice(1);
    if (c.bloques.length < 2) return [];
    while (resto.length < 2 && galeria.length) resto.push(galeria.shift() as Foto);
    return resto.slice(0, 2);
  });

  // frase para destacar en una caja: una del propio capítulo, mejor si tiene peso personal (lo que sentí, aprendí, decidí...)
  const destacada = (c: Capitulo): string | null => {
    const frases = c.bloques.filter((b) => b.type === 'p').flatMap((b) => String(texto(b.value)).split(/(?<=[.!?])\s+/));
    let mejor: string | null = null, nota = -99;
    for (const f of frases) {
      const t = f.trim().replace(/\s+([.,;:!?])/g, '$1');
      if (t.length < 60 || t.length > 190) continue;
      let n = 0;
      if (/(aprend|entend|sent[ií]|recuerd|nunca|siempre|lo mejor|lo más|me di cuenta|pens[eé]|decid[ií]|me enseñ|no olvid|me sorprend)/i.test(t)) n += 3;
      if (/\b(me|mi|yo|nos)\b/i.test(t)) n += 1;
      if (/^(Después|Luego|Al día|Por la|Esa noche|Tras)/.test(t)) n -= 2;
      if (/[:¿?]/.test(t)) n -= 1;
      if (n > nota) { nota = n; mejor = t; }
    }
    // si no hay ninguna frase con peso personal, vale la mejor de buena longitud del capítulo
    return mejor;
  };
  const pieFoto = (f: Foto) => (f.yt ? <>{f.alt} · <a href={`https://www.youtube.com/watch?v=${f.yt}&t=${f.t}s`} target="_blank" rel="noopener noreferrer">EP.{f.ep}, {mmss(f.t)}</a></> : null);
  const Destacado = ({ texto: t, oscuro }: { texto: string; oscuro: boolean }) => (
    <aside className={'b-caja b-destacado' + (oscuro ? ' b-destacado--oscuro' : '')}><p>{t}</p></aside>
  );
  const FotoLimpia = ({ f, cls = '' }: { f: Foto; cls?: string }) => (
    <figure className={'b-foto ' + cls}>
      <img src={f.src} alt={f.alt} loading="lazy" />
      {f.yt ? <figcaption>{pieFoto(f)}</figcaption> : null}
    </figure>
  );
  const bloque = (b: Block, j: number, cap = false) => b.type === 'p' ? <p key={j} className={cap ? 'b-capital' : undefined}>{texto(b.value)}</p>
    : b.type === 'h3' ? <h3 key={j}>{texto(b.value)}</h3>
    : b.type === 'blockquote' ? <blockquote key={j}>{texto(b.value)}</blockquote>
    : (b.type === 'ul' || b.type === 'ol') && Array.isArray(b.value) ? <ul key={j}>{b.value.map((x, n) => <li key={n}>{x}</li>)}</ul>
    : b.type === 'html' && typeof b.value === 'string' ? <div key={j} className="b-rico" dangerouslySetInnerHTML={{ __html: b.value }} /> : null;

  return (
    <div className="hv2 hv3">
      <div dangerouslySetInnerHTML={{ __html: filtroTinta }} />
      <header className={'b-hero' + (capa ? ' b-hero--capas b-hero--ilu' : '')}
        style={{ '--fxd': capa?.fx ?? 0.5, '--fxm': capa?.fxm ?? capa?.fx ?? 0.5, '--fy': capa?.fy ?? 0.5, '--ix': 0, '--ar': capa?.ar ?? 16 / 9, '--tinta': capa?.tinta ?? '#fff', '--cielo': capa?.cielo ?? '#1d2a26', '--find': capa?.fin ?? 1, '--finm': capa?.finm ?? capa?.fin ?? 1, '--based': capa?.base ?? 0.62, '--basem': capa?.basem ?? capa?.base ?? 0.62, '--tam': capa?.tam ?? 0.145, '--letras': Math.max(6, ...pais.split(' ').map((w) => w.length)) } as React.CSSProperties}>
        {/* la escena tiene la proporción de la foto y la cubre entera: el título se ancla a ella y no se descuadra */}
        <div className="b-escena">
          <img className="b-hero-fondo" src={capa ? `/historias/${slug}/hero-fondo.svg` : hero.src} alt={capa ? '' : hero.alt} fetchPriority="high" />
          {capa ? <img className="b-hero-frente" src={`/historias/${slug}/hero-frente.svg`} alt={capa.alt} /> : null}
        </div>
        <div className="b-hero-txt">
          <p className="b-hero-pre">Viajar en bicicleta por</p>
          <h1><span className="sr-only">Viajar en bicicleta por </span>{pais}</h1>
        </div>
        {(trazos as Record<string, Trazo>)[slug] ? <TrazoRuta t={(trazos as Record<string, Trazo>)[slug]} pais={pais} /> : null}
        <div className="b-hero-pie">
          <p className="b-ruta"><Link href="/portfolio/viajes/">Historias</Link> <span aria-hidden="true">›</span> {CONT(slug)}</p>
          <a className="b-hero-leer" href="#b-leer">Empezar a leer <span aria-hidden="true">↓</span></a>
        </div>
      </header>

      <div className="b-rejilla">
        <article className="b-main" id="b-leer">
          {lede ? <p className="b-lede">{texto(lede.value)}</p> : <p className="b-lede">{entry.excerpt}</p>}

          <aside className="b-caja b-vistazo" aria-labelledby="b-vistazo">
            <h2 id="b-vistazo">De un vistazo</h2>
            <ol>{resumen.map((r, k) => <li key={k}>{entry.summary?.length ? r : <a href={`#cap-${titulados[k].k + 1}`}>{r}</a>}</li>)}</ol>
          </aside>

          {videos.length ? (
            <section className="b-caja b-videos b-videos-arriba" aria-labelledby="b-videos">
              <h2 id="b-videos">El viaje, en vídeo <small>{videos.length} episodios · desliza</small></h2>
              <div className="b-videos-rej" dangerouslySetInnerHTML={{ __html: videos.join('') }} />
            </section>
          ) : null}

          {capitulos.map((c, k) => {
            const [f1] = c.fotos;
            // una caja destacada cada dos capítulos para cortar la alternancia de texto e imagen
            const frase = k % 2 === 1 ? destacada(c) : null;
            const nDest = Math.floor(k / 2);
            const tras = c.bloques.length >= 4 ? 1 : 0;
            const par = pares[k];
            const luego = par.length ? Math.max(tras + 1, Math.floor(c.bloques.length * 0.7)) : -1;
            const pareja = par.length === 2
              ? <div className="b-par"><FotoLimpia f={par[0]} /><FotoLimpia f={par[1]} /></div>
              : par.length === 1 ? <FotoLimpia f={par[0]} /> : null;
            return (
              <section className="b-cap" id={`cap-${k + 1}`} key={k} aria-labelledby={c.titulo ? `b-cap-${k + 1}` : undefined}>
                {c.titulo ? <h2 id={`b-cap-${k + 1}`}>{c.titulo}</h2> : null}
                {frase && c.bloques.length < 3 ? <Destacado texto={frase} oscuro={nDest % 2 === 1} /> : null}
                {c.bloques.map((b, j) => <span key={j} className="b-trozo">{bloque(b, j, j === 0 && !!c.titulo)}{j === tras && f1 ? <FotoLimpia f={f1} /> : null}{frase && c.bloques.length >= 3 && j === (tras === 1 ? 2 : 1) && j !== Math.min(luego, c.bloques.length - 1) ? <Destacado texto={frase} oscuro={nDest % 2 === 1} /> : null}{j === Math.min(luego, c.bloques.length - 1) ? pareja : null}</span>)}
              </section>
            );
          })}


          {galeria.length ? (
            <section className="b-galeria" aria-labelledby="b-galeria">
              <h2 id="b-galeria">Más imágenes de {pais}</h2>
              <div className="b-mosaico">{galeria.map((f, n) => <img key={n} src={f.src} alt={f.alt} loading="lazy" />)}</div>
            </section>
          ) : null}

          <section className="b-caja b-siguiente" aria-labelledby="b-sig">
            {sig ? <>
              <div id="hv2-sig" className="pv2 b-sello-sig" aria-hidden="true" />
              <div>
                <p className="b-pista">Siguiente país del viaje</p>
                <h2 id="b-sig">{NOMBRES[sig]}</h2>
                <Link className="b-boton" href={`/viajes/viajar-en-bicicleta-por-${sig}/`}>Seguir a {NOMBRES[sig]} <span aria-hidden="true">→</span></Link>
                {ant ? <p className="b-ant"><Link href={`/viajes/viajar-en-bicicleta-por-${ant}/`}>← Volver a {NOMBRES[ant]}</Link></p> : null}
              </div>
            </> : <div>
              <p className="b-pista">Fin del tramo pedaleado</p>
              <h2 id="b-sig">Aquí termina, de momento</h2>
              <Link className="b-boton" href="/">Volver al inicio <span aria-hidden="true">→</span></Link>
            </div>}
          </section>
        </article>

        <aside className="b-lado" aria-label={`Más sobre ${pais}`}>
          <section className="b-tarjeta b-mapa-t" aria-labelledby="b-mapa">
            <div id="hv2-sello" className="pv2 b-sello" aria-hidden="true" />
            <h2 id="b-mapa">La ruta por {pais}</h2>
            <div className="pv2 b-mapa-pv2"><div className="mapa-caja b-mapa"><div className="mapa-rollo" id="hv2-mapa"><p className="b-cargando">Cargando el mapa…</p></div></div></div>
            <p className="b-nota">{CONT(slug) === 'América' ? 'Recorrido real, con las paradas de los vídeos.' : 'Línea esquemática entre países.'} Toca otro país para ir a su historia.</p>
          </section>

          <section className="b-tarjeta b-mas" aria-labelledby="b-mas">
            <h2 id="b-mas">El resto del viaje</h2>
            <div className="b-teselas">{vecinas.map((s2) => (
              <Link key={s2} href={`/viajes/viajar-en-bicicleta-por-${s2}/`} className="b-tesela"><img src={portadaDe(s2)} alt="" loading="lazy" /><span>{NOMBRES[s2]}</span></Link>
            ))}</div>
          </section>

        </aside>
      </div>

      <div className="pv2" dangerouslySetInnerHTML={{ __html: pie }} />
      <HistoriaCliente slug={slug} sig={sig || null} />
    </div>
  );
}
