// @ts-nocheck
// Generado por bocetos/portada-v2/exportar_next.py: no editar a mano.
export function pasaporte(p, i, suf = '') {
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
           <text><textPath href="#pa${i}${suf}" startOffset="50%" text-anchor="middle" style="font-size:7.4px">${s.arriba}</textPath></text>
           <text><textPath href="#pb${i}${suf}" startOffset="50%" text-anchor="middle" style="font-size:7.4px">${s.abajo}</textPath></text>`;
    } else if (s.forma === 'hex') {
      f = `<path d="M40,14 H160 L196,75 L160,136 H40 L4,75 Z"/><path class="fina" d="M46,25 H154 L184,75 L154,125 H46 L16,75 Z"/>
           <text x="100" y="42" text-anchor="middle" style="font-size:7.6px">${s.arriba}</text><text x="100" y="118" text-anchor="middle" style="font-size:7.6px">${s.abajo}</text>`;
    } else {
      f = `<rect x="6" y="16" width="188" height="118" rx="3"/><rect class="fina" x="13" y="23" width="174" height="104" rx="2"/>
           <text x="100" y="42" text-anchor="middle" style="font-size:${s.arriba.length > 22 ? 6.8 : 8.6}px">${s.arriba}</text><path class="fina" d="M24,102 H176"/><text x="100" y="118" text-anchor="middle" style="font-size:8px">${s.abajo}</text>`;
    }
    if (s.forma !== 'schengen') f += `<use href="#d-${s.modo}" transform="translate(${s.forma === 'rect' ? 170 : 100},${s.forma === 'rect' ? 68 : s.forma === 'hex' ? 64 : 56}) scale(.4)"/>`;
    const tam = p.nombre.length > 12 ? 21 : p.nombre.length > 9 ? 25 : 30;
    return `<svg class="pasaporte" viewBox="0 0 200 150" style="color:${s.color}" aria-hidden="true"><g class="p-tinta" filter="url(#tinta)" transform="rotate(${giro} 100 75)">${f}</g><text class="p-nombre" x="100" y="${s.forma === 'schengen' ? 90 : 86}" text-anchor="middle" style="font-size:${tam}px">${p.nombre}</text></svg>`;
  }
