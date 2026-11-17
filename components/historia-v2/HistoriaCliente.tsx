'use client';
// Parte interactiva de la historia: mapa del país (el mismo atlas de la portada, acercado), sellos de
// pasaporte y la línea punteada que une los capítulos y se dibuja al bajar.
import { useEffect } from 'react';
import { pasaporte } from '../portada-v2/sello';

type Pais = { slug: string; nombre: string; reg: string; href: string; k: number; bb: number[]; sello: unknown };
type Datos = { paises: Pais[]; camino: number[][] };

export default function HistoriaCliente({ slug, sig }: { slug: string; sig: string | null }) {
  useEffect(() => {
    let vivo = true;
    const limpia: (() => void)[] = [];
    Promise.all([fetch('/portada/atlas-mundo.svg').then((r) => r.text()), fetch('/portada/atlas-mundo.json').then((r) => r.json())]).then(([svgTxt, D]: [string, Datos]) => {
      const hueco = document.getElementById('hv2-mapa');
      if (!vivo || !hueco) return;
      hueco.innerHTML = svgTxt;
      const svg = hueco.querySelector('svg') as SVGSVGElement;
      const i = D.paises.findIndex((p) => p.slug === slug);
      const p = D.paises[i];
      if (!svg || !p) return;
      svg.dataset.vista = 'pais';
      svg.querySelectorAll('.am-detalle').forEach((g) => g.classList.toggle('foco', +(g as HTMLElement).dataset.i! === i));
      svg.querySelectorAll('.am-tierra').forEach((g) => g.classList.toggle('activa', +(g as HTMLElement).dataset.i! === i));
      svg.querySelectorAll('.am-pais').forEach((g) => g.classList.toggle('activo', +(g as HTMLElement).dataset.i! === i));
      const bici = svg.querySelector('.am-bici') as SVGGElement | null;
      const [bx, by] = D.camino[p.k] || [0, 0];
      const encuadra = () => {
        const r = hueco.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const asp = r.width / r.height, [x0, y0, x1, y1] = p.bb;
        const w = Math.max((x1 - x0) * 1.5, (y1 - y0) * 1.5 * asp), h = w / asp;
        svg.setAttribute('viewBox', `${((x0 + x1) / 2 - w / 2).toFixed(1)} ${((y0 + y1) / 2 - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`);
        const k = r.width / w;
        svg.style.setProperty('--f', (0.7 / k).toFixed(4));
        svg.style.setProperty('--fd', (0.6 / k).toFixed(4));
        bici?.setAttribute('transform', `translate(${bx},${by}) scale(${(0.8 / k).toFixed(4)}) translate(0,-34)`);
        // los rótulos que se salgan del marco se desplazan hacia dentro
        requestAnimationFrame(() => {
          const caja = svg.getBoundingClientRect(), m = 8;
          svg.querySelectorAll<SVGTextElement>('.am-rotulos.foco text').forEach((t) => {
            if (t.dataset.x0 == null) t.dataset.x0 = t.getAttribute('x') || '0';
            t.setAttribute('x', t.dataset.x0);
            const q = t.getBoundingClientRect();
            if (!q.width) return;
            let dx = 0;
            if (q.width > caja.width - 2 * m) dx = (caja.left + caja.width / 2 - (q.left + q.width / 2)) / k;
            else if (q.left < caja.left + m) dx = (caja.left + m - q.left) / k;
            else if (q.right > caja.right - m) dx = -(q.right - (caja.right - m)) / k;
            if (dx) t.setAttribute('x', (parseFloat(t.dataset.x0) + dx).toFixed(2));
          });
        });
      };
      encuadra();
      const ro = new ResizeObserver(encuadra); ro.observe(hueco); limpia.push(() => ro.disconnect());
      // tocar otro país lleva a su historia
      svg.addEventListener('click', (e) => {
        const g = (e.target as Element).closest('.am-pais,.am-tierra') as HTMLElement | null;
        if (!g) return;
        const q = D.paises[+g.dataset.i!];
        if (q && q.slug !== slug) window.location.href = q.href;
      });
      // sellos
      const sello = document.getElementById('hv2-sello');
      if (sello) sello.innerHTML = pasaporte(p, i, 'h');
      const j = D.paises.findIndex((q) => q.slug === sig);
      const s2 = document.getElementById('hv2-sig');
      if (s2 && j >= 0) s2.innerHTML = pasaporte(D.paises[j], j, 's');
    });

    // línea punteada entre capítulos (como el mapa de la portada): pasa por los márgenes y se dibuja al bajar
    const cont = document.getElementById('hv2-capitulos');
    if (cont) {
      const svg = cont.querySelector('svg.h-trazo') as SVGSVGElement;
      const base = svg.querySelector('.h-base') as SVGPathElement, rev = svg.querySelector('.h-revela') as SVGPathElement, puntos = svg.querySelector('.h-puntos')!;
      const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
      let largo = 0;
      const avanza = () => {
        if (quieto) { rev.style.strokeDashoffset = '0'; return; }
        const r = cont.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
        rev.style.strokeDashoffset = String(largo * (1 - f));
      };
      const dibuja = () => {
        const r0 = cont.getBoundingClientRect();
        const pts = [...cont.querySelectorAll('.h-cap')].map((sec) => {
          const a = sec.querySelector('.h-ancla')!.getBoundingClientRect(), r = sec.getBoundingClientRect();
          return { x: a.left - r0.left, y: a.top - r0.top, top: r.top - r0.top, bot: r.bottom - r0.top };
        });
        if (!pts.length) return;
        svg.setAttribute('viewBox', `0 0 ${r0.width} ${r0.height}`);
        let d = `M${pts[0].x},${Math.max(0, pts[0].y - 140)} L${pts[0].x},${pts[0].y}`;
        for (let n = 1; n < pts.length; n++) {
          const a = pts[n - 1], b = pts[n], y0 = a.bot - 50, y1 = b.top + 50, dy = (y1 - y0) * 0.9;
          d += ` L${a.x},${y0} C${a.x},${y0 + dy} ${b.x},${y1 - dy} ${b.x},${y1} L${b.x},${b.y}`;
        }
        const u = pts[pts.length - 1];
        d += ` L${u.x},${u.bot - 30}`;
        base.setAttribute('d', d); rev.setAttribute('d', d);
        puntos.innerHTML = pts.map(({ x, y }) => `<circle class="h-halo" cx="${x}" cy="${y}" r="11"/><circle class="h-punto" cx="${x}" cy="${y}" r="5"/>`).join('');
        largo = rev.getTotalLength();
        rev.style.strokeDasharray = String(largo);
        avanza();
      };
      const ro = new ResizeObserver(dibuja); ro.observe(cont);
      addEventListener('scroll', avanza, { passive: true });
      limpia.push(() => { ro.disconnect(); removeEventListener('scroll', avanza); });
    }
    return () => { vivo = false; limpia.forEach((f) => f()); };
  }, [slug, sig]);
  return null;
}
