// Páginas por tipo de material (/material/<tipo>/): cabecera con patrón, todos los productos de ese tipo
// y los artículos de Bikesunrise sobre el tema. Los tipos están en data/material-tipos.json.
// Más adelante cada producto tendrá su página en /material/<tipo>/<producto>/ cuando tenga reseña.
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Backpack, Camera, Tent, Bike } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { catalogo as gear } from '@/lib/material';
import tipos from '@/data/material-tipos.json';
import { byPath } from '@/lib/content';
import FiltroMaterial from '@/components/FiltroMaterial';

type Tipo = { slug: string; categoria: string; h1: string; titulo: string; intro: string; relacionados: string[] };
type Props = { params: Promise<{ tipo: string }> };
const TIPOS = tipos as Tipo[];

export function generateStaticParams() {
  return TIPOS.map((t) => ({ tipo: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  const t = TIPOS.find((x) => x.slug === tipo);
  if (!t) return {};
  return { title: t.titulo, description: t.intro.slice(0, 158), alternates: { canonical: `/material/${t.slug}/` } };
}

export default async function TipoMaterial({ params }: Props) {
  const { tipo } = await params;
  const t = TIPOS.find((x) => x.slug === tipo);
  if (!t) notFound();
  // primero lo que tiene foto y enlace, después el resto
  const items = gear.filter((p) => p.category === t.categoria).sort((a, b) => Number(!!b.image) - Number(!!a.image));
  const Icon = t.categoria.includes('campaña') ? Tent : t.categoria.includes('Grabación') ? Camera : t.categoria.includes('bici') || t.categoria === 'Componentes' ? Bike : Backpack;
  const cuentas: Record<string, number> = {};
  gear.forEach((p) => { cuentas[p.category] = (cuentas[p.category] || 0) + 1; });
  const leer = t.relacionados.map((p) => byPath.get(p)).filter(Boolean);
  return (
    <>
      <Header />
      <main className="inner-page archive-page">
        <section className="archive-hero editorial-hero topographic-hero patron-hero">
          <div>
            <span className="section-kicker"><Link href="/material-para-bikepacking/">MATERIAL</Link> / {t.h1.toUpperCase()}</span>
            <h1>{t.h1}</h1>
            <p>{t.intro}</p>
          </div>
          <div className="archive-hero-photo" style={{ backgroundImage: "url('/images/patrones/material.svg')" }} />
        </section>
        <div className="gear-layout tipo-layout">
          <aside className="gear-filter">
            <FiltroMaterial actual={t.categoria} cuentas={cuentas} total={gear.length} />
          </aside>
          <section className="gear-results">
            <p className="gear-note">Los productos con enlace a Amazon son enlaces de afiliación: como afiliado de Amazon, obtengo ingresos por las compras adecuadas, sin coste extra para ti. Los demás llevan a la web de su marca. Iré publicando reseñas.</p>
            <p className="eyebrow">{items.length} OBJETOS / {t.categoria.toUpperCase()}</p>
            <div className="gear-grid">
              {items.map((p, i) => (
                <article key={p.title} className="gear-item">
                  <div className="gear-object">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <Icon size={40} strokeWidth={0.8} />}
                  </div>
                  <small>{p.category}</small>
                  <h2>{p.title}</h2>
                  <p>{p.description}</p>
                  <div>
                    {p.url ? (p.url.includes('amazon.') ? <a href={p.url} target="_blank" rel="sponsored nofollow noopener noreferrer">Ver producto ↗</a> : <a href={p.url} target="_blank" rel="nofollow noopener noreferrer">Ver producto ↗</a>) : <span className="gear-pronto">Reseña próximamente</span>}
                    {p.review ? <a href={p.review}>Leer reseña →</a> : null}
                  </div>
                </article>
              ))}
            </div>
            {leer.length ? (
              <section className="tipo-leer" aria-labelledby="tipo-leer">
                <h2 id="tipo-leer">Para leer sobre {t.h1.toLowerCase()}</h2>
                <ul>{leer.map((e) => e && <li key={e.path}><Link href={`${e.path}/`}>{e.title} →</Link></li>)}</ul>
              </section>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
