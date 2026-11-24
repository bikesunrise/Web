import items from '@/data/content.json';
export type Block = { type: string; value: string | string[] };
export type Entry = { path: string; title: string; excerpt: string; image: string; date: string; kind: 'article' | 'page' | 'journey' | 'archive'; blocks: Block[]; summary?: string[]; coverage?: string };
export const entries = items as Entry[];
export const byPath = new Map(entries.map(e => [e.path, e]));
// Portadas de máxima calidad elegidas para cada artículo (contenido/heroes/heroes.py), con su crédito.
import heroes from '@/data/heroes.json';
type Hero = { src: string; credito: string; enlace: string; alt: string };
export function heroFor(entry: Entry): Hero | undefined {
  return (heroes as Record<string, Hero>)[entry.path];
}

export function imageFor(entry: Entry) {
  const hero = heroFor(entry);
  if (hero) return hero.src;
  if (entry.image?.startsWith('/images/') || entry.image?.startsWith('https://bikesunrise.com/')) return entry.image;
  const key = entry.path.toLowerCase();
  if (key.includes('nepal')) return '/images/nepal.jpg';
  if (key.includes('india')) return '/images/india.jpg';
  if (key.includes('pakistan')) return '/images/pakistan.jpg';
  if (key.includes('montenegro')) return '/images/montenegro.jpg';
  if (key.includes('ruta') || key.includes('eurovelo')) return '/images/routes.jpg';
  return '/images/journey.jpg';
}
export function category(path: string) {
  const first = path.split('/')[1];
  return ({viajes:'Expedición',rutas:'Ruta',resenas:'Reseña',eurovelo:'EuroVelo',seguros:'Seguros',herramientas:'Herramientas',viajar:'Guía'} as Record<string,string>)[first] || 'Guía';
}
export const archiveSources: Record<string,string[]> = {
  '/blog': ['article','journey'], '/portfolio/viajes': ['viajes'], '/portfolios':['viajes'],
  '/rutas':['rutas'], '/resenas':['resenas'], '/eurovelo':['eurovelo'],
  '/viajar':['viajar'], '/herramientas':['herramientas'], '/seguros':['seguros'],
  '/author/bikeadmin':['article','journey']
};
export function archiveItems(path: string) {
  const filters=archiveSources[path] || [];
  return entries.filter(e => e.path !== path && !['archive'].includes(e.kind) && (filters.includes(e.kind) || filters.some(f => e.path.startsWith('/'+f+'/'))))
    .sort((a,b) => Number(!!b.coverage)-Number(!!a.coverage) || b.date.localeCompare(a.date));
}
