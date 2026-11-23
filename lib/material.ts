import gear from '@/data/gear.json';

// Catálogo que se muestra en la web: solo productos con foto oficial de la marca.
// Los que aún no tienen foto siguen en data/gear.json y aparecen solos en cuanto se les añade una.
export const catalogo = gear.filter((p) => p.image);

// «Más de 700», «Más de 800»…: el número redondeado hacia abajo, para los textos.
export const masDe = `Más de ${Math.floor(catalogo.length / 100) * 100}`;
