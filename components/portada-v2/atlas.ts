// @ts-nocheck
// Generado por bocetos/portada-v2/exportar_next.py: no editar a mano.
// Interacción del atlas: cámara por país, bici que viaja, ficha con sello y tira de sellos.
export function iniciaAtlas(raiz, D) {

  const P = D.paises, N = P.length;
  const svg = raiz.querySelector('.atlas-mundo'), bici = svg.querySelector('.am-bici');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const movil = matchMedia('(max-width: 900px)');
  const MUNDO = D.vistas.mundo;
  let caja = MUNDO.slice(), tam = [0.62, 0.3], pos = [P[0].x, P[0].y], vista = 'mundo', cuadro = 0, actual = -1, reloj = 0;

  function encuadre(p) {            // la cámara encuadra el tramo de ruta de ese país
    const m = movil.matches, asp = m ? 1.1 : D.ancho / D.alto;
    const [x0, y0, x1, y1] = p.bb;
    const w = Math.max((x1 - x0) * 1.45, (y1 - y0) * 1.45 * asp), h = w / asp;
    return [(x0 + x1) / 2 - w * (m ? 0.5 : 0.58), (y0 + y1) / 2 - h * 0.5, w, h];
  }
  function pinta() {
    svg.setAttribute('viewBox', caja.map(v => v.toFixed(1)).join(' '));
    const k = svg.getBoundingClientRect().width / caja[2];
    if (!(k > 0)) return;
    svg.style.setProperty('--f', (tam[0] / k).toFixed(4));
    svg.style.setProperty('--fd', (tam[1] / k).toFixed(4));
    bici.setAttribute('transform', `translate(${pos[0].toFixed(1)},${(pos[1]).toFixed(1)}) scale(${(0.8 / k).toFixed(4)}) translate(0,-34)`);
  }
  function mueve(aCaja, aTam, aPos, v, ms) {
    const dc = caja.slice(), dt = tam.slice(), dp = pos.slice(), t0 = performance.now();
    if (v === 'mundo') svg.dataset.vista = v;
    vista = v; cancelAnimationFrame(cuadro);
    (function paso(t) {
      const p = quieto ? 1 : Math.min(1, (t - t0) / ms), e = p * p * (3 - 2 * p);
      caja = aCaja.map((x, i) => dc[i] + (x - dc[i]) * e);
      tam = aTam.map((x, i) => dt[i] + (x - dt[i]) * e);
      pos = aPos.map((x, i) => dp[i] + (x - dp[i]) * e);
      if (p >= 0.5) svg.dataset.vista = v;
      pinta();
      if (p < 1) cuadro = requestAnimationFrame(paso);
    })(t0);
  }
  const tamZoom = () => movil.matches ? [0.6, 0.5] : [0.68, 0.6];
  const tamMundo = () => movil.matches ? [0.55, 0.42] : [0.62, 0.3];

  // Sello de pasaporte de cada país: forma y tinta propias, y el nombre encima en su color
  function pasaporte(p, i, suf = '') {
    const s = p.sello, giro = [-7, 5, -4, 8, -6, 3, 6, -8, 4, -3][i % 10];
    const ico = `<use href="#d-${s.modo}" transform="translate(152,62) scale(.5)"/>`;
    const arco = (id, d) => `<path id="${id}" d="${d}" stroke="none"/>`;
    let f = '';
    if (s.forma === 'schengen') {
      const estrellas = Array.from({ length: 12 }, (_, k) => { const a = k * Math.PI / 6; return `<circle cx="${(44 + Math.cos(a) * 19).toFixed(1)}" cy="${(52 + Math.sin(a) * 19).toFixed(1)}" r="1.5" fill="currentColor" stroke="none"/>`; }).join('');
      f = `<rect x="8" y="22" width="184" height="106" rx="9"/>${estrellas}<text class="cod" x="44" y="57" text-anchor="middle">${s.cod}</text>
           <path class="fina" d="M140,36 h40 v34 h-40 z"/><use href="#d-${s.modo}" transform="translate(160,60) scale(.48)"/>
           <text x="100" y="42" text-anchor="middle">${s.arriba.length > 14 ? '' : s.arriba}</text><path class="fina" d="M20,100 H180"/><text x="100" y="118" text-anchor="middle">${s.arriba.length > 14 ? s.arriba : s.abajo}</text>`;
    } else if (s.forma === 'oval') {
      f = `<ellipse cx="100" cy="75" rx="94" ry="64"/><ellipse class="fina" cx="100" cy="75" rx="80" ry="50"/>
           ${arco('pa' + i + suf, 'M22,75 A78,52 0 0 1 178,75')}${arco('pb' + i + suf, 'M16,78 A84,58 0 0 0 184,78')}
           <text><textPath href="#pa${i}${suf}" startOffset="50%" text-anchor="middle">${s.arriba}</textPath></text>
           <text><textPath href="#pb${i}${suf}" startOffset="50%" text-anchor="middle">${s.abajo}</textPath></text>`;
    } else if (s.forma === 'circulo') {
      f = `<circle cx="100" cy="75" r="68"/><circle class="fina" cx="100" cy="75" r="53"/>
           ${arco('pa' + i + suf, 'M42,75 A58,58 0 0 1 158,75')}${arco('pb' + i + suf, 'M36,78 A64,64 0 0 0 164,78')}
           <text><textPath href="#pa${i}${suf}" startOffset="50%" text-anchor="middle" style="font-size:9.5px">${s.arriba}</textPath></text>
           <text><textPath href="#pb${i}${suf}" startOffset="50%" text-anchor="middle" style="font-size:9.5px">${s.abajo}</textPath></text>`;
    } else if (s.forma === 'hex') {
      f = `<path d="M40,14 H160 L196,75 L160,136 H40 L4,75 Z"/><path class="fina" d="M46,25 H154 L184,75 L154,125 H46 L16,75 Z"/>
           <text x="100" y="42" text-anchor="middle" style="font-size:10px">${s.arriba}</text><text x="100" y="118" text-anchor="middle" style="font-size:10px">${s.abajo}</text>`;
    } else {
      f = `<rect x="6" y="16" width="188" height="118" rx="3"/><rect class="fina" x="13" y="23" width="174" height="104" rx="2"/>
           <text x="100" y="42" text-anchor="middle" style="font-size:${s.arriba.length > 22 ? 9 : 11}px">${s.arriba}</text><path class="fina" d="M24,102 H176"/><text x="100" y="118" text-anchor="middle" style="font-size:10.5px">${s.abajo}</text>`;
    }
    if (s.forma !== 'schengen') f += `<use href="#d-${s.modo}" transform="translate(${s.forma === 'rect' ? 170 : 100},${s.forma === 'rect' ? 68 : s.forma === 'hex' ? 64 : 56}) scale(.4)"/>`;
    const tam = p.nombre.length > 12 ? 21 : p.nombre.length > 9 ? 25 : 30;
    return `<svg class="pasaporte" viewBox="0 0 200 150" style="color:${s.color}" aria-hidden="true"><g class="p-tinta" filter="url(#tinta)" transform="rotate(${giro} 100 75)">${f}</g><text class="p-nombre" x="100" y="${s.forma === 'schengen' ? 90 : 86}" text-anchor="middle" style="font-size:${tam}px">${p.nombre}</text></svg>`;
  }
  // Tira del viaje: cada país con su foto dentro de su silueta
  const tira = document.getElementById('tira');
  const foto = p => p.slug ? `img/paises/${p.slug}.${p.slug === 'mexico' ? 'webp' : 'jpg'}` : 'img/rutas.jpg';
  let cont = '';
  P.forEach((p, i) => {
    if (p.cont !== cont) { cont = p.cont; tira.insertAdjacentHTML('beforeend', `<li class="tira-cont" aria-hidden="true">${cont}</li>`); }
    // sello dibujado: la forma del país en dos tintas con su dibujo del atlas
    tira.insertAdjacentHTML('beforeend', `<li><button type="button" class="carta" data-i="${i}" aria-pressed="false" aria-label="${p.nombre}">${pasaporte(p, i)}<span class="c-num">${String(i + 1).padStart(2, '0')}</span></button></li>`);
  });
  svg.querySelectorAll('.am-pais').forEach((g, n) => g.style.setProperty('--n', n));

  function elige(i, acercar, desdeTira) {
    i = Math.max(0, Math.min(N - 1, i));
    const p = P[i]; actual = i;
    svg.querySelectorAll('.am-pais').forEach(g => g.classList.toggle('activo', +g.dataset.i === i));
    svg.querySelectorAll('.am-tierra').forEach(g => g.classList.toggle('activa', +g.dataset.i === i));
    if (acercar) svg.querySelectorAll('.am-detalle').forEach(g => g.classList.toggle('foco', +g.dataset.i === i));
    tira.querySelectorAll('.carta').forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i));
    document.getElementById('f-sello').innerHTML = pasaporte(p, i, 'f');
    document.getElementById('f-nombre').textContent = p.nombre;
    document.getElementById('f-texto').textContent = p.texto;
    document.getElementById('f-pos').textContent = `${i + 1} de ${N}`;
    document.getElementById('b-ant').disabled = i === 0;
    document.getElementById('b-sig').disabled = i === N - 1;
    const a = document.getElementById('f-enlace');
    a.href = p.href; a.firstChild.textContent = p.slug ? 'Leer la historia ' : 'Ver las rutas ';
    const carta = tira.querySelector(`.carta[data-i="${i}"]`);
    if (!desdeTira) tira.scrollTo({ left: carta.offsetLeft - tira.clientWidth / 2 + carta.offsetWidth / 2, behavior: quieto ? 'auto' : 'smooth' });
    if (acercar) mueve(encuadre(p), tamZoom(), [p.x, p.y], 'pais', 900);
    else mueve(caja, tam, [p.x, p.y], vista, 500);
  }
  function para() { clearInterval(reloj); reloj = 0; document.getElementById('b-play').classList.remove('sonando'); document.getElementById('b-play-txt').textContent = 'Recorrer el viaje'; }
  function suena() {
    document.getElementById('b-play').classList.add('sonando'); document.getElementById('b-play-txt').textContent = 'Pausar';
    elige(actual >= N - 1 || vista === 'mundo' ? 0 : actual + 1, true);
    reloj = setInterval(() => { if (actual >= N - 1) return para(); elige(actual + 1, true); }, 2800);
  }
  const fino = matchMedia('(hover: hover) and (pointer: fine)');
  svg.addEventListener('pointerover', e => { const g = e.target.closest('.am-pais,.am-tierra'); if (g && fino.matches && !reloj && +g.dataset.i !== actual) elige(+g.dataset.i, false); });
  svg.addEventListener('click', e => { const g = e.target.closest('.am-pais,.am-tierra'); if (g) { para(); elige(+g.dataset.i, true); } });
  svg.addEventListener('keydown', e => { const g = e.target.closest('.am-pais'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); para(); elige(+g.dataset.i, true); } });
  tira.addEventListener('click', e => { const b = e.target.closest('.carta'); if (b) { para(); elige(+b.dataset.i, true, true); document.querySelector('.mapa-caja').scrollIntoView({ block: 'nearest', behavior: quieto ? 'auto' : 'smooth' }); } });
  document.getElementById('b-ant').addEventListener('click', () => { para(); elige(actual - 1, true); });
  document.getElementById('b-sig').addEventListener('click', () => { para(); elige(actual + 1, true); });
  document.getElementById('t-ant').addEventListener('click', () => tira.scrollBy({ left: -tira.clientWidth * 0.8, behavior: quieto ? 'auto' : 'smooth' }));
  document.getElementById('t-sig').addEventListener('click', () => tira.scrollBy({ left: tira.clientWidth * 0.8, behavior: quieto ? 'auto' : 'smooth' }));
  document.getElementById('b-play').addEventListener('click', () => reloj ? para() : suena());
  document.getElementById('b-mundo').addEventListener('click', () => { para(); mueve(MUNDO, tamMundo(), pos, 'mundo', 800); });
  const ro = new ResizeObserver(pinta); ro.observe(svg);
  tam = tamMundo();
  elige(P.findIndex(p => p.slug === 'nepal'), false);

  return () => { para(); cancelAnimationFrame(cuadro); ro.disconnect(); tira.innerHTML = ''; };
}
